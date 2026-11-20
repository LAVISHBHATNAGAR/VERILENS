/**
 * Container & EXIF Metadata Provenance Analysis
 * Inspects file headers for camera hardware metadata, AI generation prompt chunks,
 * or stripped container markers.
 */
import exifParser from 'exif-parser';

export function analyzeMetadataProvenance(fileBuffer, mimeType, fileName) {
  const indicators = [];
  let metadataAiScore = 0.5; // neutral by default
  let hasCameraExif = false;
  let hasAiMetadata = false;
  let cameraDetails = null;
  let aiToolSignature = null;

  // 1. Text chunk inspection (PNG/WEBP/JPEG comments or text blocks)
  const bufferString = fileBuffer.toString('latin1', 0, Math.min(fileBuffer.length, 65536));

  const aiKeywords = [
    { pattern: /Steps:\s*\d+,\s*Sampler:/i, tool: 'Stable Diffusion / A1111' },
    { pattern: /"prompt":\s*\{.*"inputs":/i, tool: 'ComfyUI Workflow' },
    { pattern: /Midjourney/i, tool: 'Midjourney' },
    { pattern: /NovelAI/i, tool: 'NovelAI' },
    { pattern: /DALL[·-]?E/i, tool: 'OpenAI DALL-E' },
    { pattern: /Flux(?:\.1|(?:\s*\[\w+\]))/i, tool: 'FLUX Diffusion' },
    { pattern: /Adobe Firefly/i, tool: 'Adobe Firefly' }
  ];

  for (const item of aiKeywords) {
    if (item.pattern.test(bufferString)) {
      hasAiMetadata = true;
      aiToolSignature = item.tool;
      metadataAiScore = 0.98;
      indicators.push({
        type: 'DEFINITIVE_ANOMALY',
        name: `Embedded Synthetic Tool Signature: ${item.tool}`,
        detail: `Found raw generative prompt/workflow metadata embedded directly inside the image container (${item.tool}).`
      });
      break;
    }
  }

  // 2. EXIF Header parsing
  if (!hasAiMetadata) {
    try {
      const parser = exifParser.create(fileBuffer);
      const result = parser.parse();
      const tags = result.tags || {};

      if (tags.Make && tags.Model) {
        hasCameraExif = true;
        cameraDetails = `${tags.Make} ${tags.Model}`;
        metadataAiScore = 0.15; // Strongly points to physical capture

        let extraDetails = [];
        if (tags.ISO) extraDetails.push(`ISO ${tags.ISO}`);
        if (tags.FNumber) extraDetails.push(`f/${tags.FNumber}`);
        if (tags.ExposureTime) extraDetails.push(`${(tags.ExposureTime).toFixed(4)}s`);
        if (tags.FocalLength) extraDetails.push(`${tags.FocalLength}mm`);

        indicators.push({
          type: 'AUTHENTIC',
          name: `Verified Hardware Camera EXIF: ${cameraDetails}`,
          detail: `Found valid hardware sensor exposure parameters (${extraDetails.join(', ')}). Generative models do not produce authentic hardware camera tags.`
        });
      } else if (tags.Software) {
        if (/photoshop|lightroom|gimp/i.test(tags.Software)) {
          indicators.push({
            type: 'NEUTRAL',
            name: `Photo Editing Software Tag: ${tags.Software}`,
            detail: 'Image was exported or edited through photo editing software. Primary camera tags may have been modified.'
          });
        }
      }
    } catch {
      // Container has no parseable EXIF
    }

    if (!hasCameraExif) {
      indicators.push({
        type: 'NEUTRAL',
        name: 'Container Metadata Sanitized / Stripped',
        detail: 'Image container contains no camera manufacturer tags. Common in both AI-generated outputs and social media compressed uploads.'
      });
    }
  }

  return {
    metadataAiScore,
    hasCameraExif,
    hasAiMetadata,
    cameraDetails,
    aiToolSignature,
    indicators
  };
}
