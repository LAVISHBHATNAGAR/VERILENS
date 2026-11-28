/**
 * PRNU / Sensor Noise Floor, Variance Clustering & JPEG Blockiness Analysis
 * Evaluates the statistical distribution of high-frequency noise residuals
 * to detect synthetic diffusion smoothing vs organic camera silicon shot noise,
 * while preventing false positives caused by heavy JPEG compression.
 */

export function analyzeNoiseResidual(grayPixels, width, height, mimeType = '') {
  if (width < 32 || height < 32) {
    return {
      isValid: false,
      reason: 'Dimensions too small for noise residual extraction',
      noiseAiScore: 0.5
    };
  }

  // Lossless containers (PNG/GIF) do not carry live JPEG 8x8 DCT quantization unless transcoded
  const lowerMime = (mimeType || '').toLowerCase();
  const isLosslessContainer = lowerMime.includes('png') || lowerMime.includes('gif');

  // 1. Detect 8x8 JPEG DCT Block Discontinuity via coprime stride (gcd(3,8)=1 covers all 8 phases)
  const xGradSum = new Float64Array(8);
  const xGradCnt = new Uint32Array(8);
  const yGradSum = new Float64Array(8);
  const yGradCnt = new Uint32Array(8);

  for (let y = 4; y < height - 4; y += 3) {
    const row = y * width;
    const ym = y % 8;
    for (let x = 4; x < width - 4; x += 3) {
      xGradSum[x % 8] += Math.abs(grayPixels[row + x + 1] - grayPixels[row + x]);
      xGradCnt[x % 8]++;
      yGradSum[ym] += Math.abs(grayPixels[row + width + x] - grayPixels[row + x]);
      yGradCnt[ym]++;
    }
  }

  const axisBlockRatio = (sumArr, cntArr) => {
    const means = [];
    for (let i = 0; i < 8; i++) {
      means.push(cntArr[i] > 0 ? sumArr[i] / cntArr[i] : 0);
    }
    means.sort((a, b) => a - b);
    const median = (means[3] + means[4]) / 2;
    const peak = means[7];
    return median >= 0.35 && peak >= 0.85 ? peak / median : 1.0;
  };

  const jpegBlockiness = Math.max(
    axisBlockRatio(xGradSum, xGradCnt),
    axisBlockRatio(yGradSum, yGradCnt)
  );
  const isHeavyJpeg = !isLosslessContainer && jpegBlockiness >= 1.24;

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
      let lumSum = 0;
      let count = 0;
      let gradSum = 0;

      for (let y = 1; y < blockSize - 1; y++) {
        const row = (startY + y) * width;
        for (let x = 1; x < blockSize - 1; x++) {
          const val = residual[row + startX + x];
          sum += val;
          sumSq += val * val;

          const origRow = (startY + y) * width + (startX + x);
          lumSum += grayPixels[origRow];
          const gx = Math.abs(grayPixels[origRow + 1] - grayPixels[origRow - 1]);
          const gy = Math.abs(grayPixels[origRow + width] - grayPixels[origRow - width]);
          gradSum += (gx + gy);

          count++;
        }
      }

      const mean = sum / count;
      const variance = (sumSq / count) - (mean * mean);
      const avgGrad = gradSum / count;
      const meanLum = lumSum / count;

      // Exclude clipped pure-black space margins or saturated white regions unless textured
      const isClippedVoid = (meanLum < 7 || meanLum > 249) && variance < 0.12 && avgGrad < 2;

      if (avgGrad < 35 && !isClippedVoid) {
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

  // Continuous PRNU scoring from measured zero-noise ratio and residual variance
  if (lowNoiseRatio > 0.72 && avgNoiseVariance < 1.35 && !isHeavyJpeg && totalEvaluatedBlocks > 8) {
    const varDeficit = Math.max(0, (1.35 - avgNoiseVariance) / 1.35);
    noiseAiScore = 0.68 + (lowNoiseRatio - 0.72) * 0.45 + varDeficit * 0.14;
    indicators.push({
      type: 'ANOMALY',
      name: 'High-Frequency Sensor Noise Deficit',
      detail: `${(lowNoiseRatio * 100).toFixed(1)}% of smooth patches exhibit near-zero sensor noise (avg variance ${avgNoiseVariance.toFixed(2)} vs camera floor >1.5), typical of diffusion surfaces.`
    });
  } else if (lowNoiseRatio <= 0.45 && avgNoiseVariance >= 1.2 && avgNoiseVariance <= 36.0) {
    const grainStrength = Math.min(1, (avgNoiseVariance - 1.2) / 16);
    noiseAiScore = 0.11 + lowNoiseRatio * 0.34 - grainStrength * 0.04;
    indicators.push({
      type: 'AUTHENTIC',
      name: 'Consistent Camera Sensor Noise Floor',
      detail: `Smooth patches carry Poisson-Gaussian shot noise variance (${avgNoiseVariance.toFixed(2)}), matching physical CMOS sensors.`
    });
  } else if (lowNoiseRatio <= 0.68 && avgNoiseVariance >= 0.9 && !isHeavyJpeg) {
    noiseAiScore = 0.22 + lowNoiseRatio * 0.25;
    indicators.push({
      type: 'AUTHENTIC',
      name: 'Organic Silicon Sensor Grain Detected',
      detail: `Micro-noise variance (${avgNoiseVariance.toFixed(2)}) suggests authentic camera sensor exposure.`
    });
  } else {
    noiseAiScore = isHeavyJpeg ? 0.48 : Math.min(0.66, 0.36 + lowNoiseRatio * 0.26);
    indicators.push({
      type: 'NEUTRAL',
      name: 'Indeterminate Noise Residual',
      detail: `Noise distribution falls within post-processing, mobile ISP denoising, or compression range.`
    });
  }

  if (varianceSpread > 12.0 && noiseAiScore >= 0.56 && !isHeavyJpeg) {
    noiseAiScore = Math.min(0.92, noiseAiScore + 0.09);
    indicators.push({
      type: 'ANOMALY',
      name: 'Noise Variance Clustering',
      detail: `Disparate noise variance spread (IQR ${varianceSpread.toFixed(2)}), typical of latent diffusion patches.`
    });
  }

  noiseAiScore = Number(Math.max(0.06, Math.min(0.95, noiseAiScore)).toFixed(3));

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
