import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { motion } from 'motion/react';
import {
  Eye,
  Cpu,
  Lock,
  ArrowRight,
  Sliders,
  ChevronRight,
  Activity
} from 'lucide-react';
import Velaris from '@/components/ui/velaris';
import HeroSplitComparator from './HeroSplitComparator';

gsap.registerPlugin(useGSAP);

const VELARIS_DARK = ['#ff2e2e', '#ff5e78', '#1a233b', '#0d0e12'];
const VELARIS_LIGHT = ['#ffafbd', '#e61919', '#24335c', '#fcfcfc'];

const FFT_BANDS = [
  { label: '0.1f', realPct: 92, aiPct: 94, delta: '-0.12 dB', note: 'Global luminance DC baseline' },
  { label: '0.3f', realPct: 78, aiPct: 74, delta: '-0.48 dB', note: 'Macro structural edge energy' },
  { label: '0.5f', realPct: 62, aiPct: 48, delta: '-1.35 dB', note: 'Natural surface texture falloff' },
  { label: '0.7f', realPct: 49, aiPct: 86, delta: '+2.42 dB', note: 'Diffusion transposed-conv harmonic spike' },
  { label: '0.9f', realPct: 38, aiPct: 21, delta: '-1.82 dB', note: 'CMOS Poisson shot-noise tail vs smoothed AI' }
];

const CALIBRATION_GATES = [
  {
    id: 'real',
    range: 'P(AI) 0–35%',
    verdict: 'Likely Authentic',
    tone: 'text-[#93b0f5] border-[#30447a] bg-[#1a233b]/55',
    detail: 'Consistent CMOS shot-noise floor across smooth patches + natural 1/f spectral slope and valid optical lens dispersion.'
  },
  {
    id: 'uncertain',
    range: 'P(AI) 36–64%',
    verdict: 'Inconclusive',
    tone: 'text-[#e0ac82] border-[#e0ac82]/40 bg-[#e0ac82]/10',
    detail: 'Triggered on heavy JPEG 8x8 blockiness, WhatsApp/X recompression, desktop UI screenshots, or conflicting domain disparity.'
  },
  {
    id: 'ai',
    range: 'P(AI) 65–100%',
    verdict: 'Likely AI-Generated',
    tone: 'text-[#ff5e78] border-[#ff2e2e]/45 bg-[#ff2e2e]/12',
    detail: 'Periodic neural upsampling spikes in 2D FFT spectrum coupled with zero-noise bilateral dermal/sky smoothing or prompt EXIF.'
  }
];

const RAM_STEPS = [
  { code: '01', name: 'Multer RAM Buffer', stat: '0 KB disk write', desc: 'Upload streams strictly into ephemeral V8/Node memory buffers.' },
  { code: '02', name: 'Sharp Normalization', stat: '1024px Lanczos3', desc: 'Extracts raw 8-bit grayscale + 24-bit RGB arrays in memory.' },
  { code: '03', name: 'SHA-256 Digest', stat: 'Deterministic', desc: 'Hashes binary payload for instant audit verification without storing pixels.' },
  { code: '04', name: 'Buffer Purge', stat: 'GC Immediate', desc: 'Raw pixel buffers dereference immediately once telemetry JSON returns.' }
];

const TELEMETRY_MODULES = [
  {
    id: 'fft',
    code: 'SIGNAL 01',
    icon: Eye,
    title: '2D FFT & PRNU Sensor Physics',
    summary: 'Click frequency bands to inspect spectral harmonic spikes vs. organic camera 1/f decay.'
  },
  {
    id: 'calibration',
    code: 'CAL-3 GATE',
    icon: Cpu,
    title: 'Calibrated Uncertainty Protocol',
    summary: 'Inspect the 3-outcome decision boundaries that prevent false accusations on compressed media.'
  },
  {
    id: 'privacy',
    code: 'ZERO-DISK',
    icon: Lock,
    title: 'Ephemeral RAM Execution',
    summary: 'Trace how uploaded media decodes strictly inside volatile memory with zero disk retention.'
  }
];

export default function Hero({
  onLearnMore,
  onOpenApiConfig,
  isBackendOnline = false,
  theme = 'dark'
}) {
  const containerRef = useRef(null);
  const isDark = theme === 'dark';

  const [activeModule, setActiveModule] = useState('fft');
  const [selectedBand, setSelectedBand] = useState(3);
  const [selectedGate, setSelectedGate] = useState('uncertain');
  const [selectedRamStep, setSelectedRamStep] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.hero-stagger',
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.07,
            ease: 'power3.out',
            clearProps: 'transform,opacity'
          }
        );
      });
    },
    { scope: containerRef }
  );

  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const activeBand = FFT_BANDS[selectedBand] || FFT_BANDS[3];
  const activeGate = CALIBRATION_GATES.find((g) => g.id === selectedGate) || CALIBRATION_GATES[1];
  const activeRam = RAM_STEPS[selectedRamStep] || RAM_STEPS[0];

  return (
    <section ref={containerRef} className="relative min-h-[82vh] pt-10 pb-12 lg:pt-14 lg:pb-16 flex flex-col justify-center">
      {/* Main Hero Stage powered by Velaris WebGL Simplex-Noise Shader */}
      <Velaris
        bg={isDark ? '#0d0e12' : '#fcfcfc'}
        colors={isDark ? VELARIS_DARK : VELARIS_LIGHT}
        speed={isDark ? 1.8 : 1.3}
        grain={isDark ? 0.34 : 0.14}
        height="auto"
        className="rounded-[24px] border border-[var(--border-hairline)] shadow-[var(--shadow-lg)]"
      >
        {/* Readability Backdrop Scrim */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 ${
            isDark
              ? 'bg-gradient-to-br from-[#0d0e12]/82 via-[#161922]/65 to-[#0d0e12]/85'
              : 'bg-gradient-to-br from-[#fcfcfc]/88 via-white/80 to-[#ffafbd]/20'
          }`}
        />

        <div className="relative z-10 p-8 sm:p-10 lg:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column */}
            <div className="lg:col-span-6 text-left">
              <div className="hero-stagger flex flex-wrap items-center gap-2 mb-5">
                <button
                  type="button"
                  onClick={onOpenApiConfig}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-mono text-[11px] font-medium bg-[var(--sub-block-bg)]/90 text-[var(--text-primary)] border border-[var(--border-hairline)] hover:border-[var(--border-specular)] transition-colors"
                  title="Inspect or configure backend telemetry & vision model keys"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isBackendOnline
                        ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]'
                        : 'bg-[#ff5e78]'
                    }`}
                  />
                  <span>{isBackendOnline ? 'ENGINE ONLINE' : 'LOCAL CANVAS ENGINE'}</span>
                  <Sliders className="w-3 h-3 text-[var(--text-muted)]" />
                </button>

                <span className="font-mono text-[11px] tracking-wider uppercase text-[var(--text-muted)] px-2">
                  VELARIS WEBGL · ZERO-DISK
                </span>
              </div>

              <h1 className="hero-stagger font-extrabold tracking-[-0.035em] leading-[1.05] text-[clamp(2.3rem,4.7vw,3.75rem)] text-[var(--text-primary)] mb-4">
                Expose Pixels
                <span className="block bg-gradient-to-r from-[#ff2e2e] via-[#ff5e78] to-[#ffafbd] bg-clip-text text-transparent">
                  Beyond the Lens.
                </span>
              </h1>

              <p className="hero-stagger text-[1rem] sm:text-[1.06rem] leading-relaxed text-[var(--text-secondary)] max-w-xl mb-8">
                A Crimson-calibrated optical forensics instrument that isolates diffusion grids, missing CMOS sensor grain,
                and synthetic claims—while honoring scientific uncertainty on ambiguous media.
              </p>

              {/* Single-Line Clean CTA Row */}
              <div className="hero-stagger flex flex-wrap items-center gap-3.5 mb-8">
                <button
                  type="button"
                  onClick={() => scrollToSection('image-uploader-section')}
                  className="btn-primary px-6 py-3 text-[0.95rem]"
                >
                  <span>Inspect an Image</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('digicam-shutter-section')}
                  className="group relative overflow-hidden inline-flex items-center gap-2.5 px-5 py-3 rounded-xl text-[0.92rem] font-semibold text-[var(--text-primary)] bg-gradient-to-b from-white to-[#f4f4f5] dark:from-[#1f2332] dark:to-[#11131a] border border-[var(--border-hairline)] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_6px_16px_rgba(0,0,0,0.32)] hover:border-[#ff5e78]/50 transition-all duration-200 active:translate-y-px"
                >
                  {/* Diagonal Light-Sheen Sweep */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 skew-x-[-22deg] bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[340%]"
                  />
                  {/* Micro Crimson Corner Glint */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-tr-[3px] border-t border-r border-[#ff5e78]/35 group-hover:border-[#ff2e2e] group-hover:shadow-[0_0_8px_rgba(255,46,46,0.9)] transition-all duration-200"
                  />
                  {/* Rotating 6-Blade Optical Iris SVG */}
                  <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 shrink-0 relative z-10" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="9.2" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.2" />
                    <g className="origin-center transition-transform duration-300 ease-out group-hover:rotate-45 group-hover:scale-[0.86]">
                      <path
                        d="M12 3.2L15.4 9.5M19.6 7.6L14.5 12M19.6 16.4L12.5 15.2M12 20.8L8.6 14.5M4.4 16.4L9.5 12M4.4 7.6L11.5 8.8"
                        stroke="#ff5e78"
                        strokeWidth="1.35"
                        strokeLinecap="round"
                      />
                      <circle cx="12" cy="12" r="2.1" fill="#ff2e2e" className="transition-transform duration-300 origin-center group-hover:scale-75" />
                    </g>
                  </svg>
                  <span className="relative z-10">Digicam Flash Lab</span>
                </button>

                <button
                  type="button"
                  onClick={onLearnMore}
                  className="group relative overflow-hidden inline-flex items-center gap-2 px-4 py-3 rounded-xl text-[0.9rem] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-gradient-to-b from-white/80 to-[#f4f4f5]/90 dark:from-[#191c27] dark:to-[#101218] border border-[var(--border-hairline)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-[#ff5e78]/45 transition-all duration-200 active:translate-y-px"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-tr-[3px] border-t border-r border-transparent group-hover:border-[#ff5e78]/75 transition-colors duration-200"
                  />
                  <Activity className="w-3.5 h-3.5 text-[#ff2e2e] relative z-10" />
                  <span className="relative z-10">Pipeline</span>
                  <ChevronRight className="w-3.5 h-3.5 relative z-10 transition-transform duration-200 group-hover:translate-x-0.5 text-[var(--text-muted)] group-hover:text-[#ff5e78]" />
                </button>
              </div>

              {/* Compact Telemetry Spec Bar */}
              <div className="hero-stagger grid grid-cols-3 gap-3 max-w-lg pt-4 border-t border-[var(--border-hairline)]">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                    Spectrum
                  </div>
                  <div className="font-mono text-[13px] font-semibold text-[var(--text-primary)] tabular-nums">
                    2D Radix-2 FFT
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                    Sensor Physics
                  </div>
                  <div className="font-mono text-[13px] font-semibold text-[var(--text-primary)] tabular-nums">
                    PRNU Shot Floor
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                    Classification
                  </div>
                  <div className="font-mono text-[13px] font-semibold text-[var(--text-primary)] tabular-nums">
                    3-Outcome Cal.
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Forensic Split-Curtain Comparator */}
            <div className="lg:col-span-6 hero-stagger">
              <HeroSplitComparator />
            </div>
          </div>
        </div>
      </Velaris>

      {/* Interactive Signal Telemetry Dock (Replaces generic 3-box feature cards) */}
      <div className="hero-stagger mt-12 lg:mt-16 glass-panel rounded-[20px] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border-hairline)]">
          {/* Left Selector Rail */}
          <div className="lg:col-span-5 divide-y divide-[var(--border-hairline)]">
            {TELEMETRY_MODULES.map((mod) => {
              const Icon = mod.icon;
              const isSelected = activeModule === mod.id;
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => setActiveModule(mod.id)}
                  className={`relative w-full text-left px-6 py-5 transition-colors flex items-start gap-4 ${
                    isSelected
                      ? 'bg-[var(--blue-faint)]/60'
                      : 'hover:bg-[var(--bg-hover)]/45'
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="hero-signal-rail"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-[#ff2e2e]"
                    />
                  )}
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                      isSelected
                        ? 'bg-[#ff2e2e]/15 border-[#ff2e2e]/45 text-[#ff5e78]'
                        : 'bg-[var(--sub-block-bg)] border-[var(--border-hairline)] text-[var(--text-muted)]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] font-semibold tracking-wider uppercase text-[#ff5e78]">
                        {mod.code}
                      </span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform ${
                          isSelected ? 'translate-x-0.5 text-[#ff5e78]' : 'text-[var(--text-muted)]'
                        }`}
                      />
                    </div>
                    <div className="text-[0.95rem] font-bold text-[var(--text-primary)] mt-0.5">
                      {mod.title}
                    </div>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-1">
                      {mod.summary}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Live Interactive Readout */}
          <div className="lg:col-span-7 p-7 lg:p-8 flex flex-col justify-between">
            {activeModule === 'fft' && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                      Interactive Harmonic Spectrum Analyzer
                    </div>
                    <h2 className="text-base font-bold text-[var(--text-primary)]">
                      Optical 1/f Falloff vs. Diffusion Upsampling Peaks
                    </h2>
                  </div>
                  <span className="mono-badge mono-badge-ai tabular-nums">
                    BAND {activeBand.label} · {activeBand.delta}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2.5 h-28 items-end mb-3 p-3 rounded-xl bg-[var(--bg-main)]/75 border border-[var(--border-hairline)]">
                  {FFT_BANDS.map((band, idx) => {
                    const isPicked = selectedBand === idx;
                    return (
                      <button
                        key={band.label}
                        type="button"
                        onClick={() => setSelectedBand(idx)}
                        className={`h-full flex flex-col justify-end gap-1 rounded-lg px-1.5 py-1 transition-all ${
                          isPicked
                            ? 'bg-[#ff2e2e]/12 ring-1 ring-[#ff2e2e]/45'
                            : 'hover:bg-[var(--bg-hover)]/40'
                        }`}
                      >
                        <div className="w-full flex items-end justify-center gap-1 h-16">
                          <div
                            className="w-2.5 rounded-t bg-[#30447a] transition-all duration-300"
                            style={{ height: `${band.realPct}%` }}
                            title="Authentic optical decay"
                          />
                          <div
                            className={`w-2.5 rounded-t transition-all duration-300 ${
                              band.label === '0.7f' ? 'bg-[#ff2e2e]' : 'bg-[#ff5e78]/80'
                            }`}
                            style={{ height: `${band.aiPct}%` }}
                            title="AI generator response"
                          />
                        </div>
                        <span className="font-mono text-[10px] text-[var(--text-muted)] text-center tabular-nums">
                          {band.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-mono text-[var(--text-secondary)]">{activeBand.note}</span>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="inline-flex items-center gap-1.5 text-[var(--text-muted)]">
                      <span className="w-2 h-2 rounded-sm bg-[#30447a]" /> Optical 1/f
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[#ff5e78]">
                      <span className="w-2 h-2 rounded-sm bg-[#ff2e2e]" /> Generative FFT
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeModule === 'calibration' && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                      Calibrated 3-Outcome Decision Boundaries
                    </div>
                    <h2 className="text-base font-bold text-[var(--text-primary)]">
                      Click a Probability Zone to Inspect Fusion Behavior
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  {CALIBRATION_GATES.map((gate) => {
                    const isPicked = selectedGate === gate.id;
                    return (
                      <button
                        key={gate.id}
                        type="button"
                        onClick={() => setSelectedGate(gate.id)}
                        className={`rounded-xl p-3 text-left border transition-all ${
                          isPicked
                            ? `${gate.tone} shadow-[var(--shadow-sm)]`
                            : 'border-[var(--border-hairline)] bg-[var(--bg-main)]/65 hover:border-[var(--border-specular)]'
                        }`}
                      >
                        <div className="font-mono text-[10px] text-[var(--text-muted)] tabular-nums">
                          {gate.range}
                        </div>
                        <div className="text-xs font-bold text-[var(--text-primary)] mt-0.5">
                          {gate.verdict}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="rounded-xl bg-[var(--bg-main)]/75 border border-[var(--border-hairline)] px-4 py-3 text-xs text-[var(--text-secondary)] leading-relaxed">
                  <span className="font-mono font-semibold text-[#ff5e78] mr-2">
                    [{activeGate.verdict.toUpperCase()}]
                  </span>
                  {activeGate.detail}
                </div>
              </div>
            )}

            {activeModule === 'privacy' && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                      Zero-Retention Ephemeral Execution Path
                    </div>
                    <h2 className="text-base font-bold text-[var(--text-primary)]">
                      Inspect volatile RAM processing steps
                    </h2>
                  </div>
                  <span className="font-mono text-[11px] text-[#ff5e78]">0 KB ON DISK</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3.5">
                  {RAM_STEPS.map((st, idx) => {
                    const isPicked = selectedRamStep === idx;
                    return (
                      <button
                        key={st.code}
                        type="button"
                        onClick={() => setSelectedRamStep(idx)}
                        className={`rounded-xl p-2.5 text-left border transition-all ${
                          isPicked
                            ? 'border-[#ff2e2e]/60 bg-[#ff2e2e]/12'
                            : 'border-[var(--border-hairline)] bg-[var(--bg-main)]/65 hover:border-[var(--border-specular)]'
                        }`}
                      >
                        <div className="font-mono text-[10px] text-[#ff5e78]">STEP {st.code}</div>
                        <div className="text-xs font-bold text-[var(--text-primary)] mt-0.5 leading-snug">
                          {st.name}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="rounded-xl bg-[var(--bg-main)]/75 border border-[var(--border-hairline)] px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[var(--text-secondary)]">{activeRam.desc}</span>
                  <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-[var(--sub-block-bg)] text-[#ff5e78] border border-[var(--border-hairline)]">
                    {activeRam.stat}
                  </span>
                </div>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-[var(--border-hairline)] flex items-center justify-between gap-2 text-xs">
              <span className="font-mono text-[11px] text-[var(--text-muted)]">
                All 4 forensic signals execute concurrently in RAM
              </span>
              <button
                type="button"
                onClick={() => scrollToSection('image-uploader-section')}
                className="inline-flex items-center gap-1 font-semibold text-[#ff5e78] hover:text-[#ff2e2e] transition-colors"
              >
                <span>Open Intake Workbench</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
