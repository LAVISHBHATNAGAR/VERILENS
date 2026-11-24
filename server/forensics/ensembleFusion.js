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

    if (deepLearning.aiProbability >= 0.60) {
      anomalies.push(...deepLearning.indicators);
    } else if (deepLearning.aiProbability <= 0.40) {
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

  // Verified Camera Hardware EXIF adjustment: strongly supports physical camera capture
  if (metadata.hasCameraExif) {
    weightedScoreSum *= 0.55;
    metadata.indicators.forEach(ind => authenticSignals.push(ind));
  } else {
    metadata.indicators.forEach(ind => {
      if (ind.type === 'NEUTRAL') limitations.push(ind.detail);
    });
  }

  const isHeavyJpeg = Boolean(noise.isHeavyJpeg);
  if (isHeavyJpeg) {
    limitations.push('High JPEG quantization suppresses fine sensor noise, introducing uncertainty into surface smoothness analysis.');
  }

  // When organic CMOS shot noise is present (noise score <= 0.32) and no periodic anomalies exist
  if (noise.isValid && noise.noiseAiScore <= 0.32 && (!fourier.isValid || fourier.avgPeriodicSpikes < 1.2)) {
    weightedScoreSum = Math.min(weightedScoreSum, totalWeight * 0.28);
  }

  // When synthetic noise deficit or periodic lattice spikes are decisively detected without camera hardware
  if (!metadata.hasCameraExif && !isHeavyJpeg) {
    if (noise.isValid && noise.noiseAiScore >= 0.82 && fourier.isValid && fourier.avgPeriodicSpikes >= 1.5) {
      weightedScoreSum = Math.max(weightedScoreSum, totalWeight * 0.72);
    } else if (noise.isValid && noise.noiseAiScore >= 0.84 && (!fourier.isValid || fourier.spectralAiScore >= 0.35)) {
      weightedScoreSum = Math.max(weightedScoreSum, totalWeight * 0.65);
    }
  }

  // Raw fused probability
  let rawProb = totalWeight > 0 ? weightedScoreSum / totalWeight : 0.5;

  // Signal Disparity / Conflict Index
  let hasTrueConflict = false;
  let signalDisparity = 0;
  if (activeScores.length >= 2) {
    const scores = activeScores.map(s => s.score);
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    signalDisparity = maxScore - minScore;
    if (minScore <= 0.28 && maxScore >= 0.72) {
      hasTrueConflict = true;
    }
  }

  // Resolution & Compression penalty to confidence
  const isLowResolution = imageMeta.width < 250 || imageMeta.height < 250;
  if (isLowResolution) {
    limitations.push('Low image resolution degrades fine-grained sensor grain and optical edge detection reliability.');
  }

  // Count distinct anomalous and authentic indicators
  const anomalyCount = anomalies.filter(a => a.type === 'ANOMALY' || a.type === 'DEFINITIVE_ANOMALY').length;
  const authenticCount = authenticSignals.filter(a => a.type === 'AUTHENTIC').length;

  // 3. DECISION & UNCERTAINTY SYSTEM EVALUATION (Strictly Three Calibrated Outcomes)
  let verdict = 'Inconclusive';
  let verdictLevel = 'inconclusive';
  let calibratedConfidence = 0;
  let confidenceLevel = 'Low / Uncertain';
  let summary = '';

  if (isHeavyJpeg && !metadata.hasCameraExif && rawProb >= 0.45 && rawProb <= 0.75) {
    // Heavy JPEG compression artificially suppresses noise floor; prevent false positives
    verdict = 'Inconclusive';
    verdictLevel = 'inconclusive';
    calibratedConfidence = 35;
    confidenceLevel = 'Low / Uncertain';
    summary = `Image exhibits prominent 8x8 discrete cosine transform compression artifacts (JPEG blockiness index: ${noise.jpegBlockiness || 'high'}). Quantization obscures high-frequency CMOS sensor noise, preventing a definitive determination.`;
  } else if (isLowResolution && !metadata.hasCameraExif) {
    verdict = 'Inconclusive';
    verdictLevel = 'inconclusive';
    calibratedConfidence = 30;
    confidenceLevel = 'Low / Uncertain';
    summary = `Image resolution (${imageMeta.width}×${imageMeta.height}) is too limited to extract unambiguous micro-texture or CMOS sensor noise signatures.`;
  } else if (hasTrueConflict) {
    verdict = 'Inconclusive';
    verdictLevel = 'inconclusive';
    calibratedConfidence = 35;
    confidenceLevel = 'Low / Uncertain';
    summary = `The analysis produced conflicting signals across forensic domains (Signal discrepancy: ${(signalDisparity * 100).toFixed(0)}%). Spatial frequency harmonics and noise floor characteristics directly contradict each other. Evidence is insufficient for a reliable determination.`;
  } else if (
    // Strong AI classification conditions:
    // 1. Deep learning ViT classifier is available and indicates AI (>= 0.62)
    (deepLearning.isAvailable && deepLearning.aiProbability >= 0.62 && rawProb >= 0.55) ||
    // 2. Definitive prompt metadata (e.g. A1111/ComfyUI/Midjourney)
    metadata.hasAiMetadata ||
    // 3. Without deep learning: high rawProb (>= 0.64) with corroborating anomaly, or clear lattice peaks
    (!deepLearning.isAvailable && !metadata.hasCameraExif && !isHeavyJpeg && (
      (rawProb >= 0.64 && anomalyCount >= 1) ||
      (noise.isValid && noise.noiseAiScore >= 0.82 && fourier.isValid && fourier.spectralAiScore >= 0.35) ||
      (fourier.isValid && fourier.avgPeriodicSpikes >= 2.0)
    ))
  ) {
    verdict = 'Likely AI-generated';
    verdictLevel = 'ai';
    calibratedConfidence = Math.round(Math.min(94, 64 + (rawProb - 0.55) * 75));
    confidenceLevel = calibratedConfidence >= 80 ? 'High' : 'Moderate';
    
    const topAnomalies = anomalies.filter(a => a.type === 'ANOMALY' || a.type === 'DEFINITIVE_ANOMALY');
    if (topAnomalies.length > 0) {
      summary = `Multiple forensic indicators corroborate synthetic image synthesis. Observed markers include ${topAnomalies.map(a => a.name).slice(0, 2).join(' and ')}.`;
    } else {
      summary = `Synthetic visual patterns detected. Image exhibits characteristic latent diffusion smoothness and lack of organic CMOS sensor grain.`;
    }
  } else if (
    // Authentic camera classification conditions:
    // 1. Hardware camera EXIF is confirmed
    metadata.hasCameraExif ||
    // 2. Deep learning ViT classifier is available and indicates Real (<= 0.35)
    (deepLearning.isAvailable && deepLearning.aiProbability <= 0.35 && rawProb <= 0.45) ||
    // 3. OR rawProb is low (<= 0.38) and authentic optical/noise signals are present (with natural grain)
    (rawProb <= 0.38 && (authenticCount >= 1 || (!isHeavyJpeg && noise.noiseAiScore <= 0.35)) && noise.zeroNoiseRatio < 0.60)
  ) {
    verdict = 'Likely authentic';
    verdictLevel = 'real';
    calibratedConfidence = Math.round(Math.min(94, 62 + (0.38 - rawProb) * 75));
    confidenceLevel = calibratedConfidence >= 80 ? 'High' : 'Moderate';

    const topAuthentic = authenticSignals.filter(a => a.type === 'AUTHENTIC');
    if (topAuthentic.length > 0) {
      summary = `Visual signals and noise floor characteristics are consistent with genuine optical camera capture. Preserved indicators include ${topAuthentic.map(a => a.name).slice(0, 2).join(' and ')}.`;
    } else {
      summary = `Optical camera signatures detected. Organic Poisson-Gaussian sensor noise floor aligns with physical digital camera sensors.`;
    }
  } else {
    // Indeterminate / Inconclusive middle band (e.g. rawProb between 0.39 and 0.67 without definitive signals)
    verdict = 'Inconclusive';
    verdictLevel = 'inconclusive';
    calibratedConfidence = 40;
    confidenceLevel = 'Low / Uncertain';
    summary = `The forensic metrics fall into an indeterminate middle band (${(rawProb * 100).toFixed(0)}%). Visual patterns do not provide conclusive proof of either authentic photographic capture or synthetic generative diffusion. Context and source provenance should be consulted.`;
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
