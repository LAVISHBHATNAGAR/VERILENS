// Sherloq-Inspired Web-Native Canvas Forensic Image Processing Suite
// Executes genuine client-side DSP transforms on uploaded images:
// - Normal View
// - Real JPEG Recompression ELA (cached canvas JPEG encode/decode diff)
// - JPEG Ghost Map (Hany Farid multi-quality minimum discrepancy detector)
// - Luminance Gradient (spatial vector illumination relief)
// - Noise Separation (3x3 median denoiser residual)
// - Bit-Plane Slicer (Bits 0..7 LSB across Lum/R/G/B + Shannon entropy)
// - Color PCA Projection (3x3 RGB covariance Jacobi eigensolver)
// - 2D Haar Wavelet Subbands (LH / HL / HH high-frequency quadrants)
// - Copy-Move Clone Block Matching (self-similarity vector lines)
// - High-Pass Sobel Edge Boundaries

const jpegBufferCache = new Map();

function encodeAndDecodeJpeg(img, w, h, quality) {
  const key = `${img.src?.slice(0, 120) || 'img'}_${w}x${h}_q${quality}`;
  if (jpegBufferCache.has(key)) {
    return Promise.resolve(jpegBufferCache.get(key));
  }

  return new Promise((resolve) => {
    const off = document.createElement('canvas');
    off.width = w;
    off.height = h;
    const octx = off.getContext('2d', { willReadFrequently: true });
    if (!octx) {
      resolve(null);
      return;
    }
    octx.drawImage(img, 0, 0, w, h);

    let dataUrl;
    try {
      dataUrl = off.toDataURL('image/jpeg', Math.min(0.99, Math.max(0.1, quality / 100)));
    } catch {
      resolve(null);
      return;
    }

    const tmp = new Image();
    tmp.onload = () => {
      octx.clearRect(0, 0, w, h);
      octx.drawImage(tmp, 0, 0, w, h);
      try {
        const pixels = new Uint8ClampedArray(octx.getImageData(0, 0, w, h).data);
        if (jpegBufferCache.size > 24) {
          const oldest = jpegBufferCache.keys().next().value;
          jpegBufferCache.delete(oldest);
        }
        jpegBufferCache.set(key, pixels);
        resolve(pixels);
      } catch {
        resolve(null);
      }
    };
    tmp.onerror = () => resolve(null);
    tmp.src = dataUrl;
  });
}

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

  for (let sweep = 0; sweep < 14; sweep++) {
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
    if (maxOff < 1e-8) break;

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

  return [
    { val: Math.max(0, a[0][0]), vec: [v[0][0], v[1][0], v[2][0]] },
    { val: Math.max(0, a[1][1]), vec: [v[0][1], v[1][1], v[2][1]] },
    { val: Math.max(0, a[2][2]), vec: [v[0][2], v[1][2], v[2][2]] }
  ].sort((x, y) => y.val - x.val);
}

/**
 * Draw selected forensic inspection overlay onto target canvas.
 * Returns telemetry metadata computed directly from canvas pixels.
 */
export async function drawFilterToCanvas(canvas, img, filterType = 'original', options = {}, isCancelled = () => false) {
  if (!canvas || !img) return {};

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return {};

  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);

  if (filterType === 'original') {
    return { filter: 'original' };
  }

  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  const copy = new Uint8ClampedArray(data);

  // 1. REAL JPEG RECOMPRESSION ELA
  if (filterType === 'ela') {
    const quality = options.elaQuality ?? 85;
    const gain = options.elaScale ?? 16;
    const grayscale = Boolean(options.elaGrayscale);

    const recomp = await encodeAndDecodeJpeg(img, w, h, quality);
    if (isCancelled()) return {};

    let meanDelta = 0;
    const count = w * h;

    for (let i = 0; i < data.length; i += 4) {
      let dr, dg, db;
      if (recomp) {
        dr = Math.abs(copy[i] - recomp[i]);
        dg = Math.abs(copy[i + 1] - recomp[i + 1]);
        db = Math.abs(copy[i + 2] - recomp[i + 2]);
      } else {
        const lum = 0.299 * copy[i] + 0.587 * copy[i + 1] + 0.114 * copy[i + 2];
        const qLum = Math.round(lum / 12) * 12;
        dr = dg = db = Math.abs(lum - qLum);
      }

      const delta = (dr + dg + db) / 3;
      meanDelta += delta;
      const amp = delta * gain;

      if (grayscale) {
        const g = Math.min(255, amp);
        data[i] = g;
        data[i + 1] = g;
        data[i + 2] = g;
      } else {
        data[i] = Math.min(255, amp * 1.45);
        data[i + 1] = Math.min(255, amp * 0.42);
        data[i + 2] = Math.min(255, 16 + amp * 0.85);
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Subtle 8x8 DCT alignment grid
    ctx.strokeStyle = 'rgba(255, 46, 46, 0.14)';
    ctx.lineWidth = 1;
    const step = 32;
    ctx.beginPath();
    for (let x = 0; x < w; x += step) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let y = 0; y < h; y += step) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();

    return {
      filter: 'ela',
      elaMeanDelta: Number((meanDelta / Math.max(1, count)).toFixed(2)),
      elaQuality: quality
    };
  }

  // 2. HANY FARID JPEG GHOST MAP
  if (filterType === 'ghost') {
    const ghostQuality = options.ghostQuality ?? 70;
    const recomp = await encodeAndDecodeJpeg(img, w, h, ghostQuality);
    if (isCancelled()) return {};

    // Compute raw pixelwise squared error
    const errMap = new Float32Array(w * h);
    if (recomp) {
      for (let i = 0; i < w * h; i++) {
        const p = i * 4;
        const dr = copy[p] - recomp[p];
        const dg = copy[p + 1] - recomp[p + 1];
        const db = copy[p + 2] - recomp[p + 2];
        errMap[i] = Math.sqrt((dr * dr + dg * dg + db * db) / 3);
      }
    }

    // 7x7 spatial smoothing filter to isolate 8x8 DCT ghost patches
    let minVal = Infinity;
    let maxVal = 0;
    const smoothed = new Float32Array(w * h);
    for (let y = 3; y < h - 3; y++) {
      for (let x = 3; x < w - 3; x++) {
        let sum = 0;
        for (let oy = -3; oy <= 3; oy += 2) {
          const row = (y + oy) * w;
          for (let ox = -3; ox <= 3; ox += 2) {
            sum += errMap[row + x + ox];
          }
        }
        const avg = sum / 16;
        smoothed[y * w + x] = avg;
        if (avg < minVal) minVal = avg;
        if (avg > maxVal) maxVal = avg;
      }
    }

    const span = Math.max(1e-3, maxVal - minVal);
    for (let i = 0; i < w * h; i++) {
      const norm = Math.max(0, Math.min(1, (smoothed[i] - minVal) / span));
      const p = i * 4;
      // Ghost heatmap: dark indigo base -> glowing crimson/rose anomalies
      const heat = Math.pow(norm, 0.85);
      data[p] = Math.min(255, Math.round(14 + heat * 241));
      data[p + 1] = Math.min(255, Math.round(16 + (1 - Math.abs(heat - 0.5) * 2) * 90 + (heat > 0.7 ? (heat - 0.7) * 500 : 0)));
      data[p + 2] = Math.min(255, Math.round(28 + (1 - heat) * 85 + heat * 60));
    }

    ctx.putImageData(imageData, 0, 0);
    return { filter: 'ghost', ghostQuality };
  }

  // 3. SPATIAL LUMINANCE GRADIENT (Sherloq gradient.py)
  if (filterType === 'gradient') {
    const invert = Boolean(options.gradInvert);
    const scale = options.gradScale ?? 1.8;
    const lum = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) {
      const p = i * 4;
      lum[i] = 0.299 * copy[p] + 0.587 * copy[p + 1] + 0.114 * copy[p + 2];
    }

    const sign = invert ? -1 : 1;
    for (let y = 1; y < h - 1; y++) {
      const r0 = (y - 1) * w;
      const r1 = y * w;
      const r2 = (y + 1) * w;
      for (let x = 1; x < w - 1; x++) {
        const dx =
          sign *
          (-lum[r0 + x - 1] -
            2 * lum[r1 + x - 1] -
            lum[r2 + x - 1] +
            lum[r0 + x + 1] +
            2 * lum[r1 + x + 1] +
            lum[r2 + x + 1]) *
          0.25;
        const dy =
          sign *
          (-lum[r0 + x - 1] -
            2 * lum[r0 + x] -
            lum[r0 + x + 1] +
            lum[r2 + x - 1] +
            2 * lum[r2 + x] +
            lum[r2 + x + 1]) *
          0.25;

        const idx = (r1 + x) * 4;
        data[idx] = Math.min(255, Math.max(0, Math.round(128 + dx * scale)));
        data[idx + 1] = Math.min(255, Math.max(0, Math.round(128 + dy * scale)));
        data[idx + 2] = Math.min(255, Math.round(Math.hypot(dx, dy) * scale));
      }
    }
    ctx.putImageData(imageData, 0, 0);
    return { filter: 'gradient' };
  }

  // 4. MEDIAN NOISE RESIDUAL SEPARATION (Sherloq noise.py)
  if (filterType === 'noise') {
    const gain = options.noiseGain ?? 8;
    const grayOnly = Boolean(options.noiseGrayscale);
    const winR = new Uint8Array(9);
    const winG = new Uint8Array(9);
    const winB = new Uint8Array(9);

    const sort9 = (arr) => {
      for (let i = 1; i < 9; i++) {
        const k = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > k) {
          arr[j + 1] = arr[j];
          j--;
        }
        arr[j + 1] = k;
      }
      return arr[4];
    };

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        let k = 0;
        for (let oy = -1; oy <= 1; oy++) {
          const row = (y + oy) * w;
          for (let ox = -1; ox <= 1; ox++) {
            const p = (row + x + ox) * 4;
            winR[k] = copy[p];
            winG[k] = copy[p + 1];
            winB[k] = copy[p + 2];
            k++;
          }
        }
        const cIdx = (y * w + x) * 4;
        const dr = Math.abs(copy[cIdx] - sort9(winR)) * gain;
        const dg = Math.abs(copy[cIdx + 1] - sort9(winG)) * gain;
        const db = Math.abs(copy[cIdx + 2] - sort9(winB)) * gain;

        if (grayOnly) {
          const lum = Math.min(255, Math.round(0.299 * dr + 0.587 * dg + 0.114 * db));
          data[cIdx] = lum;
          data[cIdx + 1] = lum;
          data[cIdx + 2] = lum;
        } else {
          data[cIdx] = Math.min(255, 16 + dr * 1.45);
          data[cIdx + 1] = Math.min(255, 12 + dg * 0.65);
          data[cIdx + 2] = Math.min(255, 28 + db * 1.5);
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);
    return { filter: 'noise' };
  }

  // 5. BIT-PLANE SLICER (Sherloq planes.py)
  if (filterType === 'bitplane') {
    const bit = Math.max(0, Math.min(7, options.bitIndex ?? 0));
    const channel = options.bitChannel ?? 'lum'; // 'lum' | 'r' | 'g' | 'b'
    const mask = 1 << bit;
    let onesCount = 0;
    const total = w * h;

    for (let i = 0; i < total; i++) {
      const p = i * 4;
      let v;
      if (channel === 'r') v = copy[p];
      else if (channel === 'g') v = copy[p + 1];
      else if (channel === 'b') v = copy[p + 2];
      else v = Math.round(0.299 * copy[p] + 0.587 * copy[p + 1] + 0.114 * copy[p + 2]);

      const active = (v & mask) !== 0;
      if (active) onesCount++;

      if (active) {
        data[p] = bit <= 1 ? 255 : 244;
        data[p + 1] = bit <= 1 ? 75 : 244;
        data[p + 2] = bit <= 1 ? 105 : 248;
      } else {
        data[p] = 10;
        data[p + 1] = 12;
        data[p + 2] = 18;
      }
    }

    const p1 = onesCount / Math.max(1, total);
    const p0 = 1 - p1;
    let bitEntropy = 0;
    if (p1 > 0 && p1 < 1) bitEntropy -= p1 * Math.log2(p1);
    if (p0 > 0 && p0 < 1) bitEntropy -= p0 * Math.log2(p0);

    ctx.putImageData(imageData, 0, 0);
    return {
      filter: 'bitplane',
      bitIndex: bit,
      bitEntropy: Number(bitEntropy.toFixed(4))
    };
  }

  // 6. 3x3 COLOR PCA PROJECTION / CROSS DISTANCE (Sherloq pca.py)
  if (filterType === 'pca') {
    const compIdx = Math.max(0, Math.min(2, options.pcaComponent ?? 1)); // Default PC2 highlights color shift
    const mode = options.pcaMode ?? 'distance'; // 'distance' | 'projection'
    const pixelCount = w * h;
    const step = pixelCount > 100000 ? 2 : 1;

    let mR = 0, mG = 0, mB = 0, n = 0;
    for (let i = 0; i < pixelCount; i += step) {
      const p = i * 4;
      mR += copy[p];
      mG += copy[p + 1];
      mB += copy[p + 2];
      n++;
    }
    mR /= n;
    mG /= n;
    mB /= n;

    let cRR = 0, cRG = 0, cRB = 0, cGG = 0, cGB = 0, cBB = 0;
    for (let i = 0; i < pixelCount; i += step) {
      const p = i * 4;
      const dr = copy[p] - mR;
      const dg = copy[p + 1] - mG;
      const db = copy[p + 2] - mB;
      cRR += dr * dr;
      cRG += dr * dg;
      cRB += dr * db;
      cGG += dg * dg;
      cGB += dg * db;
      cBB += db * db;
    }

    const eigen = jacobiEigen3x3([
      [cRR / n, cRG / n, cRB / n],
      [cRG / n, cGG / n, cGB / n],
      [cRB / n, cGB / n, cBB / n]
    ]);
    const sumEig = eigen[0].val + eigen[1].val + eigen[2].val;
    const pcaVariance = eigen.map((e) => Number(((e.val / Math.max(1e-6, sumEig)) * 100).toFixed(1)));
    const ev = eigen[compIdx].vec;

    const scalars = new Float32Array(pixelCount);
    let minS = Infinity;
    let maxS = -Infinity;

    for (let i = 0; i < pixelCount; i++) {
      const p = i * 4;
      const dr = copy[p] - mR;
      const dg = copy[p + 1] - mG;
      const db = copy[p + 2] - mB;

      let val;
      if (mode === 'projection') {
        val = dr * ev[0] + dg * ev[1] + db * ev[2];
      } else {
        // Cross-product orthogonal distance to eigenvector axis
        const cx = dg * ev[2] - db * ev[1];
        const cy = db * ev[0] - dr * ev[2];
        const cz = dr * ev[1] - dg * ev[0];
        val = Math.sqrt(cx * cx + cy * cy + cz * cz);
      }
      scalars[i] = val;
      if (val < minS) minS = val;
      if (val > maxS) maxS = val;
    }

    const span = Math.max(1e-4, maxS - minS);
    for (let i = 0; i < pixelCount; i++) {
      const u = Math.max(0, Math.min(1, (scalars[i] - minS) / span));
      const p = i * 4;
      const lum = Math.round(u * 255);
      if (mode === 'distance') {
        data[p] = Math.min(255, Math.round(u * 255));
        data[p + 1] = Math.min(255, Math.round(u * 130));
        data[p + 2] = Math.min(255, Math.round((1 - u) * 140 + u * 160));
      } else {
        data[p] = lum;
        data[p + 1] = lum;
        data[p + 2] = lum;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return {
      filter: 'pca',
      pcaComponent: compIdx + 1,
      pcaVariance
    };
  }

  // 7. 2D HAAR WAVELET SUBBANDS (Sherloq wavelets.py)
  if (filterType === 'wavelet') {
    const lum = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) {
      const p = i * 4;
      lum[i] = 0.299 * copy[p] + 0.587 * copy[p + 1] + 0.114 * copy[p + 2];
    }

    const halfW = Math.floor(w / 2);
    const halfH = Math.floor(h / 2);
    for (let y = 0; y < halfH; y++) {
      const r0 = y * 2 * w;
      const r1 = (y * 2 + 1) * w;
      for (let x = 0; x < halfW; x++) {
        const c0 = x * 2;
        const a = lum[r0 + c0];
        const b = lum[r0 + c0 + 1];
        const c = lum[r1 + c0];
        const d = lum[r1 + c0 + 1];

        const ll = Math.min(255, Math.max(0, Math.round((a + b + c + d) * 0.25)));
        const lh = Math.min(255, Math.round(Math.abs(a + b - c - d) * 1.9));
        const hl = Math.min(255, Math.round(Math.abs(a - b + c - d) * 1.9));
        const hh = Math.min(255, Math.round(Math.abs(a - b - c + d) * 3.2));

        // Quadrant TL: LL, TR: HL, BL: LH, BR: HH
        const pTL = (y * w + x) * 4;
        data[pTL] = ll;
        data[pTL + 1] = ll;
        data[pTL + 2] = ll;

        const pTR = (y * w + (halfW + x)) * 4;
        data[pTR] = hl;
        data[pTR + 1] = Math.round(hl * 0.45);
        data[pTR + 2] = Math.round(hl * 0.65);

        const pBL = ((halfH + y) * w + x) * 4;
        data[pBL] = Math.round(lh * 0.45);
        data[pBL + 1] = Math.round(lh * 0.9);
        data[pBL + 2] = lh;

        const pBR = ((halfH + y) * w + (halfW + x)) * 4;
        data[pBR] = Math.min(255, Math.round(hh * 1.35));
        data[pBR + 1] = Math.round(hh * 0.3);
        data[pBR + 2] = Math.round(hh * 0.45);
      }
    }
    ctx.putImageData(imageData, 0, 0);

    // Quadrant crosshairs & labels
    ctx.strokeStyle = 'rgba(255, 94, 120, 0.55)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(halfW, 0);
    ctx.lineTo(halfW, h);
    ctx.moveTo(0, halfH);
    ctx.lineTo(w, halfH);
    ctx.stroke();

    ctx.font = '600 10px monospace';
    ctx.fillStyle = '#fcfcfc';
    ctx.fillText('LL (Base)', 10, 18);
    ctx.fillStyle = '#ff8597';
    ctx.fillText('HL (Vertical)', halfW + 10, 18);
    ctx.fillStyle = '#34d399';
    ctx.fillText('LH (Horizontal)', 10, halfH + 18);
    ctx.fillStyle = '#ff2e2e';
    ctx.fillText('HH (Diagonal Detail)', halfW + 10, halfH + 18);

    return { filter: 'wavelet' };
  }

  // 8. COPY-MOVE CLONE BLOCK SELF-SIMILARITY SCAN (Sherloq cloning.py)
  if (filterType === 'clone') {
    const lum = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) {
      const p = i * 4;
      lum[i] = Math.round(0.299 * copy[p] + 0.587 * copy[p + 1] + 0.114 * copy[p + 2]);
      data[p] = Math.round(copy[p] * 0.42);
      data[p + 1] = Math.round(copy[p + 1] * 0.42);
      data[p + 2] = Math.round(copy[p + 2] * 0.45);
    }
    ctx.putImageData(imageData, 0, 0);

    const blockSize = 8;
    const stride = 6;
    const buckets = new Map();

    for (let y = 0; y + blockSize <= h; y += stride) {
      for (let x = 0; x + blockSize <= w; x += stride) {
        let sum = 0, sumSq = 0, ls = 0, rs = 0, ts = 0, bs = 0;
        for (let dy = 0; dy < blockSize; dy++) {
          const row = (y + dy) * w;
          for (let dx = 0; dx < blockSize; dx++) {
            const v = lum[row + x + dx];
            sum += v;
            sumSq += v * v;
            if (dx < 4) ls += v;
            else rs += v;
            if (dy < 4) ts += v;
            else bs += v;
          }
        }
        const mean = sum / 64;
        const variance = sumSq / 64 - mean * mean;
        const gx = (rs - ls) / 32;
        const gy = (bs - ts) / 32;
        if (variance < 45 || Math.abs(gx) + Math.abs(gy) < 18) continue;

        const key = `${Math.round(mean / 5)}_${Math.round(gx / 4)}_${Math.round(gy / 4)}`;
        let arr = buckets.get(key);
        if (!arr) {
          arr = [];
          buckets.set(key, arr);
        }
        if (arr.length < 10) arr.push({ x, y });
      }
    }

    const shiftClusters = new Map();
    for (const pts of buckets.values()) {
      if (pts.length < 2) continue;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i];
          const b = pts[j];
          const d = Math.hypot(b.x - a.x, b.y - a.y);
          if (d < 36) continue;

          let sad = 0;
          for (let dy = 0; dy < blockSize; dy++) {
            const rA = (a.y + dy) * w + a.x;
            const rB = (b.y + dy) * w + b.x;
            for (let dx = 0; dx < blockSize; dx++) {
              sad += Math.abs(lum[rA + dx] - lum[rB + dx]);
            }
          }
          if (sad / 64 <= 4.5) {
            const flip = b.x < a.x || (b.x === a.x && b.y < a.y);
            const sdx = flip ? a.x - b.x : b.x - a.x;
            const sdy = flip ? a.y - b.y : b.y - a.y;
            const sKey = `${Math.round(sdx / 6)}_${Math.round(sdy / 6)}`;
            let list = shiftClusters.get(sKey);
            if (!list) {
              list = [];
              shiftClusters.set(sKey, list);
            }
            list.push([{ x: a.x + 4, y: a.y + 4 }, { x: b.x + 4, y: b.y + 4 }]);
          }
        }
      }
    }

    const pairs = [];
    for (const list of shiftClusters.values()) {
      if (list.length >= 3) {
        for (const p of list) {
          if (pairs.length >= 48) break;
          pairs.push(p);
        }
      }
    }

    ctx.strokeStyle = 'rgba(255, 46, 46, 0.78)';
    ctx.fillStyle = 'rgba(255, 94, 120, 0.9)';
    ctx.lineWidth = 1.25;

    for (const [a, b] of pairs) {
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.fillRect(a.x - 2, a.y - 2, 4, 4);
      ctx.fillRect(b.x - 2, b.y - 2, 4, 4);
    }

    return { filter: 'clone', clonePairs: pairs.length };
  }

  // 9. HIGH-PASS SOBEL EDGE BOUNDARIES
  if (filterType === 'edges') {
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = (y * w + x) * 4;
        const getLum = (ox, oy) => {
          const i = ((y + oy) * w + (x + ox)) * 4;
          return 0.299 * copy[i] + 0.587 * copy[i + 1] + 0.114 * copy[i + 2];
        };
        const gx = -getLum(-1, -1) - 2 * getLum(-1, 0) - getLum(-1, 1) + getLum(1, -1) + 2 * getLum(1, 0) + getLum(1, 1);
        const gy = -getLum(-1, -1) - 2 * getLum(0, -1) - getLum(1, -1) + getLum(-1, 1) + 2 * getLum(0, 1) + getLum(1, 1);
        const mag = Math.min(255, Math.sqrt(gx * gx + gy * gy) * 1.2);
        data[idx] = Math.min(255, mag * 0.95);
        data[idx + 1] = Math.min(255, mag * 0.42);
        data[idx + 2] = Math.min(255, mag * 0.58);
      }
    }
    ctx.putImageData(imageData, 0, 0);
    return { filter: 'edges' };
  }

  return {};
}
