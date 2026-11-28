/**
 * Sherloq-Inspired Web-Native Digital Image Forensics Engine
 * Clean-room JavaScript + Sharp implementation of core forensic analyzers:
 * 1. Multi-Quality JPEG Recompression ELA & Hany Farid JPEG Ghost Maps
 * 2. Median-Filter Residual & 2D Haar Wavelet Subband Decomposition (LH/HL/HH)
 * 3. Bit-Plane (Bit 0..2 LSB) Shannon Entropy Audit
 * 4. 3x3 RGB Color Covariance PCA Eigendecomposition (Jacobi Solver)
 * 5. Copy-Move Clone Block Self-Similarity Scan
 * 6. Container Marker & Embedded EXIF Thumbnail Mismatch Audit
 */

import sharp from 'sharp';
import exifParser from 'exif-parser';

/**
 * 3x3 symmetric Jacobi eigendecomposition sorted descending by eigenvalue.
 */
function jacobiEigen3x3(mat) {
  const a = [
    [mat[0][0], mat[0][1], mat[0][2]],
    [mat[1][0], mat[1][1], mat[1][2]],
    [mat[2][0], mat[2][1], mat[2][2]]
  ];
  const v = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ];

  for (let sweep = 0; sweep < 16; sweep++) {
    let p = 0;
    let q = 1;
    let maxOff = Math.abs(a[0][1]);
    if (Math.abs(a[0][2]) > maxOff) {
      p = 0;
      q = 2;
      maxOff = Math.abs(a[0][2]);
    }
    if (Math.abs(a[1][2]) > maxOff) {
      p = 1;
      q = 2;
      maxOff = Math.abs(a[1][2]);
    }
    if (maxOff < 1e-9) break;

    const app = a[p][p];
    const aqq = a[q][q];
    const apq = a[p][q];
    const tau = (aqq - app) / (2 * apq);
    const t = tau >= 0 ? 1 / (tau + Math.sqrt(1 + tau * tau)) : -1 / (-tau + Math.sqrt(1 + tau * tau));
    const c = 1 / Math.sqrt(1 + t * t);
    const s = t * c;

    a[p][p] = app - t * apq;
    a[q][q] = aqq + t * apq;
    a[p][q] = 0;
    a[q][p] = 0;

    for (let r = 0; r < 3; r++) {
      if (r !== p && r !== q) {
        const arp = a[r][p];
        const arq = a[r][q];
        a[r][p] = c * arp - s * arq;
        a[p][r] = a[r][p];
        a[r][q] = s * arp + c * arq;
        a[q][r] = a[r][q];
      }
      const vrp = v[r][p];
      const vrq = v[r][q];
      v[r][p] = c * vrp - s * vrq;
      v[r][q] = s * vrp + c * vrq;
    }
  }

  const pairs = [
    { val: Math.max(0, a[0][0]), vec: [v[0][0], v[1][0], v[2][0]] },
    { val: Math.max(0, a[1][1]), vec: [v[0][1], v[1][1], v[2][1]] },
    { val: Math.max(0, a[2][2]), vec: [v[0][2], v[1][2], v[2][2]] }
  ].sort((x, y) => y.val - x.val);

  return pairs;
}

/**
 * 3x3 exact median residual + zero-residual smooth block ratio.
 */
function analyzeMedianResidual(gray, width, height) {
  if (width < 24 || height < 24) {
    return { mae: 0, rmse: 0, zeroResidualRatio: 0.5 };
  }

  const win = new Uint8Array(9);
  const stepY = height > 360 ? 2 : 1;
  const stepX = width > 360 ? 2 : 1;

  let absSum = 0;
  let sqSum = 0;
  let count = 0;
  let nearZeroCount = 0;

  for (let y = 1; y < height - 1; y += stepY) {
    const r0 = (y - 1) * width;
    const r1 = y * width;
    const r2 = (y + 1) * width;
    for (let x = 1; x < width - 1; x += stepX) {
      win[0] = gray[r0 + x - 1];
      win[1] = gray[r0 + x];
      win[2] = gray[r0 + x + 1];
      win[3] = gray[r1 + x - 1];
      win[4] = gray[r1 + x];
      win[5] = gray[r1 + x + 1];
      win[6] = gray[r2 + x - 1];
      win[7] = gray[r2 + x];
      win[8] = gray[r2 + x + 1];

      // Insertion sort 9 bytes (zero heap allocation)
      for (let i = 1; i < 9; i++) {
        const key = win[i];
        let j = i - 1;
        while (j >= 0 && win[j] > key) {
          win[j + 1] = win[j];
          j--;
        }
        win[j + 1] = key;
      }

      const diff = Math.abs(gray[r1 + x] - win[4]);
      absSum += diff;
      sqSum += diff * diff;
      if (diff <= 1) nearZeroCount++;
      count++;
    }
  }

  return {
    mae: count > 0 ? Number((absSum / count).toFixed(3)) : 0,
    rmse: count > 0 ? Number(Math.sqrt(sqSum / count).toFixed(3)) : 0,
    zeroResidualRatio: count > 0 ? Number(((nearZeroCount / count) * 100).toFixed(1)) : 50
  };
}

/**
 * 1-level 2D Haar DWT energy ratio across LL / LH / HL / HH subbands.
 */
function analyzeHaarWavelet(gray, width, height) {
  const halfW = Math.floor(width / 2);
  const halfH = Math.floor(height / 2);
  if (halfW < 8 || halfH < 8) {
    return { hhEnergy: 0, detailRatio: 0 };
  }

  let llE = 0;
  let hvE = 0;
  let hhE = 0;
  let count = 0;

  for (let y = 0; y < halfH; y++) {
    const r0 = y * 2 * width;
    const r1 = (y * 2 + 1) * width;
    for (let x = 0; x < halfW; x++) {
      const c0 = x * 2;
      const a = gray[r0 + c0];
      const b = gray[r0 + c0 + 1];
      const c = gray[r1 + c0];
      const d = gray[r1 + c0 + 1];

      const ll = (a + b + c + d) * 0.25;
      const lh = (a + b - c - d) * 0.25;
      const hl = (a - b + c - d) * 0.25;
      const hh = (a - b - c + d) * 0.25;

      llE += ll * ll;
      hvE += lh * lh + hl * hl;
      hhE += hh * hh;
      count++;
    }
  }

  const totalDetail = hvE + hhE;
  return {
    hhEnergy: Number(Math.sqrt(hhE / Math.max(1, count)).toFixed(3)),
    detailRatio: Number(((totalDetail / Math.max(1, llE)) * 100).toFixed(3))
  };
}

/**
 * Binary Shannon entropy for Bit 0 (LSB), Bit 1, and Bit 2 on grayscale pixels.
 */
function analyzeBitPlanes(gray) {
  const total = gray.length;
  if (total === 0) return { bit0Entropy: 0, bit1Entropy: 0, bit2Entropy: 0 };

  let ones0 = 0;
  let ones1 = 0;
  let ones2 = 0;
  const step = total > 150000 ? 2 : 1;
  let sampled = 0;

  for (let i = 0; i < total; i += step) {
    const val = gray[i];
    if (val & 1) ones0++;
    if (val & 2) ones1++;
    if (val & 4) ones2++;
    sampled++;
  }

  const entropy = (ones) => {
    const p1 = ones / Math.max(1, sampled);
    const p0 = 1 - p1;
    let h = 0;
    if (p1 > 0 && p1 < 1) h -= p1 * Math.log2(p1);
    if (p0 > 0 && p0 < 1) h -= p0 * Math.log2(p0);
    return Number(h.toFixed(4));
  };

  return {
    bit0Entropy: entropy(ones0),
    bit1Entropy: entropy(ones1),
    bit2Entropy: entropy(ones2)
  };
}

/**
 * 3x3 RGB covariance Principal Component Analysis.
 */
function analyzeColorPCA(rgb) {
  const pixelCount = Math.floor(rgb.length / 3);
  if (pixelCount < 64) {
    return { eigenvalues: [0, 0, 0], variancePct: [33.3, 33.3, 33.3], minorAxisRatio: 0.1 };
  }

  const step = pixelCount > 120000 ? 3 : 1;
  let meanR = 0;
  let meanG = 0;
  let meanB = 0;
  let n = 0;

  for (let i = 0; i < pixelCount; i += step) {
    const idx = i * 3;
    meanR += rgb[idx];
    meanG += rgb[idx + 1];
    meanB += rgb[idx + 2];
    n++;
  }
  meanR /= n;
  meanG /= n;
  meanB /= n;

  let cRR = 0, cRG = 0, cRB = 0, cGG = 0, cGB = 0, cBB = 0;
  for (let i = 0; i < pixelCount; i += step) {
    const idx = i * 3;
    const dr = rgb[idx] - meanR;
    const dg = rgb[idx + 1] - meanG;
    const db = rgb[idx + 2] - meanB;
    cRR += dr * dr;
    cRG += dr * dg;
    cRB += dr * db;
    cGG += dg * dg;
    cGB += dg * db;
    cBB += db * db;
  }

  const cov = [
    [cRR / n, cRG / n, cRB / n],
    [cRG / n, cGG / n, cGB / n],
    [cRB / n, cGB / n, cBB / n]
  ];

  const eigen = jacobiEigen3x3(cov);
  const sum = eigen[0].val + eigen[1].val + eigen[2].val;
  const variancePct =
    sum > 0
      ? eigen.map((e) => Number(((e.val / sum) * 100).toFixed(1)))
      : [33.3, 33.3, 33.4];

  return {
    eigenvalues: eigen.map((e) => Number(e.val.toFixed(1))),
    variancePct,
    minorAxisRatio: eigen[0].val > 0 ? Number((eigen[2].val / eigen[0].val).toFixed(4)) : 0
  };
}

/**
 * Multi-quality JPEG ELA & Ghost Map sweep via Sharp.
 */
async function analyzeJpegElaAndGhosts(rgbBuffer, width, height) {
  try {
    const targetW = Math.min(width, 160);
    const targetH = Math.max(32, Math.round((height / Math.max(1, width)) * targetW));

    const baseSharp = sharp(rgbBuffer, {
      raw: { width, height, channels: 3 }
    }).resize(targetW, targetH, { kernel: 'lanczos3' });

    const baseRaw = await baseSharp.clone().raw().toBuffer();
    const qualities = [60, 85, 92];
    let decoded85 = null;

    const results = await Promise.all(
      qualities.map(async (q) => {
        const jpegBuf = await baseSharp.clone().jpeg({ quality: q, mozjpeg: false }).toBuffer();
        const decoded = await sharp(jpegBuf).removeAlpha().raw().toBuffer();
        if (q === 85) decoded85 = decoded;

        let errSum = 0;
        let errSq = 0;
        const len = Math.min(baseRaw.length, decoded.length);

        for (let i = 0; i < len; i++) {
          const d = Math.abs(baseRaw[i] - decoded[i]);
          errSum += d;
          errSq += d * d;
        }

        const meanErr = errSum / Math.max(1, len);
        const variance = errSq / Math.max(1, len) - meanErr * meanErr;

        return {
          quality: q,
          meanError: Number(meanErr.toFixed(2)),
          variance: Number(variance.toFixed(2))
        };
      })
    );

    const elaQ85 = results.find((r) => r.quality === 85) || results[1];
    let bestGhost = results[0];
    for (const r of results) {
      if (r.meanError < bestGhost.meanError) bestGhost = r;
    }

    // Reuse Q=85 decoded pass for 16x16 grid block disparity to spot local splices without extra encode
    const dec85 = decoded85 || baseRaw;
    const blockMeans = [];
    const step = 16;
    for (let by = 0; by + step <= targetH; by += step) {
      for (let bx = 0; bx + step <= targetW; bx += step) {
        let sum = 0;
        for (let y = 0; y < step; y++) {
          const row = (by + y) * targetW;
          for (let x = 0; x < step; x++) {
            const idx = (row + bx + x) * 3;
            sum +=
              (Math.abs(baseRaw[idx] - dec85[idx]) +
                Math.abs(baseRaw[idx + 1] - dec85[idx + 1]) +
                Math.abs(baseRaw[idx + 2] - dec85[idx + 2])) /
              3;
          }
        }
        blockMeans.push(sum / (step * step));
      }
    }

    let hotspotRatio = 0;
    if (blockMeans.length > 4) {
      const avgBlock = blockMeans.reduce((a, b) => a + b, 0) / blockMeans.length;
      const hotspotCount = blockMeans.filter((m) => m > Math.max(6, avgBlock * 2.15)).length;
      hotspotRatio = Number(((hotspotCount / blockMeans.length) * 100).toFixed(1));
    }

    return {
      isAvailable: true,
      elaMeanQ85: elaQ85.meanError,
      elaVarianceQ85: elaQ85.variance,
      elaHotspotRatio: hotspotRatio,
      bestGhostQuality: bestGhost.quality,
      ghostCurve: results
    };
  } catch {
    return {
      isAvailable: false,
      elaMeanQ85: 0,
      elaVarianceQ85: 0,
      elaHotspotRatio: 0,
      bestGhostQuality: 85,
      ghostCurve: []
    };
  }
}

/**
 * Container header structure & embedded EXIF thumbnail comparison via Sharp.
 */
async function analyzeThumbnailAndHeader(fileBuffer, rgbBuffer, width, height, mimeType) {
  const result = {
    containerFormat: (mimeType || '').split('/')[1]?.toUpperCase() || 'IMAGE',
    hasEmbeddedThumbnail: false,
    thumbnailMae: null,
    thumbnailMismatch: false
  };

  try {
    const parser = exifParser.create(fileBuffer);
    const parsed = parser.parse();
    if (parsed.hasThumbnail && parsed.hasThumbnail('image/jpeg')) {
      const thumbBuf = parsed.getThumbnailBuffer();
      if (thumbBuf && thumbBuf.length > 64) {
        result.hasEmbeddedThumbnail = true;
        const size = 64;
        const [mainSample, thumbSample] = await Promise.all([
          sharp(rgbBuffer, { raw: { width, height, channels: 3 } })
            .resize(size, size, { fit: 'fill' })
            .raw()
            .toBuffer(),
          sharp(thumbBuf).removeAlpha().resize(size, size, { fit: 'fill' }).raw().toBuffer()
        ]);

        let diffSum = 0;
        const n = Math.min(mainSample.length, thumbSample.length);
        for (let i = 0; i < n; i++) {
          diffSum += Math.abs(mainSample[i] - thumbSample[i]);
        }
        const mae = Number((diffSum / Math.max(1, n)).toFixed(2));
        result.thumbnailMae = mae;
        result.thumbnailMismatch = mae > 28;
      }
    }
  } catch {
    // No EXIF thumbnail available
  }

  return result;
}

/**
 * Execute full Sherloq forensic DSP telemetry suite concurrently inside Node RAM buffers.
 */
export async function analyzeSherloqForensics({
  fileBuffer,
  rgbBuffer,
  grayBuffer,
  width,
  height,
  mimeType
}) {
  const [jpegAudit, thumbnailAudit] = await Promise.all([
    analyzeJpegElaAndGhosts(rgbBuffer, width, height),
    analyzeThumbnailAndHeader(fileBuffer, rgbBuffer, width, height, mimeType)
  ]);

  const median = analyzeMedianResidual(grayBuffer, width, height);
  const wavelet = analyzeHaarWavelet(grayBuffer, width, height);
  const bitPlanes = analyzeBitPlanes(grayBuffer);
  const colorPca = analyzeColorPCA(rgbBuffer);
  // Defer quadratic patch cloning scan out of the fast /api/detect hot path
  const cloning = { clusterCount: 0, matchPairs: 0, deferredToWorkbench: true };

  // Continuous micro-signal synthetic probability hint from fast Sherloq spatial transforms
  const medianSmoothnessFactor = Math.min(1, Math.max(0, (median.zeroResidualRatio - 45) / 48));
  const lowMaeFactor = Math.min(1, Math.max(0, (2.2 - median.mae) / 2.0));
  const pcaPinchFactor = colorPca.minorAxisRatio < 0.016
    ? Math.min(1, (0.016 - colorPca.minorAxisRatio) / 0.012)
    : 0;
  const entropyDeficit = bitPlanes.bit0Entropy < 0.96
    ? Math.min(1, (0.96 - bitPlanes.bit0Entropy) / 0.25)
    : 0;

  const rawSherloqHint =
    0.14 +
    medianSmoothnessFactor * 0.38 +
    lowMaeFactor * 0.24 +
    pcaPinchFactor * 0.14 +
    entropyDeficit * 0.12 +
    (thumbnailAudit.thumbnailMismatch ? 0.18 : 0) -
    (thumbnailAudit.hasEmbeddedThumbnail && !thumbnailAudit.thumbnailMismatch ? 0.12 : 0);
  const sherloqAiHint = Number(Math.min(0.92, Math.max(0.08, rawSherloqHint)).toFixed(3));

  const indicators = [];

  if (thumbnailAudit.thumbnailMismatch) {
    indicators.push({
      type: 'ANOMALY',
      name: 'EXIF Thumbnail Mismatch (Sherloq Audit)',
      detail: `Embedded camera thumbnail differs from primary pixel buffer (MAE: ${thumbnailAudit.thumbnailMae}), suggesting post-capture cropping or splicing.`
    });
  } else if (thumbnailAudit.hasEmbeddedThumbnail) {
    indicators.push({
      type: 'AUTHENTIC',
      name: 'EXIF Thumbnail Verified (Sherloq Audit)',
      detail: `Embedded camera thumbnail aligns consistently with primary frame pixels (MAE: ${thumbnailAudit.thumbnailMae}).`
    });
  }

  if (median.zeroResidualRatio >= 84 && bitPlanes.bit0Entropy >= 0.72) {
    indicators.push({
      type: 'ANOMALY',
      name: 'Median Residual Smoothing Deficit',
      detail: `${median.zeroResidualRatio}% of sampled pixels show <=1 luminance delta under 3x3 median filtering (MAE: ${median.mae}), consistent with neural denoising/diffusion smoothing.`
    });
  } else if (median.mae >= 1.1 && bitPlanes.bit0Entropy >= 0.92) {
    indicators.push({
      type: 'AUTHENTIC',
      name: 'High-Entropy LSB & Natural Median Residual',
      detail: `LSB bit-plane entropy (${bitPlanes.bit0Entropy} bits) and micro-detail median residual (MAE: ${median.mae}) align with genuine camera sensor capture.`
    });
  }

  return {
    isValid: true,
    sherloqAiHint,
    jpegAudit,
    median,
    wavelet,
    bitPlanes,
    colorPca,
    cloning,
    thumbnailAudit,
    indicators
  };
}
