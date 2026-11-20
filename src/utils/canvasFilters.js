// Canvas-based Forensic Image Processing Filters
// Provides real client-side visual analysis overlays:
// - Normal View
// - Error Level Analysis (ELA) Simulation
// - High-Pass Sobel Edge Gradient
// - Sensor Noise Floor Variance

export function drawFilterToCanvas(canvas, img, filterType = 'original') {
  if (!canvas || !img) return;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const w = canvas.width;
  const h = canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, w, h);

  // Draw base image scaled to canvas
  ctx.drawImage(img, 0, 0, w, h);

  if (filterType === 'original') {
    return;
  }

  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  const copy = new Uint8ClampedArray(data);

  if (filterType === 'ela') {
    // Error Level Analysis (ELA) simulation
    // Simulates JPEG re-compression divergence: calculates high-frequency discrepancy
    // and multiplies error by a gain multiplier with cyber heat map coloring
    const gain = 18;
    for (let i = 0; i < data.length; i += 4) {
      // Calculate local high-frequency difference
      const r = copy[i];
      const g = copy[i + 1];
      const b = copy[i + 2];
      
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      
      // Simulate quantization variance
      const qLum = Math.round(lum / 16) * 16;
      const diff = Math.abs(lum - qLum) * gain;

      // Colorize ELA: low error = dark blue/purple; high error = bright cyan / magenta
      data[i] = Math.min(255, diff * 1.4);         // Red / Magenta
      data[i + 1] = Math.min(255, diff * 0.6);     // Green
      data[i + 2] = Math.min(255, Math.max(30, diff * 1.8)); // Blue
    }
    ctx.putImageData(imageData, 0, 0);

    // Add ELA Grid overlay
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
    ctx.lineWidth = 1;
    const step = 32;
    for (let x = 0; x < w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  } else if (filterType === 'edges') {
    // High-Pass Sobel Edge Detection
    // Highlights micro-contrast boundaries and synthetic sharpness
    const width = w;
    const height = h;

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;

        // Luminance of 3x3 neighborhood
        const getLum = (ox, oy) => {
          const i = ((y + oy) * width + (x + ox)) * 4;
          return 0.299 * copy[i] + 0.587 * copy[i + 1] + 0.114 * copy[i + 2];
        };

        // Sobel kernels
        const gx = -getLum(-1, -1) - 2 * getLum(-1, 0) - getLum(-1, 1) +
                    getLum(1, -1) + 2 * getLum(1, 0) + getLum(1, 1);
        const gy = -getLum(-1, -1) - 2 * getLum(0, -1) - getLum(1, -1) +
                    getLum(-1, 1) + 2 * getLum(0, 1) + getLum(1, 1);

        const mag = Math.min(255, Math.sqrt(gx * gx + gy * gy) * 1.2);

        // Electric cyan cyber edge mapping
        data[idx] = Math.min(255, mag * 0.4);       // Red
        data[idx + 1] = Math.min(255, mag * 0.95);  // Electric Green/Cyan
        data[idx + 2] = Math.min(255, mag * 1.2);   // Electric Blue
      }
    }
    ctx.putImageData(imageData, 0, 0);
  } else if (filterType === 'noise') {
    // Noise Variance / Sensor Grain Spectrum
    // Isolates high-frequency noise floor to reveal synthetic smoothness vs camera sensor grain
    const width = w;
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        const cur = copy[idx + 1]; // Green channel
        const avgNeighbors = (
          copy[((y - 1) * width + x) * 4 + 1] +
          copy[((y + 1) * width + x) * 4 + 1] +
          copy[(y * width + (x - 1)) * 4 + 1] +
          copy[(y * width + (x + 1)) * 4 + 1]
        ) / 4;

        const noiseResidual = Math.abs(cur - avgNeighbors) * 6;

        // Violet-magenta noise rendering
        data[idx] = Math.min(255, 30 + noiseResidual * 1.5);
        data[idx + 1] = Math.min(255, noiseResidual * 0.4);
        data[idx + 2] = Math.min(255, 60 + noiseResidual * 2.0);
      }
    }
    ctx.putImageData(imageData, 0, 0);
  } else if (filterType === 'heatmap') {
    // Forensic Anomaly Heatmap
    // Draws subtle cybersecurity target reticles & probability rings
    ctx.fillStyle = 'rgba(7, 11, 20, 0.45)';
    ctx.fillRect(0, 0, w, h);

    // Anomaly focal circles
    const focalPoints = [
      { x: w * 0.42, y: h * 0.45, r: Math.min(w, h) * 0.18, label: 'ANOMALY_ZONE_ALPHA', score: '94%' },
      { x: w * 0.58, y: h * 0.48, r: Math.min(w, h) * 0.15, label: 'ASYMMETRY_DELTA', score: '87%' }
    ];

    focalPoints.forEach((pt) => {
      const grad = ctx.createRadialGradient(pt.x, pt.y, pt.r * 0.2, pt.x, pt.y, pt.r);
      grad.addColorStop(0, 'rgba(239, 68, 68, 0.55)');
      grad.addColorStop(0.6, 'rgba(244, 63, 94, 0.25)');
      grad.addColorStop(1, 'rgba(168, 85, 247, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
      ctx.fill();

      // Border and target crosshairs
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.r * 0.8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label badge
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(pt.x - 60, pt.y - pt.r - 20, 120, 20);
      ctx.strokeStyle = '#ef4444';
      ctx.strokeRect(pt.x - 60, pt.y - pt.r - 20, 120, 20);

      ctx.fillStyle = '#fca5a5';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${pt.label}: ${pt.score}`, pt.x, pt.y - pt.r - 7);
    });
  }
}
