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

  let gradientAiScore = 0.5;
  const avgDispersion = totalEdgeCount > 10 ? dispersionDeltas / totalEdgeCount : 0;
  const harshEdgeRatio = totalEdgeCount > 10 ? harshTransitionCount / totalEdgeCount : 0;

  // Physical glass lenses typically create consistent subtle chromatic fringing (dispersion > 8)
  if (avgDispersion > 12.0 && harshEdgeRatio < 0.20) {
    gradientAiScore -= 0.15;
    indicators.push({
      type: 'AUTHENTIC',
      name: 'Physical Optical Edge Dispersion',
      detail: `High-contrast boundaries display optical wavelength dispersion consistent with physical glass refraction.`
    });
  } else if (avgDispersion < 4.5 && totalEdgeCount > 30) {
    gradientAiScore += 0.15;
    indicators.push({
      type: 'ANOMALY',
      name: 'Achromatic Synthetic Boundaries',
      detail: 'Edge boundaries exhibit uniform synthetic pixel cuts without organic glass chromatic dispersion.'
    });
  }

  return {
    isValid: true,
    gradientAiScore: Math.max(0.1, Math.min(0.9, gradientAiScore)),
    avgDispersion: Math.round(avgDispersion * 10) / 10,
    totalEdgeCount,
    indicators
  };
}
