/**
 * PRNU / Sensor Noise Floor, Variance Clustering & JPEG Blockiness Analysis
 * Evaluates the statistical distribution of high-frequency noise residuals
 * to detect synthetic diffusion smoothing vs organic camera silicon shot noise,
 * while preventing false positives caused by heavy JPEG compression.
 */

export function analyzeNoiseResidual(grayPixels, width, height) {
  if (width < 32 || height < 32) {
    return {
      isValid: false,
      reason: 'Dimensions too small for noise residual extraction',
      noiseAiScore: 0.5
    };
  }

  // 1. Detect 8x8 JPEG Block Discontinuity (phase-independent to support scaled/cropped images)
  let maxBlockiness = 1.0;
  for (let phase = 0; phase < 8; phase += 2) {
    let boundaryGradSum = 0;
    let boundaryCount = 0;
    let internalGradSum = 0;
    let internalCount = 0;

    for (let y = 8; y < height - 8; y += 4) {
      const row = y * width;
      const isYBoundary = ((y + phase) % 8 === 0);

      for (let x = 8; x < width - 8; x += 4) {
        const gx = Math.abs(grayPixels[row + x + 1] - grayPixels[row + x]);
        const gy = Math.abs(grayPixels[row + width + x] - grayPixels[row + x]);
        const isXBoundary = ((x + phase) % 8 === 0);

        if (isXBoundary || isYBoundary) {
          boundaryGradSum += (gx + gy);
          boundaryCount++;
        } else {
          internalGradSum += (gx + gy);
          internalCount++;
        }
      }
    }

    const avgBoundary = boundaryCount > 0 ? boundaryGradSum / boundaryCount : 1;
    const avgInternal = internalCount > 0 ? internalGradSum / internalCount : 1;
    const ratio = avgInternal > 0 ? avgBoundary / avgInternal : 1.0;
    if (ratio > maxBlockiness) maxBlockiness = ratio;
  }

  const jpegBlockiness = maxBlockiness;
  const isHeavyJpeg = jpegBlockiness > 1.28;

  // 2. Compute 3x3 high-pass Laplacian noise residual
  const residual = new Float32Array(width * height);
  for (let y = 1; y < height - 1; y++) {
    const row = y * width;
    for (let x = 1; x < width - 1; x++) {
      const center = grayPixels[row + x];
      const north = grayPixels[(y - 1) * width + x];
      const south = grayPixels[(y + 1) * width + x];
      const west = grayPixels[row + x - 1];
      const east = grayPixels[row + x + 1];

      residual[row + x] = center - 0.25 * (north + south + west + east);
    }
  }

  // Divide image into 16x16 local evaluation blocks
  const blockSize = 16;
  const blocksX = Math.floor(width / blockSize);
  const blocksY = Math.floor(height / blockSize);

  const blockVariances = [];
  let lowNoiseBlockCount = 0;
  let totalEvaluatedBlocks = 0;

  for (let by = 0; by < blocksY; by++) {
    for (let bx = 0; bx < blocksX; bx++) {
      const startX = bx * blockSize;
      const startY = by * blockSize;

      let sum = 0;
      let sumSq = 0;
      let count = 0;
      let gradSum = 0;

      for (let y = 1; y < blockSize - 1; y++) {
        const row = (startY + y) * width;
        for (let x = 1; x < blockSize - 1; x++) {
          const val = residual[row + startX + x];
          sum += val;
          sumSq += val * val;

          const origRow = (startY + y) * width + (startX + x);
          const gx = Math.abs(grayPixels[origRow + 1] - grayPixels[origRow - 1]);
          const gy = Math.abs(grayPixels[origRow + width] - grayPixels[origRow - width]);
          gradSum += (gx + gy);

          count++;
        }
      }

      const mean = sum / count;
      const variance = (sumSq / count) - (mean * mean);
      const avgGrad = gradSum / count;

      if (avgGrad < 35) {
        blockVariances.push(variance);
        totalEvaluatedBlocks++;

        if (variance < 1.8) {
          lowNoiseBlockCount++;
        }
      }
    }
  }

  let avgNoiseVariance = 0;
  let varianceSpread = 0;
  let lowNoiseRatio = 0;

  if (blockVariances.length > 5) {
    blockVariances.sort((a, b) => a - b);
    const sum = blockVariances.reduce((acc, v) => acc + v, 0);
    avgNoiseVariance = sum / blockVariances.length;

    const q1 = blockVariances[Math.floor(blockVariances.length * 0.25)];
    const q3 = blockVariances[Math.floor(blockVariances.length * 0.75)];
    varianceSpread = q3 - q1;

    lowNoiseRatio = lowNoiseBlockCount / totalEvaluatedBlocks;
  } else {
    return {
      isValid: true,
      noiseAiScore: 0.5,
      isAmbiguous: true,
      isHeavyJpeg,
      jpegBlockiness: Math.round(jpegBlockiness * 100) / 100,
      reason: 'Image lacks sufficient smooth regions to calibrate CMOS sensor noise floor.',
      indicators: []
    };
  }

  let noiseAiScore = 0.5;
  const indicators = [];

  if (isHeavyJpeg) {
    indicators.push({
      type: 'NEUTRAL',
      name: 'JPEG Quantization Structure Detected',
      detail: `Detected prominent 8x8 discrete cosine transform grid boundaries (Blockiness index: ${jpegBlockiness.toFixed(2)}). Compression naturally suppresses fine high-frequency sensor noise.`
    });
  }

  // Calibrated against real-world camera denoising and smartphone ISP processing
  // Only declare a high-frequency noise deficit if over 80% of smooth blocks exhibit near-zero noise AND overall variance is unnaturally suppressed
  if (lowNoiseRatio > 0.80 && avgNoiseVariance < 0.8 && !isHeavyJpeg && totalEvaluatedBlocks > 8) {
    noiseAiScore = 0.86;
    indicators.push({
      type: 'ANOMALY',
      name: 'High-Frequency Sensor Noise Deficit',
      detail: `${(lowNoiseRatio * 100).toFixed(1)}% of evaluated image patches exhibit near-zero sensor noise (avg variance ${avgNoiseVariance.toFixed(2)} vs expected camera floor >1.5), characteristic of generative diffusion surfaces.`
    });
  } else if (lowNoiseRatio <= 0.35 && avgNoiseVariance >= 1.5 && avgNoiseVariance <= 35.0) {
    noiseAiScore = 0.16;
    indicators.push({
      type: 'AUTHENTIC',
      name: 'Consistent Camera Sensor Noise Floor',
      detail: `Smooth patches exhibit uniform Poisson-Gaussian shot noise variance (${avgNoiseVariance.toFixed(2)}), consistent with physical digital camera sensors.`
    });
  } else if (lowNoiseRatio <= 0.60 && avgNoiseVariance >= 1.0) {
    noiseAiScore = 0.28;
    indicators.push({
      type: 'AUTHENTIC',
      name: 'Organic Silicon Sensor Grain Detected',
      detail: `Micro-noise variance (${avgNoiseVariance.toFixed(2)}) is consistent with physical camera sensor exposure.`
    });
  } else {
    // Standard photographic smoothing, camera ISP noise reduction, or ambiguous surface
    noiseAiScore = 0.48;
    indicators.push({
      type: 'NEUTRAL',
      name: 'Indeterminate Noise Residual',
      detail: `Noise distribution is within standard photographic post-processing, mobile ISP denoising, or compression range.`
    });
  }

  if (varianceSpread > 14.0 && noiseAiScore >= 0.60 && !isHeavyJpeg) {
    noiseAiScore = Math.min(0.88, noiseAiScore + 0.10);
    indicators.push({
      type: 'ANOMALY',
      name: 'Noise Variance Clustering',
      detail: `Disparate noise distribution across regions (IQR ${varianceSpread.toFixed(2)}), typical of latent diffusion sampling.`
    });
  }

  return {
    isValid: true,
    noiseAiScore: Math.max(0.05, Math.min(0.95, noiseAiScore)),
    avgNoiseVariance: Math.round(avgNoiseVariance * 100) / 100,
    zeroNoiseRatio: Math.round(lowNoiseRatio * 1000) / 10,
    varianceSpread: Math.round(varianceSpread * 100) / 100,
    isHeavyJpeg,
    jpegBlockiness: Math.round(jpegBlockiness * 100) / 100,
    indicators
  };
}
