/**
 * Container & EXIF Metadata Provenance Analysis
 * Inspects headers, XMP/IPTC/C2PA blocks, and EXIF tags for hardware cameras or AI generators.
 */
import exifParser from 'exif-parser';

export function analyzeMetadataProvenance(fileBuffer, mimeType, fileName) {
  const indicators = [];
  let metadataAiScore = 0.5;
  let hasCameraExif = false;
  let hasAiMetadata = false;
  let cameraDetails = null;
  let aiToolSignature = null;

  // Scan header + tail chunk (PNG text chunks / JPEG XMP / C2PA manifests)
  const headStr = fileBuffer.toString('latin1', 0, Math.min(fileBuffer.length, 98304));
  const tailStr =
    fileBuffer.length > 98304
      ? fileBuffer.toString('latin1', Math.max(0, fileBuffer.length - 32768))
      : '';
  const bufferString = headStr + '\n' + tailStr;

  const aiKeywords = [
    { pattern: /Steps:\s*\d+,\s*Sampler:/i, tool: 'Stable Diffusion / A1111' },
    { pattern: /"prompt":\s*\{.*"inputs":/i, tool: 'ComfyUI Workflow' },
    { pattern: /trainedAlgorithmicMedia/i, tool: 'IPTC Generative AI Marker' },
    { pattern: /Made with Google AI|Google DeepMind|Imagen|SynthID/i, tool: 'Google AI / Imagen' },
    { pattern: /ChatGPT|OpenAI|DALL[·-]?E|Truepic/i, tool: 'OpenAI / ChatGPT' },
    { pattern: /Midjourney/i, tool: 'Midjourney' },
    { pattern: /NovelAI/i, tool: 'NovelAI' },
    { pattern: /Flux(?:\.1|(?:\s*\[\w+\]))/i, tool: 'FLUX Diffusion' },
    { pattern: /Adobe Firefly/i, tool: 'Adobe Firefly' },
    { pattern: /c2pa|jumbf/i, tool: 'C2PA Content Credentials (Generative Check)' }
  ];

  for (const item of aiKeywords) {
    if (item.pattern.test(bufferString)) {
      // C2PA alone can exist on Sony/Leica cameras — require algorithmic/tool context unless explicit AI tool
      if (item.tool.startsWith('C2PA') && !/trainedAlgorithmicMedia|openai|chatgpt|midjourney|firefly|google|dall/i.test(bufferString)) {
        continue;
      }
      hasAiMetadata = true;
      aiToolSignature = item.tool;
      metadataAiScore = 0.98;
      indicators.push({
        type: 'DEFINITIVE_ANOMALY',
        name: `Embedded Synthetic Tool Signature: ${item.tool}`,
        detail: `Found generative provenance metadata inside the container (${item.tool}).`
      });
      break;
    }
  }

  if (!hasAiMetadata) {
    try {
      const parser = exifParser.create(fileBuffer);
      const result = parser.parse();
      const tags = result.tags || {};

      if (tags.Make && tags.Model) {
        hasCameraExif = true;
        cameraDetails = `${tags.Make} ${tags.Model}`.trim();
        metadataAiScore = 0.14;

        const extraDetails = [];
        if (tags.ISO) extraDetails.push(`ISO ${tags.ISO}`);
        if (tags.FNumber) extraDetails.push(`f/${tags.FNumber}`);
        if (tags.ExposureTime) extraDetails.push(`${Number(tags.ExposureTime).toFixed(4)}s`);
        if (tags.FocalLength) extraDetails.push(`${tags.FocalLength}mm`);

        indicators.push({
          type: 'AUTHENTIC',
          name: `Verified Hardware Camera EXIF: ${cameraDetails}`,
          detail: `Found optical sensor exposure parameters (${extraDetails.join(', ') || 'Make/Model present'}).`
        });
      } else if (tags.Software) {
        if (/photoshop|lightroom|gimp|snapseed|vsco/i.test(tags.Software)) {
          indicators.push({
            type: 'NEUTRAL',
            name: `Photo Editing Software Tag: ${tags.Software}`,
            detail: 'Image exported from photo editing software; hardware sensor EXIF may be omitted.'
          });
        }
      }
    } catch {
      // Container lacks parseable EXIF
    }

    if (!hasCameraExif) {
      indicators.push({
        type: 'NEUTRAL',
        name: 'Container Metadata Sanitized / Stripped',
        detail: 'No hardware camera manufacturer tags present (common in AI outputs and social media uploads).'
      });
    }
  }

  return {
    metadataAiScore,
    hasCameraExif,
    hasAiMetadata,
    cameraDetails,
    aiToolSignature,
    mimeType: mimeType || 'image/unknown',
    fileName: fileName || 'image',
    indicators
  };
}
