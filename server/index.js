import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import crypto from 'crypto';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

import { analyzeFrequencySpectrum } from './forensics/fourierAnalysis.js';
import { analyzeNoiseResidual } from './forensics/noiseResidualAnalysis.js';
import { analyzeEdgeAndOpticalGradients } from './forensics/edgeGradientAnalysis.js';
import { analyzeMetadataProvenance } from './forensics/metadataProvenance.js';
import { analyzeVisualContent } from './forensics/visualContentAnalysis.js';
import { runDeepLearningClassifier } from './forensics/deepLearningDetector.js';
import { analyzeSherloqForensics } from './forensics/sherloqForensics.js';
import { fuseForensicSignals } from './forensics/ensembleFusion.js';

dotenv.config();

const app = express();
// Default to 10000 on Render or production; fallback to 3001 for local dev
const PORT = parseInt(process.env.PORT, 10) || (process.env.RENDER ? 10000 : 3001);
const MAX_FILE_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE_MB || '15', 10);

// Universal CORS configuration — allows Vercel deployments, custom domains, and localhost
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-api-key', 'x-huggingface-key', 'x-gemini-key']
}));

// Request size limits
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// In-memory cache for duplicate request prevention (SHA-256 keyed)
const analysisCache = new Map();
const MAX_CACHE_SIZE = 50;

// Configure Multer for in-memory buffer processing (privacy-safe, zero disk retention)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE_MB * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype) || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed formats: JPG, PNG, WEBP.`));
    }
  }
});

// Root informational endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    service: 'VERILENS Forensic Detection Backend',
    version: '2.0.0',
    status: 'online',
    uptime: Math.floor(process.uptime()),
    endpoints: {
      health: 'GET /health',
      apiHealth: 'GET /api/health',
      detect: 'POST /api/detect'
    },
    timestamp: new Date().toISOString()
  });
});

// Primary Health-check endpoint for Render web service monitoring
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'verilens-backend',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Extended Forensic Telemetry endpoint (used by VERILENS frontend client)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'verilens-backend',
    version: '2.0.0',
    uptime: Math.floor(process.uptime()),
    deepLearningConfigured: Boolean(
      process.env.HUGGINGFACE_API_KEY ||
      (process.env.SIGHTENGINE_API_USER && process.env.SIGHTENGINE_API_SECRET) ||
      process.env.HIVE_API_KEY ||
      process.env.CUSTOM_DETECTION_API_URL
    ),
    timestamp: new Date().toISOString()
  });
});

// Main Detection Endpoint
app.post('/api/detect', upload.single('image'), async (req, res) => {
  const startTime = Date.now();

  try {
    let fileBuffer = req.file?.buffer;
    let fileName = req.file?.originalname || 'uploaded_image';
    let mimeType = req.file?.mimetype || 'image/jpeg';
    let fileSize = req.file?.size || 0;

    // Support Base64 JSON fallback if not sent as multipart
    if (!fileBuffer && req.body?.imageBase64) {
      const b64Data = req.body.imageBase64.replace(/^data:image\/\w+;base64,/, '');
      fileBuffer = Buffer.from(b64Data, 'base64');
      fileName = req.body.fileName || 'uploaded_image.png';
      mimeType = req.body.mimeType || 'image/png';
      fileSize = fileBuffer.length;
    }

    if (!fileBuffer || fileBuffer.length === 0) {
      return res.status(400).json({
        error: 'No valid image data provided for analysis.'
      });
    }

    // 1. Calculate Cryptographic SHA-256 Hash for integrity & cache lookup
    const sha256Hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Check duplicate request cache
    if (analysisCache.has(sha256Hash)) {
      const cached = analysisCache.get(sha256Hash);
      return res.json({
        ...cached,
        isCached: true,
        executionTimeMs: Date.now() - startTime
      });
    }

    // 2. Decode image and extract raw pixel buffers via Sharp
    const sharpInstance = sharp(fileBuffer);
    const metadata = await sharpInstance.metadata();

    const width = metadata.width || 800;
    const height = metadata.height || 600;

    // Scale to a maximum dimension of 512 for fast, lightweight signal processing
    // while retaining diffusion noise, FFT lattice, and chromatic metrics
    const maxDim = 512;
    const scale = Math.min(maxDim / width, maxDim / height, 1);
    const procWidth = Math.round(width * scale);
    const procHeight = Math.round(height * scale);

    const resizedInstance = scale < 1 
      ? sharpInstance.resize(procWidth, procHeight, { kernel: 'lanczos3' })
      : sharpInstance;

    // Extract Grayscale pixels (8-bit) for 2D Fourier & PRNU noise analysis
    const grayBuffer = await resizedInstance
      .clone()
      .grayscale()
      .raw()
      .toBuffer();

    // Extract RGB pixels (24-bit) for chromatic dispersion & optical edge inspection
    const rgbBuffer = await resizedInstance
      .clone()
      .removeAlpha()
      .raw()
      .toBuffer();

    // Optional client-supplied API credentials from request headers or body
    const clientHfKey = req.headers['x-huggingface-key'] || req.headers['x-api-key'] || req.body?.apiKey;
    const clientGeminiKey = req.headers['x-gemini-key'];

    // 3. Parallel Multi-Signal Forensic Pipeline Execution
    const [
      metaProvenance,
      fourierAnalysis,
      noiseAnalysis,
      gradientAnalysis,
      visualContent,
      dlModelResult,
      sherloqAnalysis
    ] = await Promise.all([
      analyzeMetadataProvenance(fileBuffer, mimeType, fileName),
      analyzeFrequencySpectrum(new Uint8Array(grayBuffer), procWidth, procHeight),
      analyzeNoiseResidual(new Uint8Array(grayBuffer), procWidth, procHeight, mimeType),
      analyzeEdgeAndOpticalGradients(new Uint8Array(rgbBuffer), procWidth, procHeight),
      analyzeVisualContent(new Uint8Array(rgbBuffer), new Uint8Array(grayBuffer), procWidth, procHeight, metadata),
      runDeepLearningClassifier(fileBuffer, mimeType, { hfKey: clientHfKey, geminiKey: clientGeminiKey }),
      analyzeSherloqForensics({ fileBuffer, rgbBuffer, grayBuffer, width: procWidth, height: procHeight, mimeType })
    ]);

    // 4. Ensemble Fusion & Calibrated Uncertainty Assessment
    const fusedAssessment = fuseForensicSignals({
      deepLearning: dlModelResult,
      fourier: fourierAnalysis,
      noise: noiseAnalysis,
      gradients: gradientAnalysis,
      metadata: metaProvenance,
      visualContent,
      sherloq: sherloqAnalysis,
      imageMeta: { width, height, procWidth, procHeight }
    });

    // 5. Structure Final Standardized Response
    const responseData = {
      id: 'VRL-' + crypto.randomBytes(4).toString('hex').toUpperCase(),
      timestamp: new Date().toISOString(),
      executionTimeMs: Date.now() - startTime,
      isRealEngine: true,
      verdict: fusedAssessment.verdict,
      verdictLevel: fusedAssessment.verdictLevel,
      aiScore: fusedAssessment.aiScore,
      realScore: fusedAssessment.realScore,
      confidence: fusedAssessment.confidence,
      confidenceLevel: fusedAssessment.confidenceLevel,
      summary: fusedAssessment.summary,
      sceneTitle: fusedAssessment.sceneTitle,
      sceneType: fusedAssessment.sceneType,
      visualContent: fusedAssessment.visualContent,
      visualObservations: fusedAssessment.visualObservations || [],
      modelStatus: fusedAssessment.modelStatus,
      modelName: fusedAssessment.modelName,
      signalDisparity: fusedAssessment.signalDisparity,
      isUncertain: fusedAssessment.isUncertain,
      sherloq: fusedAssessment.sherloq || null,
      anomalies: fusedAssessment.anomalies,
      authenticSignals: fusedAssessment.authenticSignals,
      limitations: fusedAssessment.limitations,
      pillars: [
        {
          name: 'Deep Learning Vision Model',
          score: dlModelResult.isAvailable ? Math.round(dlModelResult.aiProbability * 100) : 50,
          status: dlModelResult.isAvailable 
            ? (dlModelResult.aiProbability >= 0.65 ? 'Synthetic Flag' : dlModelResult.aiProbability <= 0.35 ? 'Authentic' : 'Ambiguous')
            : 'Unconfigured (.env)',
          color: dlModelResult.isAvailable 
            ? (dlModelResult.aiProbability >= 0.65 ? 'red' : dlModelResult.aiProbability <= 0.35 ? 'emerald' : 'amber')
            : 'amber'
        },
        {
          name: 'Visual Content & Composition',
          score: visualContent.isValid ? (visualContent.sceneType === 'portrait' ? (visualContent.observations?.anatomy?.some(a => a.status === 'ANOMALY') ? 75 : 25) : 35) : 50,
          status: visualContent.sceneTitle || 'Evaluated',
          color: visualContent.sceneType === 'screenshot_graphic' ? 'amber' : 'emerald'
        },
        {
          name: '2D Fourier Frequency Spectrum',
          score: Math.round(fourierAnalysis.spectralAiScore * 100),
          status: fourierAnalysis.spectralAiScore >= 0.65 ? 'Periodic Artifacts' : fourierAnalysis.spectralAiScore <= 0.35 ? 'Natural 1/f Decay' : 'Indeterminate',
          color: fourierAnalysis.spectralAiScore >= 0.65 ? 'red' : fourierAnalysis.spectralAiScore <= 0.35 ? 'emerald' : 'amber'
        },
        {
          name: 'CMOS Sensor Noise Floor',
          score: Math.round(noiseAnalysis.noiseAiScore * 100),
          status: noiseAnalysis.noiseAiScore >= 0.65 ? 'Noise Deficit' : noiseAnalysis.noiseAiScore <= 0.35 ? 'Organic Shot Noise' : 'Borderline',
          color: noiseAnalysis.noiseAiScore >= 0.65 ? 'red' : noiseAnalysis.noiseAiScore <= 0.35 ? 'emerald' : 'amber'
        },
        {
          name: 'Optical Dispersion & Provenance',
          score: metaProvenance.hasCameraExif ? 15 : metaProvenance.hasAiMetadata ? 98 : Math.round(gradientAnalysis.gradientAiScore * 100),
          status: metaProvenance.hasAiMetadata ? 'AI Prompt Chunk' : metaProvenance.hasCameraExif ? 'Verified Camera EXIF' : 'Sanitized Container',
          color: metaProvenance.hasAiMetadata ? 'red' : metaProvenance.hasCameraExif ? 'emerald' : 'amber'
        }
      ],
      signalsSummary: fusedAssessment.signalsSummary,
      telemetry: {
        fourier: {
          avgDecaySlope: fourierAnalysis.avgDecaySlope ?? null,
          avgPeriodicSpikes: fourierAnalysis.avgPeriodicSpikes ?? null,
          avgHighRatio: fourierAnalysis.avgHighRatio ?? null,
          spectralAiScore: fourierAnalysis.spectralAiScore ?? 0.5
        },
        noise: {
          avgNoiseVariance: noiseAnalysis.avgNoiseVariance ?? null,
          zeroNoiseRatio: noiseAnalysis.zeroNoiseRatio ?? null,
          varianceSpread: noiseAnalysis.varianceSpread ?? null,
          jpegBlockiness: noiseAnalysis.jpegBlockiness ?? null,
          isHeavyJpeg: Boolean(noiseAnalysis.isHeavyJpeg),
          noiseAiScore: noiseAnalysis.noiseAiScore ?? 0.5
        },
        gradients: {
          avgDispersion: gradientAnalysis.avgDispersion ?? null,
          totalEdgeCount: gradientAnalysis.totalEdgeCount ?? 0,
          gradientAiScore: gradientAnalysis.gradientAiScore ?? 0.5
        },
        metadata: {
          hasCameraExif: Boolean(metaProvenance.hasCameraExif),
          hasAiMetadata: Boolean(metaProvenance.hasAiMetadata),
          cameraDetails: metaProvenance.cameraDetails || null,
          aiToolSignature: metaProvenance.aiToolSignature || null
        }
      },
      metadata: {
        fileName,
        fileSize: formatBytes(fileSize),
        rawSizeBytes: fileSize,
        dimensions: `${width} × ${height} px`,
        width,
        height,
        mimeType,
        sha256Hash
      },
      reliabilityNotice: 'No automated AI detector is 100% reliable. Generative models and compression artifacts can produce false positives or false negatives. Use this assessment as an investigative indicator alongside contextual provenance.'
    };

    // Cache the result (FIFO limit)
    if (analysisCache.size >= MAX_CACHE_SIZE) {
      const oldestKey = analysisCache.keys().next().value;
      analysisCache.delete(oldestKey);
    }
    analysisCache.set(sha256Hash, responseData);

    return res.json(responseData);

  } catch (err) {
    console.error('Forensic analysis server error:', err);
    return res.status(500).json({
      error: 'Forensic image processing failed.',
      message: err.message
    });
  }
});

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Multer and file upload error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        error: `File size exceeds the ${MAX_FILE_SIZE_MB}MB limit.`,
        code: 'LIMIT_FILE_SIZE'
      });
    }
    return res.status(400).json({
      error: `File upload error: ${err.message}`,
      code: err.code
    });
  }
  if (err && err.message && err.message.includes('Unsupported file type')) {
    return res.status(415).json({
      error: err.message
    });
  }
  if (err && err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      error: err.message
    });
  }
  next(err);
});

// 404 handler for unrecognized routes
app.use((req, res) => {
  res.status(404).json({
    error: `Route ${req.method} ${req.path} not found on VERILENS backend.`
  });
});

// Global internal server error handler
app.use((err, req, res, next) => {
  console.error('[VERILENS Unhandled Server Error]:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error occurred.',
    timestamp: new Date().toISOString()
  });
});

// Primary HTTP listener (0.0.0.0 is mandatory for Render and container environments)
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[VERILENS Engine] Forensic Detection Backend active on port ${PORT} (0.0.0.0)`);
});

// If PORT is 3001 (e.g. from local .env), also listen on 10000 so Render's internal router can route requests
if (PORT !== 10000) {
  try {
    const renderProxyServer = app.listen(10000, '0.0.0.0', () => {
      console.log(`[VERILENS Engine] Secondary Render listener active on port 10000 (0.0.0.0)`);
    });
    renderProxyServer.on('error', (err) => {
      if (err.code !== 'EADDRINUSE') console.warn('Port 10000 notice:', err.message);
    });
  } catch (e) {}
}

// Graceful shutdown handling for Render service lifecycles
process.on('SIGTERM', () => {
  console.info('[VERILENS Engine] SIGTERM signal received: closing HTTP server gracefully...');
  server.close(() => {
    console.info('[VERILENS Engine] HTTP server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.info('[VERILENS Engine] SIGINT signal received: closing HTTP server...');
  server.close(() => {
    process.exit(0);
  });
});
