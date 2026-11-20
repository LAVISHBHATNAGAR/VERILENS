/**
 * Multi-Signal Ensemble Fusion & Uncertainty Engine
 * Combines Deep Learning, 2D Fourier Spectrum, Noise Residual Floor,
 * Optical Dispersion, and Metadata into a calibrated forensic assessment.
 */

export function fuseForensicSignals({
  deepLearning,
  fourier,
  noise,
  gradients,
  metadata,
  imageMeta
}) {
  const anomalies = [];
  const authenticSignals = [];
  const limitations = [];

  // 1. Check Definitive Metadata Override
  if (metadata.hasAiMetadata) {
    return {
      verdict: 'Likely AI-generated',
      verdictLevel: 'ai',
      aiScore: 98,
      realScore: 2,
      confidence: 96,
      confidenceLevel: 'High',
      summary: `Image container contains explicit generative AI metadata (${metadata.aiToolSignature}). Raw model prompt and workflow parameters were identified within file chunks.`,
      anomalies: metadata.indicators,
      authenticSignals: [],
      limitations: ['Metadata can be removed or forged; however, presence of valid generative parameters is deterministic.'],
      signalsSummary: {
        deepLearning: deepLearning.isAvailable ? `${(deepLearning.aiProbability * 100).toFixed(0)}%` : 'Not configured',
        fourier: `${(fourier.spectralAiScore * 100).toFixed(0)}%`,
        noise: `${(noise.noiseAiScore * 100).toFixed(0)}%`,
        metadata: 'Definitive AI Tool Header'
      },
      isUncertain: false
    };
  }

  // 2. Aggregate active signals
  let totalWeight = 0;
  let weightedScoreSum = 0;
  const activeScores = [];

  // Deep Learning Vision Signal
  if (deepLearning.isAvailable && typeof deepLearning.aiProbability === 'number') {
    const weight = 0.40;
    totalWeight += weight;
    weightedScoreSum += deepLearning.aiProbability * weight;
    activeScores.push({ name: 'Deep Learning ViT', score: deepLearning.aiProbability });

    if (deepLearning.aiProbability >= 0.65) {
      anomalies.push(...deepLearning.indicators);
    } else if (deepLearning.aiProbability <= 0.35) {
      authenticSignals.push(...deepLearning.indicators);
    }
  } else {
    limitations.push('Deep learning neural network model is not currently configured or connected; relying on mathematical signal processing.');
  }

  // Fourier 2D Spatial Frequency Signal
  if (fourier.isValid) {
    const weight = deepLearning.isAvailable ? 0.25 : 0.40;
    totalWeight += weight;
    weightedScoreSum += fourier.spectralAiScore * weight;
    activeScores.push({ name: '2D Fourier Spectrum', score: fourier.spectralAiScore });

    fourier.indicators.forEach(ind => {
      if (ind.type === 'ANOMALY') anomalies.push(ind);
      else if (ind.type === 'AUTHENTIC') authenticSignals.push(ind);
    });
  } else {
    limitations.push(fourier.reason || 'Spatial frequency analysis could not be fully calibrated.');
  }

  // PRNU Sensor Noise Floor Signal
  if (noise.isValid) {
    const weight = deepLearning.isAvailable ? 0.20 : 0.40;
    totalWeight += weight;
    weightedScoreSum += noise.noiseAiScore * weight;
    activeScores.push({ name: 'Noise Floor Variance', score: noise.noiseAiScore });

    noise.indicators.forEach(ind => {
      if (ind.type === 'ANOMALY') anomalies.push(ind);
      else if (ind.type === 'AUTHENTIC') authenticSignals.push(ind);
      else if (ind.type === 'NEUTRAL') limitations.push(ind.detail);
    });
  } else {
    limitations.push(noise.reason || 'Image lacked sufficient smooth regions to calibrate CMOS sensor noise.');
  }

  // Optical Edge Dispersion Signal
  if (gradients.isValid) {
    const weight = deepLearning.isAvailable ? 0.15 : 0.20;
    totalWeight += weight;
    weightedScoreSum += gradients.gradientAiScore * weight;
    activeScores.push({ name: 'Optical Edge Dispersion', score: gradients.gradientAiScore });

    gradients.indicators.forEach(ind => {
      if (ind.type === 'ANOMALY') anomalies.push(ind);
      else if (ind.type === 'AUTHENTIC') authenticSignals.push(ind);
    });
  }

  // Verified Camera Hardware EXIF adjustment
  if (metadata.hasCameraExif) {
    weightedScoreSum *= 0.65;
    metadata.indicators.forEach(ind => authenticSignals.push(ind));
  } else {
    metadata.indicators.forEach(ind => {
      if (ind.type === 'NEUTRAL') limitations.push(ind.detail);
    });
  }

  // When organic CMOS shot noise is strongly present (noise score <= 0.20) and no periodic anomalies exist
  if (noise.isValid && noise.noiseAiScore <= 0.20 && (!fourier.isValid || fourier.spectralAiScore <= 0.55)) {
    weightedScoreSum = Math.min(weightedScoreSum, totalWeight * 0.25);
  }

  // Raw fused probability
  let rawProb = totalWeight > 0 ? weightedScoreSum / totalWeight : 0.5;

  // Signal Disparity / Conflict Index
  let signalDisparity = 0;
  if (activeScores.length >= 2) {
    const scores = activeScores.map(s => s.score);
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    signalDisparity = maxScore - minScore;
  }

  // Resolution & Compression penalty to confidence
  const isLowResolution = imageMeta.width < 300 || imageMeta.height < 300;
  if (isLowResolution) {
    limitations.push('Low image resolution degrades fine-grained sensor grain and optical edge detection reliability.');
  }

  const isHeavyJpeg = Boolean(noise.isHeavyJpeg);
  if (isHeavyJpeg) {
    limitations.push('High JPEG quantization suppresses fine sensor noise, introducing uncertainty into surface smoothness analysis.');
  }

  // 3. UNCERTAINTY SYSTEM EVALUATION
  // Do not force ambiguous, low-res, heavily compressed, or contradictory images into binary buckets!
  const isAmbiguousRange = rawProb > 0.35 && rawProb < 0.65;
  const isHighDisparity = signalDisparity > 0.45;

  let verdict = 'Inconclusive';
  let verdictLevel = 'inconclusive';
  let calibratedConfidence = 0;
  let confidenceLevel = 'Low';
  let summary = '';

  if (isHeavyJpeg && rawProb >= 0.60) {
    // Heavy JPEG compression artificially suppresses noise floor; prevent false positive
    verdict = 'Inconclusive';
    verdictLevel = 'inconclusive';
    calibratedConfidence = 35;
    confidenceLevel = 'Low / Uncertain';
    summary = `Image exhibits prominent 8x8 discrete cosine transform compression artifacts (JPEG blockiness index: ${noise.jpegBlockiness || 'high'}). Compression quantization obscures high-frequency CMOS sensor noise, preventing a definitive determination.`;
  } else if (isAmbiguousRange || isHighDisparity || isLowResolution) {
    verdict = 'Inconclusive';
    verdictLevel = 'inconclusive';
    calibratedConfidence = Math.round(Math.max(20, (1 - signalDisparity) * 50));
    confidenceLevel = 'Low / Uncertain';

    if (isHighDisparity) {
      summary = `The analysis produced conflicting signals across forensic domains (Signal discrepancy: ${(signalDisparity * 100).toFixed(0)}%). For example, spatial frequency patterns diverge from noise floor characteristics. Evidence is insufficient for a reliable determination.`;
    } else if (isAmbiguousRange) {
      summary = `The image metrics fall into an indeterminate middle band (${(rawProb * 100).toFixed(0)}%). Visual patterns do not provide conclusive proof of either authentic photographic capture or synthetic generative diffusion.`;
    } else {
      summary = `Image resolution (${imageMeta.width}×${imageMeta.height}) is too limited to extract unambiguous micro-texture or CMOS sensor noise signatures.`;
    }
  } else if (rawProb >= 0.65) {
    verdict = 'Likely AI-generated';
    verdictLevel = 'ai';
    calibratedConfidence = Math.round(Math.min(95, 60 + (rawProb - 0.65) * 100 * (1 - signalDisparity * 0.5)));
    confidenceLevel = calibratedConfidence >= 80 ? 'High' : 'Moderate';
    summary = `Multiple independent forensic indicators corroborate synthetic image synthesis. Observed markers include ${anomalies.map(a => a.name).slice(0, 2).join(' and ')}.`;
  } else {
    verdict = 'Likely authentic';
    verdictLevel = 'real';
    calibratedConfidence = Math.round(Math.min(95, 60 + (0.35 - rawProb) * 100 * (1 - signalDisparity * 0.5)));
    confidenceLevel = calibratedConfidence >= 80 ? 'High' : 'Moderate';
    summary = `Visual signals and noise floor characteristics are consistent with genuine optical camera capture. Preserved indicators include ${authenticSignals.map(a => a.name).slice(0, 2).join(' and ')}.`;
  }

  const aiScore = Math.round(rawProb * 100);
  const realScore = 100 - aiScore;

  limitations.push('AI image synthesis models evolve rapidly. No automated detector is 100% accurate; results should be evaluated in context with provenance metadata.');

  return {
    verdict,
    verdictLevel,
    aiScore,
    realScore,
    confidence: calibratedConfidence,
    confidenceLevel,
    summary,
    anomalies: anomalies.length > 0 ? anomalies : [
      {
        type: 'NEUTRAL',
        name: 'No Structural Anomalies Isolated',
        detail: 'Image does not exhibit blatant synthetic artifacts or periodic frequency peaks.'
      }
    ],
    authenticSignals,
    limitations,
    signalsSummary: {
      deepLearning: deepLearning.isAvailable ? `${(deepLearning.aiProbability * 100).toFixed(0)}% (${deepLearning.modelName})` : 'Not configured in .env',
      fourier: `${(fourier.spectralAiScore * 100).toFixed(0)}% (Decay: ${fourier.avgDecaySlope || 'N/A'})`,
      noise: `${(noise.noiseAiScore * 100).toFixed(0)}% (Zero-Noise: ${noise.zeroNoiseRatio || 0}%)`,
      metadata: metadata.hasCameraExif ? `Verified (${metadata.cameraDetails})` : 'Sanitized'
    },
    signalDisparity: Math.round(signalDisparity * 100),
    isUncertain: verdictLevel === 'inconclusive'
  };
}
