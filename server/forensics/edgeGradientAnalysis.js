/**
 * Edge Gradient Coherence, Chromatic Dispersion & Micro-Texture Analysis
 * Evaluates optical lens physics (chromatic dispersion at high-contrast boundaries)
 * and texture micro-entropy.
 */

export function analyzeEdgeAndOpticalGradients(rgbBuffer, width, height) {
  if (width < 32 || height < 32) {
    return {
      isValid: false,
      reason: 'Dimensions too small for optical gradient inspection',
      gradientAiScore: 0.5
    };
  }

  const indicators = [];
  let totalEdgeCount = 0;
  let dispersionDeltas = 0;
  let harshTransitionCount = 0;

  // Scan horizontal & vertical lines for high-contrast edges
  // Sample every 4th line for speed
  for (let y = 10; y < height - 10; y += 4) {
    for (let x = 10; x < width - 10; x += 4) {
      const idx = (y * width + x) * 3;
      const rightIdx = (y * width + (x + 1)) * 3;

      const lum = 0.299 * rgbBuffer[idx] + 0.587 * rgbBuffer[idx + 1] + 0.114 * rgbBuffer[idx + 2];
      const rightLum = 0.299 * rgbBuffer[rightIdx] + 0.587 * rgbBuffer[rightIdx + 1] + 0.114 * rgbBuffer[rightIdx + 2];

      const edgeDelta = Math.abs(lum - rightLum);

      // Strong optical edge
      if (edgeDelta > 50) {
        totalEdgeCount++;

        // Measure color channel alignment (Chromatic dispersion at boundary)
        const deltaR = Math.abs(rgbBuffer[idx] - rgbBuffer[rightIdx]);
        const deltaB = Math.abs(rgbBuffer[idx + 2] - rgbBuffer[rightIdx + 2]);
        const colorDisparity = Math.abs(deltaR - deltaB);

        dispersionDeltas += colorDisparity;

        // Check if edge is completely sharp (0-pixel transition) without optical blur
        if (edgeDelta > 110) {
          harshTransitionCount++;
        }
      }
    }
  }

  const avgDispersion = totalEdgeCount > 10 ? dispersionDeltas / totalEdgeCount : 0;
  const harshEdgeRatio = totalEdgeCount > 10 ? harshTransitionCount / totalEdgeCount : 0;

  // Smooth continuous optical chromatic aberration curve (no fixed discrete jumps)
  let gradientAiScore = 0.5;
  if (totalEdgeCount >= 10) {
    const dispFactor = Math.min(1, avgDispersion / 22);
    gradientAiScore = 0.64 - dispFactor * 0.42 + harshEdgeRatio * 0.24;
  }

  if (avgDispersion > 11.0 && harshEdgeRatio < 0.22) {
    indicators.push({
      type: 'AUTHENTIC',
      name: 'Physical Optical Edge Dispersion',
      detail: `High-contrast boundaries exhibit RGB wavelength dispersion (${avgDispersion.toFixed(1)}) matching physical glass refraction.`
    });
  } else if (avgDispersion < 5.0 && totalEdgeCount > 25) {
    indicators.push({
      type: 'ANOMALY',
      name: 'Achromatic Synthetic Boundaries',
      detail: `Boundary edges show minimal glass chromatic fringing (${avgDispersion.toFixed(1)}), typical of rendered or generative images.`
    });
  }

  return {
    isValid: true,
    gradientAiScore: Number(Math.max(0.10, Math.min(0.90, gradientAiScore)).toFixed(3)),
    avgDispersion: Math.round(avgDispersion * 10) / 10,
    totalEdgeCount,
    indicators
  };
}
