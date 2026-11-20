# VERILENS – Digital Truth & Safety Assistant
> **AI Image Integrity, Synthetic Media Anomaly Detection & Media Provenance Suite**

VERILENS is a modern, cyber-forensic web application built to analyze images for markers of AI generation and synthetic manipulation. Designed for academic and cybersecurity project demonstrations, VERILENS combines client-side visual signal processing with an expandable API architecture.

---

## 🌟 Key Features

### 1. Multi-Spectral Image Forensics
- **Error Level Analysis (ELA) Simulation**: Visualizes JPEG re-compression divergence across 8×8 block discrete cosine transform quantization matrices.
- **High-Pass Sobel Edge Gradient**: Maps micro-contrast boundary transitions to detect unnatural edge sharpness or synthetic blurring.
- **Sensor Noise Floor Variance**: Isolates high-frequency noise residuals to differentiate organic CMOS/CCD camera sensor grain (Poisson-Gaussian shot noise) from clean algorithmic diffusion smoothing.
- **Forensic Zoom & Pan Inspector**: Examine micro-details at up to 250% magnification directly in the browser.

### 2. Forensic Verdict & Anomaly Breakdown
- **Dual Likelihood Metrics**: AI-Generated Likelihood vs. Authentic Capture Likelihood.
- **Classification Status**: *Likely AI-generated*, *Likely authentic*, or *Inconclusive*.
- **4-Pillar Evaluation**:
  - Sensor Grain & Noise
  - Micro-Texture Consistency
  - Optical & Light Coherence
  - Metadata & EXIF Provenance
- **Detailed Anomaly Reports**: Flags specific irregularities (e.g., specular highlight divergence, facial micro-smoothing, hardware tag stripping).

### 3. Session History & Report Generation
- **Session Audit Ledger**: Tracks previously checked images during the session with thumbnails, timestamps, and one-click re-inspection.
- **Forensic PDF Export**: Generates a professional, branded PDF certificate complete with file provenance, SHA-256 integrity hash, verdict badges, and anomaly explanations.
- **JSON Data Export**: Exports machine-readable forensic schemas.

### 4. Digital Truth Suite Companions
- **Fake News & Credibility Scanner**: Audits headlines and viral claims for clickbait polarity, emotional urgency manipulation, and sensational syntax, with direct one-click links to Google Fact Check and Reuters.
- **Privacy & Media Provenance Guide**: Educational guide detailing browser-local processing, GPS/EXIF metadata privacy, and the C2PA cryptographic content credential standard.
- **Interactive API Configuration**: Switch between *Demo Heuristic Mode* and *Custom Cloud API Mode* with sample FastAPI / PyTorch backend code.

---

## 🔬 Scientific & Ethical Transparency

VERILENS adheres to strict academic integrity standards:
- It **does not claim infallible black-box certainty**.
- The default **Demo Heuristic Engine** computes deterministic client-side metrics from the image canvas without sending media to external tracking databases.
- The modular service layer (`src/services/detectionService.js`) enables straightforward integration with production vision models (e.g., Sightengine, Hive Moderation, Hugging Face Deepfake detectors).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
# Clone or navigate to the project directory
cd "ai image checker"

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173/` in your browser.

### Production Build
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📂 Project Structure

```
ai image checker/
├── public/                 # Static assets & favicon
├── src/
│   ├── assets/             # Brand graphics & icons
│   ├── components/         # Modular React components
│   │   ├── AboutSection.jsx      # Project overview & tech specs
│   │   ├── AnalysisHistory.jsx   # Slide-out session history drawer
│   │   ├── AnalysisResult.jsx    # Dual-gauge results & anomaly breakdown
│   │   ├── ApiConfigModal.jsx    # Mode switch & backend code sample
│   │   ├── FakeNewsChecker.jsx   # Information credibility scanner
│   │   ├── Footer.jsx            # System telemetry & footer
│   │   ├── Hero.jsx              # Cyber hero banner
│   │   ├── ImagePreview.jsx      # Multi-spectrum canvas visualizer
│   │   ├── ImageUploader.jsx     # Drag-and-drop zone & sample selector
│   │   ├── Navbar.jsx            # Cyber navigation bar
│   │   ├── PrivacyGuide.jsx      # Metadata privacy & deepfake checklist
│   │   └── ScanningAnimation.jsx # Multi-stage laser radar HUD
│   ├── data/
│   │   └── sampleImages.js       # Pre-bundled benchmark test images
│   ├── services/
│   │   ├── detectionService.js   # Heuristic engine & API connector
│   │   └── reportGenerator.js    # jsPDF forensic audit exporter
│   ├── utils/
│   │   └── canvasFilters.js      # ELA, Sobel edge, & noise floor filters
│   ├── App.jsx             # Root application orchestrator
│   ├── index.css           # Cyberpunk/cybersecurity design system
│   └── main.jsx            # Application entrypoint
├── index.html              # HTML shell & font definitions
├── package.json            # Project dependencies & scripts
└── vite.config.js          # Vite build configuration
```

---

## 🛡️ License
Educational demonstration project for college coursework and cybersecurity presentations.
