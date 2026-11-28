import React, { useState } from 'react';
import {
  ShieldCheck,
  Code,
  GraduationCap,
  Cpu,
  Layers,
  Database,
  ArrowRight
} from 'lucide-react';

const PIPELINE_STAGES = [
  {
    id: 'ingest',
    step: '01',
    title: 'Ephemeral RAM Ingest',
    badge: 'Multer + SHA-256',
    detail:
      'Uploaded files (JPG/PNG/WEBP <= 15MB) enter Multer memoryStorage—never written to disk—and generate a SHA-256 integrity digest for duplicate cache lookup.'
  },
  {
    id: 'decode',
    step: '02',
    title: 'Sharp Pixel Normalization',
    badge: 'Max 1024px Lanczos3',
    detail:
      'Sharp decodes container headers and extracts dual raw buffers: 8-bit grayscale luminance for FFT/PRNU math and 24-bit RGB channels for chromatic dispersion.'
  },
  {
    id: 'analyzers',
    step: '03',
    title: 'Parallel Multi-Signal Analyzers',
    badge: '6 Concurrent Modules',
    detail:
      'Runs 2D Radix-2 FFT spectral falloff, PRNU CMOS Laplacian shot noise & JPEG blockiness, optical edge dispersion, EXIF/prompt scanning, visual scene physics, and optional ViT/Gemini inference.'
  },
  {
    id: 'fusion',
    step: '04',
    title: 'Calibrated 3-Outcome Fusion',
    badge: 'Uncertainty Engine',
    detail:
      'Weighs active signals, detects domain disparity conflicts, penalizes heavy JPEG quantization or screenshots, and strictly preserves ambiguous media as Inconclusive.'
  },
  {
    id: 'dossier',
    step: '05',
    title: 'Forensic Dossier & PDF Export',
    badge: 'Radar + Spectral + jsPDF',
    detail:
      'Renders interactive 5-axis radar charts, radial 1/f decay plots, SHA-256 digests, and client-side forensic PDF / JSON audit reports.'
  }
];

export default function AboutSection() {
  const [activeStage, setActiveStage] = useState(PIPELINE_STAGES[2]);

  const stackItems = [
    { label: 'Frontend Core', val: 'React 19 + Vite 6 + Tailwind CSS v4 + shadcn/ui' },
    { label: 'Motion & Visuals', val: 'WebGL Chromatic Shader + GSAP + Motion Spring UI' },
    { label: 'Backend Engine', val: 'Node.js Express 5 + Multer Memory + Sharp' },
    { label: 'Spectral Domain', val: '2D Radix-2 Fourier Transform (FFT) Power Falloff' },
    { label: 'Sensor Physics', val: 'Laplacian Residual & PRNU CMOS Noise Floor' },
    { label: 'Neural Inference', val: 'Optional ViT (Hugging Face), Gemini Vision, Sightengine, Hive' },
    { label: 'Optical Dispersion', val: 'Edge RGB Chromatic Fringing & EXIF/Prompt Audit' },
    { label: 'Forensic Export', val: 'Client-side jsPDF Dossier & Web Crypto SHA-256' }
  ];

  return (
    <div id="about-section" className="max-w-5xl mx-auto pb-12 space-y-6">
      {/* Header */}
      <div className="text-center">
        <span className="mono-badge mono-badge-blue mb-4">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>PROJECT SPECIFICATION &amp; ARCHITECTURE</span>
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] mb-2.5">
          About VERILENS v2.0.0
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl mx-auto">
          An optical media forensics and digital truth platform combining physical camera sensor modeling,
          Fourier spectrum analysis, and calibrated uncertainty classification.
        </p>
      </div>

      {/* Mission & Scientific Ethics */}
      <div className="glass-panel p-6 sm:p-8 rounded-[26px]">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[var(--blue-light)]" />
          <span>Mission &amp; Scientific Uncertainty Protocol</span>
        </h3>
        <p className="text-sm sm:text-[0.95rem] text-[var(--text-secondary)] leading-relaxed mb-3">
          Modern diffusion architectures (Midjourney, DALL-E, Stable Diffusion, FLUX) produce increasingly photorealistic imagery.
          VERILENS pairs frequency-domain harmonics, CMOS sensor shot-noise variance, optical dispersion, and metadata provenance with optional pretrained vision models.
        </p>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          Rather than forcing binary certainty on compressed, cropped, or screenshot media, VERILENS enforces a strict 3-outcome decision gate:
          <strong className="text-[var(--text-primary)]"> Likely AI-generated</strong>,{' '}
          <strong className="text-[var(--text-primary)]"> Likely authentic</strong>, or{' '}
          <strong className="text-[var(--text-primary)]"> Inconclusive</strong>.
        </p>
      </div>

      {/* Interactive End-to-End Forensic Pipeline Diagram */}
      <div className="glass-panel p-6 sm:p-8 rounded-[26px]">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-[var(--blue-light)]" />
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              Interactive Forensic Execution Pipeline
            </h3>
          </div>
          <span className="font-mono text-[11px] text-[var(--text-muted)]">
            Select a stage to inspect data flow
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 mb-5">
          {PIPELINE_STAGES.map((stage, idx) => {
            const isSelected = activeStage.id === stage.id;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStage(stage)}
                className={`rounded-2xl p-3.5 text-left border transition-all relative ${
                  isSelected
                    ? 'bg-[var(--badge-blue-bg)] border-[var(--blue)] shadow-[var(--shadow-sm)]'
                    : 'bg-[var(--sub-block-bg)] border-[var(--border-hairline)] hover:border-[var(--border-specular)]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[11px] font-bold text-[var(--blue-light)]">
                    STAGE {stage.step}
                  </span>
                  {idx < PIPELINE_STAGES.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] hidden lg:block" />
                  )}
                </div>
                <div className="text-xs font-bold text-[var(--text-primary)] leading-snug">
                  {stage.title}
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 font-bold text-base text-[var(--text-primary)]">
              <Cpu className="w-4 h-4 text-[var(--cyan-accent)]" />
              <span>
                Stage {activeStage.step}: {activeStage.title}
              </span>
            </div>
            <span className="mono-badge mono-badge-blue text-[11px]">
              {activeStage.badge}
            </span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {activeStage.detail}
          </p>
        </div>
      </div>

      {/* System Tech Stack Grid */}
      <div className="glass-panel p-6 sm:p-8 rounded-[26px]">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-5 flex items-center gap-2.5">
          <Code className="w-5 h-5 text-[var(--blue-light)]" />
          <span>System Architecture &amp; Tech Stack</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stackItems.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] p-4"
            >
              <div className="font-mono text-[11px] font-medium text-[var(--blue-light)] mb-1">
                {item.label}
              </div>
              <div className="text-sm font-medium text-[var(--text-primary)] leading-snug">
                {item.val}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Capstone Attribution */}
      <div className="rounded-2xl bg-[var(--badge-blue-bg)] border border-[var(--border-specular)] p-5 text-center">
        <div className="flex items-center justify-center gap-2 font-bold text-sm text-[var(--text-primary)]">
          <Database className="w-4 h-4 text-[var(--badge-blue-text)]" />
          <span>VERILENS v2.0.0 — Digital Truth &amp; Safety Assistant</span>
        </div>
        <div className="text-xs text-[var(--text-muted)] mt-1">
          Cybersecurity &amp; Computer Science Media Forensics Platform
        </div>
      </div>
    </div>
  );
}
