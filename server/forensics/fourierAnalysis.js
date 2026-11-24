/**
 * 2D Spatial Frequency / Fourier Spectral Analysis
 * Detects periodic lattice artifacts, grid anomalies, and unnatural power spectrum decay
 * characteristic of generative diffusion and GAN upsampling layers.
 */

// Cooley-Tukey 1D Radix-2 FFT (in-place)
function fft1D(real, imag) {
  const n = real.length;
  // Bit-reversal permutation
  let j = 0;
  for (let i = 0; i < n - 1; i++) {
    if (i < j) {
      const tempR = real[i]; real[i] = real[j]; real[j] = tempR;
      const tempI = imag[i]; imag[i] = imag[j]; imag[j] = tempI;
    }
    let k = n >> 1;
    while (k <= j) {
      j -= k;
      k >>= 1;
    }
    j += k;
  }

  // Butterfly computation
  for (let len = 2; len <= n; len <<= 1) {
    const half = len >> 1;
    const angle = (-2 * Math.PI) / len;
    const wStepR = Math.cos(angle);
    const wStepI = Math.sin(angle);

    for (let i = 0; i < n; i += len) {
      let wR = 1;
      let wI = 0;
      for (let k = 0; k < half; k++) {
        const uR = real[i + k];
        const uI = imag[i + k];
        const vR = real[i + k + half] * wR - imag[i + k + half] * wI;
        const vI = real[i + k + half] * wI + imag[i + k + half] * wR;

        real[i + k] = uR + vR;
        imag[i + k] = uI + vI;
        real[i + k + half] = uR - vR;
        imag[i + k + half] = uI - vI;

        const nextWR = wR * wStepR - wI * wStepI;
        const nextWI = wR * wStepI + wI * wStepR;
        wR = nextWR;
        wI = nextWI;
      }
    }
  }
}

// 2D FFT on an N x N patch (where N is power of 2, e.g. 64 or 128)
function fft2D(matrix, n) {
  const real = new Float32Array(n * n);
  const imag = new Float32Array(n * n);

  // Copy input matrix
  for (let i = 0; i < n * n; i++) {
    real[i] = matrix[i];
  }

  // Row-wise 1D FFT
  const rowR = new Float32Array(n);
  const rowI = new Float32Array(n);
  for (let y = 0; y < n; y++) {
    const offset = y * n;
    for (let x = 0; x < n; x++) {
      rowR[x] = real[offset + x];
      rowI[x] = imag[offset + x];
    }
    fft1D(rowR, rowI);
    for (let x = 0; x < n; x++) {
      real[offset + x] = rowR[x];
      imag[offset + x] = rowI[x];
    }
  }

  // Column-wise 1D FFT
  const colR = new Float32Array(n);
  const colI = new Float32Array(n);
  for (let x = 0; x < n; x++) {
    for (let y = 0; y < n; y++) {
      colR[y] = real[y * n + x];
      colI[y] = imag[y * n + x];
    }
    fft1D(colR, colI);
    for (let y = 0; y < n; y++) {
      real[y * n + x] = colR[y];
      imag[y * n + x] = colI[y];
    }
  }

  // Calculate centered power spectrum (raw magnitude)
  const power = new Float32Array(n * n);
  const half = n >> 1;
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const mag = Math.sqrt(real[y * n + x] ** 2 + imag[y * n + x] ** 2);
      // FFT shift (center DC component)
      const shiftY = (y + half) % n;
      const shiftX = (x + half) % n;
      power[shiftY * n + shiftX] = mag;
    }
  }

  return power;
}

/**
 * Analyzes the frequency domain of an image using multiple 64x64 patches.
 * Evaluates:
 * 1. Radial power spectrum decay slope (natural optical 1/f^alpha vs synthetic deviation).
 * 2. High-frequency periodic peak spikes (convolution/upsampling lattice artifacts).
 * 3. High-frequency energy ratio.
 */
export function analyzeFrequencySpectrum(grayPixels, width, height) {
  const patchSize = 64;
  if (width < patchSize || height < patchSize) {
    return {
      isValid: false,
      reason: 'Image dimensions too small for statistical Fourier spectral analysis',
      spectralAnomalyScore: 0.5
    };
  }

  // Sample up to 9 distributed patches across image
  const patchesX = Math.min(3, Math.floor(width / patchSize));
  const patchesY = Math.min(3, Math.floor(height / patchSize));
  const stepX = Math.floor((width - patchSize) / Math.max(1, patchesX - 1));
  const stepY = Math.floor((height - patchSize) / Math.max(1, patchesY - 1));

  let totalHighFreqRatio = 0;
  let totalPeriodicSpikes = 0;
  let totalDecaySlope = 0;
  let patchCount = 0;

  const patchBuf = new Float32Array(patchSize * patchSize);
  const half = patchSize / 2;
  const maxRadius = Math.floor(half * 0.95);

  for (let py = 0; py < patchesY; py++) {
    for (let px = 0; px < patchesX; px++) {
      const startX = px * stepX;
      const startY = py * stepY;

      // Extract patch with Hanning window to avoid edge discontinuity leakage
      for (let y = 0; y < patchSize; y++) {
        const wy = 0.5 * (1 - Math.cos((2 * Math.PI * y) / (patchSize - 1)));
        for (let x = 0; x < patchSize; x++) {
          const wx = 0.5 * (1 - Math.cos((2 * Math.PI * x) / (patchSize - 1)));
          const pixelVal = grayPixels[(startY + y) * width + (startX + x)];
          patchBuf[y * patchSize + x] = pixelVal * wx * wy;
        }
      }

      // Compute centered 2D power spectrum
      const power = fft2D(patchBuf, patchSize);

      // Analyze radial distribution
      const radialBins = new Float32Array(maxRadius);
      const binCounts = new Uint16Array(maxRadius);

      let lowFreqEnergy = 0;
      let highFreqEnergy = 0;
      let maxSpike = 0;
      let avgPower = 0;

      for (let y = 0; y < patchSize; y++) {
        const dy = y - half;
        for (let x = 0; x < patchSize; x++) {
          const dx = x - half;
          const r = Math.round(Math.sqrt(dx * dx + dy * dy));
          const val = power[y * patchSize + x];
          avgPower += val;

          if (r < maxRadius) {
            radialBins[r] += val;
            binCounts[r]++;
          }

          if (r <= half * 0.35) {
            lowFreqEnergy += val;
          } else if (r >= half * 0.65) {
            highFreqEnergy += val;
          }
        }
      }

      avgPower /= (patchSize * patchSize);

      // Search for anomalous isolated periodic frequency peaks in high/mid bands (r >= 6)
      // Exclude main horizontal and vertical axes (dy === 0 or dx === 0) because natural geometric edges lie along them
      for (let r = 6; r < maxRadius; r++) {
        if (binCounts[r] > 0) {
          const meanAtR = radialBins[r] / binCounts[r];
          for (let y = 0; y < patchSize; y++) {
            const dy = y - half;
            if (Math.abs(dy) < 2) continue; // Skip horizontal axis
            for (let x = 0; x < patchSize; x++) {
              const dx = x - half;
              if (Math.abs(dx) < 2) continue; // Skip vertical axis
              if (Math.round(Math.sqrt(dx * dx + dy * dy)) === r) {
                const val = power[y * patchSize + x];
                if (meanAtR > 0 && val > meanAtR * 5.0) {
                  // Check point symmetry in opposite quadrant (characteristic of 2D lattice harmonics)
                  const symY = half - dy;
                  const symX = half - dx;
                  if (symY >= 0 && symY < patchSize && symX >= 0 && symX < patchSize) {
                    const symVal = power[symY * patchSize + symX];
                    if (symVal > meanAtR * 4.0) {
                      const spikeRatio = Math.log(1 + val) - Math.log(1 + meanAtR);
                      if (spikeRatio > maxSpike) maxSpike = spikeRatio;
                    }
                  }
                }
              }
            }
          }
        }
      }

      // Radial decay slope estimation: log(Power) vs log(frequency)
      // For natural optical photography, P(f) ~ 1/f^alpha gives slope near -1.4 to -2.4
      let sumLogR = 0, sumLogP = 0, sumLogR2 = 0, sumLogRLogP = 0, count = 0;
      for (let r = 3; r < maxRadius; r++) {
        if (binCounts[r] > 0) {
          const meanP = radialBins[r] / binCounts[r];
          if (meanP > 0) {
            const logR = Math.log(r);
            const logP = Math.log(meanP);
            sumLogR += logR;
            sumLogP += logP;
            sumLogR2 += logR * logR;
            sumLogRLogP += logR * logP;
            count++;
          }
        }
      }
      const slope = count > 2 ? (count * sumLogRLogP - sumLogR * sumLogP) / (count * sumLogR2 - sumLogR * sumLogR) : -2;

      const highToLowRatio = lowFreqEnergy > 0 ? highFreqEnergy / lowFreqEnergy : 0.5;

      totalHighFreqRatio += highToLowRatio;
      totalPeriodicSpikes += maxSpike;
      totalDecaySlope += slope;
      patchCount++;
    }
  }

  const avgHighRatio = patchCount > 0 ? totalHighFreqRatio / patchCount : 0.5;
  const avgPeriodicSpikes = patchCount > 0 ? totalPeriodicSpikes / patchCount : 0;
  const avgSlope = patchCount > 0 ? totalDecaySlope / patchCount : -2.0;

  // Evaluate synthetic probability from spectral domain
  // Calibrated against natural camera decay: -1.3 to -2.5 is typical of natural optical images
  let spectralAiScore = 0.5;
  let indicators = [];

  if (avgPeriodicSpikes > 2.8) {
    spectralAiScore = Math.min(0.92, 0.5 + avgPeriodicSpikes * 0.12);
    indicators.push({
      type: 'ANOMALY',
      name: 'Periodic Fourier Spectral Peaks',
      detail: `Detected anomalous periodic high-frequency energy spikes (${avgPeriodicSpikes.toFixed(2)} dB delta), characteristic of generative neural upsampling grids.`
    });
  } else if (avgPeriodicSpikes < 0.8 && avgSlope <= -1.4 && avgSlope >= -2.4) {
    spectralAiScore = 0.20;
    indicators.push({
      type: 'AUTHENTIC',
      name: 'Smooth Radial Fourier Decay',
      detail: `Frequency power spectrum displays uniform continuous radial decay (slope: ${avgSlope.toFixed(2)}) without periodic lattice harmonics, consistent with natural scene optics.`
    });
  } else if (avgSlope > -0.9) {
    // Unnatural high frequency energy plateau
    spectralAiScore += 0.15;
    indicators.push({
      type: 'ANOMALY',
      name: 'Spectral Energy Plateau',
      detail: `High-frequency decay slope is unnaturally flat (${avgSlope.toFixed(2)} vs optical expectation -1.8).`
    });
  } else if (avgSlope < -3.2) {
    // Over-smoothed / low-pass diffusion blur
    spectralAiScore += 0.12;
    indicators.push({
      type: 'ANOMALY',
      name: 'High-Frequency Spectral Deficit',
      detail: `High-frequency energy falls off prematurely (${avgSlope.toFixed(2)} slope), typical of diffusion denoising steps.`
    });
  } else {
    // In normal optical range
    spectralAiScore = 0.35;
    indicators.push({
      type: 'AUTHENTIC',
      name: 'Natural Frequency Distribution',
      detail: `Radial spectral energy decay slope (${avgSlope.toFixed(2)}) conforms with empirical photographic power laws.`
    });
  }

  return {
    isValid: true,
    spectralAiScore: Math.max(0.05, Math.min(0.95, spectralAiScore)),
    avgPeriodicSpikes: Math.round(avgPeriodicSpikes * 100) / 100,
    avgDecaySlope: Math.round(avgSlope * 100) / 100,
    avgHighRatio: Math.round(avgHighRatio * 100) / 100,
    indicators
  };
}
