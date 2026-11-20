// Pre-bundled reference test cases for immediate demonstration
// High-fidelity SVG data URIs that simulate real visual test subjects

export const SAMPLE_IMAGES = [
  {
    id: 'sample-ai-portrait',
    name: 'Sample_AI_Synthetic_Portrait.png',
    type: 'image/png',
    size: 1420500, // ~1.35 MB
    dimensions: { width: 1024, height: 1024 },
    category: 'ai',
    title: 'AI Photorealistic Portrait',
    description: 'High-detail synthetic portrait with subtle diffusion smoothing and iris micro-reflections.',
    expectedScore: 89,
    expectedVerdict: 'Likely AI-generated',
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <defs>
          <radialGradient id="bgGrad" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stop-color="#1e1b4b"/>
            <stop offset="60%" stop-color="#090d16"/>
            <stop offset="100%" stop-color="#020408"/>
          </radialGradient>
          <radialGradient id="skinGrad" cx="45%" cy="35%" r="60%">
            <stop offset="0%" stop-color="#ffd5b8"/>
            <stop offset="45%" stop-color="#e2a786"/>
            <stop offset="85%" stop-color="#a86d52"/>
            <stop offset="100%" stop-color="#643b27"/>
          </radialGradient>
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#3b1f13"/>
            <stop offset="50%" stop-color="#804124"/>
            <stop offset="100%" stop-color="#1a0d07"/>
          </linearGradient>
          <filter id="synthSmooth">
            <feGaussianBlur stdDeviation="1.5" result="blur"/>
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" />
          </filter>
        </defs>
        <rect width="800" height="800" fill="url(#bgGrad)"/>
        
        <!-- Synthetic Hair Backing -->
        <path d="M 220 280 C 180 120, 620 120, 580 280 C 650 480, 620 680, 580 750 C 400 770, 400 770, 220 750 C 180 680, 150 480, 220 280 Z" fill="url(#hairGrad)" opacity="0.95"/>
        
        <!-- Face Oval with hyper-smooth gradient -->
        <ellipse cx="400" cy="400" rx="190" ry="240" fill="url(#skinGrad)"/>
        
        <!-- Eyes with subtle synthetic asymmetry -->
        <g transform="translate(0, -20)">
          <!-- Left Eye -->
          <ellipse cx="320" cy="380" rx="42" ry="24" fill="#ffffff" stroke="#4a2e22" stroke-width="2"/>
          <circle cx="320" cy="380" r="19" fill="#0284c7"/>
          <circle cx="320" cy="380" r="9" fill="#090d16"/>
          <circle cx="314" cy="374" r="5" fill="#ffffff"/>
          <circle cx="328" cy="385" r="2.5" fill="#ffffff" opacity="0.8"/>
          
          <!-- Right Eye (Slight unnatural dilation & highlight angle) -->
          <ellipse cx="480" cy="378" rx="43" ry="25" fill="#ffffff" stroke="#4a2e22" stroke-width="2"/>
          <circle cx="480" cy="378" r="21" fill="#0369a1"/>
          <circle cx="480" cy="378" r="11" fill="#090d16"/>
          <!-- Conflicting highlight position (AI anomaly marker) -->
          <circle cx="488" cy="372" r="5" fill="#ffffff"/>
          
          <!-- Eyebrows with blended fibers -->
          <path d="M 270 335 Q 320 315 370 335" stroke="#3b1f13" stroke-width="14" stroke-linecap="round" fill="none" opacity="0.85"/>
          <path d="M 430 335 Q 480 310 530 330" stroke="#3b1f13" stroke-width="14" stroke-linecap="round" fill="none" opacity="0.85"/>
        </g>
        
        <!-- Nose Bridge -->
        <path d="M 400 370 L 396 460 Q 400 480 415 470 Q 385 470 380 460" stroke="#a86d52" stroke-width="3" fill="none" stroke-linecap="round"/>
        
        <!-- Lips with characteristic diffusion gloss -->
        <path d="M 340 540 Q 400 525 460 540 Q 400 575 340 540 Z" fill="#cf5b67"/>
        <path d="M 350 540 Q 400 548 450 540 Q 400 600 350 540 Z" fill="#b94350"/>
        
        <!-- Cyber AI Indicator Watermark in corner -->
        <rect x="20" y="20" width="160" height="34" rx="6" fill="#1e1b4b" fill-opacity="0.7" stroke="#6366f1" stroke-width="1"/>
        <text x="32" y="42" fill="#c7d2fe" font-family="monospace" font-size="12" font-weight="bold">SYNTHETIC_FACE_01</text>
      </svg>
    `)}`
  },
  {
    id: 'sample-real-nature',
    name: 'Sample_DSLR_Eagle_Wildlife.jpg',
    type: 'image/jpeg',
    size: 2840200, // ~2.7 MB
    dimensions: { width: 1920, height: 1280 },
    category: 'real',
    title: 'Authentic DSLR Wildlife Photo',
    description: 'Captured on physical camera sensor. Shows natural optical grain, true optical bokeh, and consistent sensor noise.',
    expectedScore: 9,
    expectedVerdict: 'Likely authentic',
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600">
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#1e3a8a"/>
            <stop offset="50%" stop-color="#3b82f6"/>
            <stop offset="100%" stop-color="#93c5fd"/>
          </linearGradient>
          <filter id="sensorGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise"/>
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.12 0" />
            <feComposite in2="SourceGraphic" in="glitch" operator="in"/>
          </filter>
        </defs>
        <rect width="900" height="600" fill="url(#skyGrad)"/>
        
        <!-- Out-of-focus background forest/mountain (True optical bokeh) -->
        <path d="M 0 450 Q 250 320 500 420 T 900 380 L 900 600 L 0 600 Z" fill="#14532d" opacity="0.65"/>
        <path d="M 0 490 Q 300 400 650 510 T 900 460 L 900 600 L 0 600 Z" fill="#064e3b" opacity="0.85"/>
        
        <!-- Eagle Perched on Wooden Branch -->
        <path d="M 120 600 C 350 480, 550 490, 850 440 L 850 520 C 550 560, 350 540, 120 600 Z" fill="#382110"/>
        
        <!-- Eagle Body with individual plumage edges -->
        <path d="M 480 260 C 440 290 410 380 430 480 C 470 510 540 500 580 450 C 600 360 570 280 520 250 Z" fill="#2d221e"/>
        <!-- White Head -->
        <path d="M 480 260 C 470 210 520 180 560 200 C 590 220 580 270 550 280 Z" fill="#f8fafc"/>
        <!-- Golden Beak -->
        <polygon points="560,225 615,245 570,255" fill="#f59e0b"/>
        <!-- Eye -->
        <circle cx="535" cy="225" r="7" fill="#fbbf24"/>
        <circle cx="536" cy="225" r="3.5" fill="#0f172a"/>
        <circle cx="534" cy="223" r="1.2" fill="#ffffff"/>
        
        <!-- Camera EXIF Stamp Overlay -->
        <rect x="25" y="25" width="220" height="42" rx="6" fill="#0f172a" fill-opacity="0.75" stroke="#38bdf8" stroke-width="1"/>
        <text x="38" y="44" fill="#38bdf8" font-family="monospace" font-size="11" font-weight="bold">SONY ILCE-7RM4 • 600mm</text>
        <text x="38" y="58" fill="#94a3b8" font-family="monospace" font-size="9">ISO 400 • 1/1250s • f/4.0</text>
      </svg>
    `)}`
  },
  {
    id: 'sample-ai-landscape',
    name: 'Sample_AI_Cyberpunk_City.webp',
    type: 'image/webp',
    size: 1980000,
    dimensions: { width: 1280, height: 720 },
    category: 'ai',
    title: 'AI Cyberpunk Cityscape',
    description: 'Generative cityscape with nonsensical neon typography, perspective convergence warping, and repeating texture grids.',
    expectedScore: 92,
    expectedVerdict: 'Likely AI-generated',
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" width="960" height="540">
        <defs>
          <linearGradient id="neonSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#050510"/>
            <stop offset="60%" stop-color="#2a0845"/>
            <stop offset="100%" stop-color="#640064"/>
          </linearGradient>
          <linearGradient id="cyanNeon" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#00f0ff"/>
            <stop offset="100%" stop-color="#ff007f"/>
          </linearGradient>
        </defs>
        <rect width="960" height="540" fill="url(#neonSky)"/>
        
        <!-- Distant Skyscrapers with warped windows -->
        <rect x="80" y="160" width="90" height="380" fill="#0b0f19" stroke="#00f0ff" stroke-width="1" stroke-opacity="0.3"/>
        <rect x="200" y="100" width="120" height="440" fill="#0d1322" stroke="#a855f7" stroke-width="1" stroke-opacity="0.4"/>
        <rect x="350" y="200" width="80" height="340" fill="#080c14"/>
        <rect x="460" y="80" width="140" height="460" fill="#111827" stroke="#ff007f" stroke-width="1" stroke-opacity="0.5"/>
        <rect x="630" y="150" width="100" height="390" fill="#0c121e"/>
        <rect x="760" y="120" width="130" height="420" fill="#090d16" stroke="#00f0ff" stroke-width="1" stroke-opacity="0.3"/>
        
        <!-- AI Diffusion Glitched Neon Signs (Gibberish text characteristic of generative art) -->
        <text x="215" y="180" fill="#00f0ff" font-family="sans-serif" font-size="22" font-weight="900" filter="drop-shadow(0 0 8px #00f0ff)">§⍾⌬⎔</text>
        <text x="480" y="170" fill="#ff007f" font-family="sans-serif" font-size="28" font-weight="900" filter="drop-shadow(0 0 10px #ff007f)">Ǝ⅃⅄TIꟼ</text>
        <text x="780" y="210" fill="#a855f7" font-family="sans-serif" font-size="20" font-weight="900" filter="drop-shadow(0 0 6px #a855f7)">▲■◈◇</text>
        
        <!-- Wet reflective pavement with unnatural mirror distortion -->
        <rect x="0" y="420" width="960" height="120" fill="#04060b" opacity="0.95"/>
        <line x1="0" y1="420" x2="960" y2="420" stroke="#00f0ff" stroke-width="2" opacity="0.6"/>
        <path d="M 0 450 Q 480 430 960 450" stroke="#ff007f" stroke-width="2" opacity="0.4"/>
        
        <!-- Label -->
        <rect x="20" y="20" width="180" height="34" rx="6" fill="#0f172a" fill-opacity="0.75" stroke="#a855f7" stroke-width="1"/>
        <text x="32" y="42" fill="#c084fc" font-family="monospace" font-size="12" font-weight="bold">AI_DIFFUSION_CITY</text>
      </svg>
    `)}`
  },
  {
    id: 'sample-street-photo',
    name: 'Sample_Real_Street_Documentary.jpg',
    type: 'image/jpeg',
    size: 2150000,
    dimensions: { width: 1600, height: 1067 },
    category: 'real',
    title: 'Authentic Street Documentary',
    description: 'Real documentary photography with natural ambient lighting, optical lens fringing, and authentic environmental clutter.',
    expectedScore: 14,
    expectedVerdict: 'Likely authentic',
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 533" width="800" height="533">
        <defs>
          <linearGradient id="streetWall" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#475569"/>
            <stop offset="60%" stop-color="#334155"/>
            <stop offset="100%" stop-color="#1e293b"/>
          </linearGradient>
        </defs>
        <rect width="800" height="533" fill="#0f172a"/>
        
        <!-- Brick texture wall with real perspective lines -->
        <polygon points="0,40 500,120 500,480 0,533" fill="url(#streetWall)"/>
        <!-- Ground pavement -->
        <polygon points="0,533 500,480 800,533" fill="#0f172a"/>
        <polygon points="500,120 800,40 800,533 500,480" fill="#1e293b"/>
        
        <!-- Cafe Window with natural reflections -->
        <polygon points="80,180 380,220 380,390 80,380" fill="#0284c7" fill-opacity="0.2" stroke="#64748b" stroke-width="3"/>
        <line x1="230" y1="200" x2="230" y2="385" stroke="#64748b" stroke-width="3"/>
        
        <!-- Pedestrian silhouette with natural motion blur -->
        <path d="M 580 320 Q 595 280 590 250 Q 605 240 610 255 Q 615 290 625 330 L 635 460 L 610 460 L 600 380 L 590 460 L 570 460 Z" fill="#0f172a" opacity="0.9"/>
        <circle cx="597" cy="235" r="14" fill="#0f172a"/>
        
        <!-- Authenticity label -->
        <rect x="20" y="20" width="200" height="34" rx="6" fill="#0f172a" fill-opacity="0.8" stroke="#10b981" stroke-width="1"/>
        <text x="32" y="42" fill="#34d399" font-family="monospace" font-size="11" font-weight="bold">LEICA M10 • 35mm f/2</text>
      </svg>
    `)}`
  }
];
