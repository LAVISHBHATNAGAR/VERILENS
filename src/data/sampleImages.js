// Pre-bundled raster reference specimens for multi-signal forensic verification
// Real high-resolution optical digicam captures & synthetic diffusion lattice specimens

export const SAMPLE_IMAGES = [
  {
    id: 'sample-ai-portrait',
    name: 'Sample_AI_Synthetic_Portrait.png',
    type: 'image/png',
    size: 407282,
    dimensions: { width: 800, height: 800 },
    category: 'ai',
    title: 'AI Photorealistic Portrait',
    description: 'Smooth latent diffusion portrait gradient lacking CMOS silicon shot noise, with periodic high-frequency harmonics.',
    expectedScore: 77,
    expectedVerdict: 'Likely AI-generated',
    dataUrl: '/specimens/ai-portrait-specimen.png'
  },
  {
    id: 'sample-real-nature',
    name: 'Sample_Optical_Architecture.jpg',
    type: 'image/jpeg',
    size: 500887,
    dimensions: { width: 1200, height: 896 },
    category: 'real',
    title: 'Authentic Architectural Capture',
    description: 'Physical camera lens study exhibiting organic CMOS sensor shot noise floor, optical dispersion, and natural 1/f spectral decay.',
    expectedScore: 28,
    expectedVerdict: 'Likely authentic',
    dataUrl: '/images/digicam-architecture.jpg'
  },
  {
    id: 'sample-ai-landscape',
    name: 'Sample_AI_Cyberpunk_City.png',
    type: 'image/png',
    size: 942318,
    dimensions: { width: 960, height: 540 },
    category: 'ai',
    title: 'AI Cyberpunk Cityscape',
    description: 'Generative volumetric scene containing periodic upsampling lattice peaks and zero high-frequency photodiode noise.',
    expectedScore: 77,
    expectedVerdict: 'Likely AI-generated',
    dataUrl: '/specimens/ai-cyberpunk-specimen.png'
  },
  {
    id: 'sample-street-photo',
    name: 'Sample_Real_Street_Documentary.jpg',
    type: 'image/jpeg',
    size: 631508,
    dimensions: { width: 1200, height: 896 },
    category: 'real',
    title: 'Authentic Street Documentary',
    description: 'Nighttime digicam exposure retaining genuine Poisson-Gaussian sensor grain, high LSB entropy, and natural lens falloff.',
    expectedScore: 28,
    expectedVerdict: 'Likely authentic',
    dataUrl: '/images/digicam-street.jpg'
  }
];
