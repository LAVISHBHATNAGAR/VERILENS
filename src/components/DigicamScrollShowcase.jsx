import React, { useState, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  Camera,
  Zap,
  Aperture,
  Scan,
  Volume2,
  VolumeX,
  CheckCircle2
} from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const DIGICAM_SHOTS = [
  {
    id: 'digicam-street',
    src: '/images/digicam-street.jpg',
    fileName: 'DIGICAM_STREET_FLASH_01.jpg',
    title: 'Midnight Alley Xenon Flash',
    camera: 'RICOH GR IIIx · 40mm f/2.8',
    settings: '1/160s · ISO 800 · FLASH ON',
    note: 'Direct on-camera xenon specular reflection with natural CMOS low-light grain.'
  },
  {
    id: 'digicam-architecture',
    src: '/images/digicam-architecture.jpg',
    fileName: 'DIGICAM_BRUTALIST_OPTICS_02.jpg',
    title: 'Golden-Hour Concrete Study',
    camera: 'LEICA D-LUX 8 · 24mm f/4.0',
    settings: '1/640s · ISO 160 · NATURAL',
    note: 'Crisp sunlit geometric shadow lines with authentic optical lens dispersion.'
  },
  {
    id: 'digicam-studio',
    src: '/images/digicam-studio.jpg',
    fileName: 'DIGICAM_ANALOG_DESK_03.jpg',
    title: 'Contact Sheet & Optics Desk',
    camera: 'CONTAX T3 DIGITAL · 35mm f/2.8',
    settings: '1/125s · ISO 200 · FILL FLASH',
    note: 'Candid studio texture showing fine grain, paper fibers, and glass lens highlights.'
  }
];

function playShutterClickSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Crisp dual transient simulating mechanical leaf-shutter snap
    [0, 0.045].forEach((offset, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(idx === 0 ? 1150 : 780, now + offset);
      osc.frequency.exponentialRampToValueAtTime(120, now + offset + 0.032);
      gain.gain.setValueAtTime(0.14, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.035);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.04);
    });
  } catch {
    // Web Audio blocked or unavailable
  }
}

export default function DigicamScrollShowcase({ onInspectDigicamPhoto }) {
  const sectionRef = useRef(null);
  const lastTriggerRef = useRef(0);
  const reducedMotion = useReducedMotion();

  const [flashKey, setFlashKey] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);
  const [shotCount, setShotCount] = useState(1);
  const [activeShotIdx, setActiveShotIdx] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [loadingShotId, setLoadingShotId] = useState(null);

  const triggerCameraCapture = useCallback(
    (advancePhoto = true, playAudioIfEnabled = false) => {
      const now = Date.now();
      if (now - lastTriggerRef.current < 420) return;
      lastTriggerRef.current = now;

      setFlashKey((k) => k + 1);
      setIsFlashing(true);
      if (advancePhoto) {
        setShotCount((c) => c + 1);
        setActiveShotIdx((idx) => (idx + 1) % DIGICAM_SHOTS.length);
      }
      if (playAudioIfEnabled && soundEnabled) {
        playShutterClickSound();
      }
      setTimeout(() => setIsFlashing(false), 520);
    },
    [soundEnabled]
  );

  // ScrollTrigger fires the camera shutter + white xenon flash spark when scrolling past!
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.digicam-rig-card',
          { y: 24, opacity: 0.9 },
          {
            y: 0,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 72%',
              end: 'bottom 25%',
              onEnter: () => triggerCameraCapture(false, false),
              onEnterBack: () => triggerCameraCapture(false, false)
            }
          }
        );
      });
    },
    { scope: sectionRef, dependencies: [triggerCameraCapture] }
  );

  const handleLoadShotIntoLab = async (shot) => {
    if (!onInspectDigicamPhoto) return;
    setLoadingShotId(shot.id);
    try {
      const res = await fetch(shot.src);
      const blob = await res.blob();
      const file = new File([blob], shot.fileName, { type: blob.type || 'image/jpeg' });
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          onInspectDigicamPhoto({
            file,
            name: shot.fileName,
            size: file.size,
            type: file.type,
            dataUrl: e.target.result,
            element: img,
            dimensions: {
              width: img.naturalWidth || img.width,
              height: img.naturalHeight || img.height
            }
          });
          setLoadingShotId(null);
          const previewEl = document.getElementById('image-preview-workbench') || document.getElementById('image-uploader-section');
          previewEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } catch {
      setLoadingShotId(null);
    }
  };

  const activeShot = DIGICAM_SHOTS[activeShotIdx];

  return (
    <section
      id="digicam-shutter-section"
      ref={sectionRef}
      className="mx-auto py-4 relative"
    >
      {/* Full-Section Screen Flash Exposure Wash when camera triggers */}
      {isFlashing && !reducedMotion && (
        <div
          key={`wash-${flashKey}`}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-40 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.68),rgba(254,243,199,0.22)_45%,transparent_72%)] animate-flash-wash"
        />
      )}

      <div className="digicam-rig-card glass-panel p-7 sm:p-9 lg:p-10 rounded-[22px] overflow-hidden relative">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <span className="mono-badge bg-[var(--sub-block-bg)] text-[#ff5e78] border border-[#ff2e2e]/30 mb-2.5">
              <Zap className="w-3.5 h-3.5 text-[#ff2e2e]" />
              <span>SCROLL-REACTIVE SHUTTER &amp; XENON FLASH LAB</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
              Click the Digicam. Capture &amp; Audit Live Optics.
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed max-w-2xl">
              Scroll past or click the camera shutter below to discharge the xenon flash spark and inspect real digicam optical captures inside VERILENS.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setSoundEnabled((s) => !s)}
              aria-label={soundEnabled ? 'Mute shutter click sound' : 'Enable subtle shutter click sound'}
              className="btn-secondary text-xs py-2 px-3.5"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[var(--blue-light)]" />
                  <span>Shutter SFX On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <span>SFX Muted</span>
                </>
              )}
            </button>

            <span className="mono-badge mono-badge-blue tabular-nums">
              FRAMES: #{String(shotCount).padStart(3, '0')}
            </span>
          </div>
        </div>

        {/* Main 2-Column Camera + Live Capture Filmstrip */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* LEFT: Interactive Digicam Hardware Rig with Xenon Spark Emitter */}
          <div className="lg:col-span-6">
            <div
              role="button"
              tabIndex={0}
              aria-label="Click digicam to snap shutter and fire xenon white flash spark"
              onClick={() => triggerCameraCapture(true, true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  triggerCameraCapture(true, true);
                }
              }}
              className={`relative rounded-2xl overflow-hidden bg-[#0d0e12] border border-[var(--border-hairline)] shadow-[var(--shadow-lg)] group cursor-pointer transition-transform duration-150 ${
                isFlashing && !reducedMotion ? 'scale-[0.985]' : 'hover:border-[var(--border-specular)]'
              }`}
            >
              <img
                src="/images/digicam-camera.jpg"
                alt="Compact matte black and brushed titanium digital camera with xenon flash window"
                className="w-full h-auto block select-none"
              />

              {/* XENON FLASH WHITE LIGHT SPARK BURST (Positioned precisely on flash window) */}
              {isFlashing && !reducedMotion && (
                <div
                  key={`spark-${flashKey}`}
                  aria-hidden="true"
                  style={{ left: '74.5%', top: '26.5%' }}
                  className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 z-30 animate-xenon-burst"
                >
                  {/* Intense White Xenon Core */}
                  <div className="w-44 h-44 rounded-full bg-[radial-gradient(circle,#FFFFFF_0%,rgba(255,255,255,0.96)_18%,rgba(255,175,189,0.72)_40%,rgba(255,46,46,0.22)_65%,transparent_76%)]" />
                  {/* Horizontal & Vertical Optical Starburst Rays */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-[3px] bg-gradient-to-r from-transparent via-white to-transparent blur-[0.5px]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-[3px] bg-gradient-to-b from-transparent via-white to-transparent blur-[0.5px]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-[2px] rotate-45 bg-gradient-to-r from-transparent via-[#ffafbd] to-transparent" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-[2px] -rotate-45 bg-gradient-to-r from-transparent via-[#ff8597] to-transparent" />
                </div>
              )}

              {/* Subtle Hover / Click Shutter Prompt Overlay */}
              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2">
                <div className="rounded-full bg-[#0d0e12]/85 border border-white/15 px-3 py-1.5 backdrop-blur-md flex items-center gap-2">
                  <Camera className="w-3.5 h-3.5 text-[#ff5e78]" />
                  <span className="font-mono text-[11px] text-[#fcfcfc]">
                    CLICK CAMERA TO SNAP &amp; FLASH
                  </span>
                </div>
                <span className="rounded-full bg-[#ff2e2e]/20 border border-[#ff5e78]/45 px-2.5 py-1 font-mono text-[10px] text-[#ffafbd] backdrop-blur-md">
                  XENON READY
                </span>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => triggerCameraCapture(true, true)}
                className="btn-primary text-xs py-2.5 px-5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Fire Shutter &amp; Cycle Capture</span>
              </button>
              <span className="font-mono text-[11px] text-[var(--text-muted)]">
                Auto-triggers when scrolled into view
              </span>
            </div>
          </div>

          {/* RIGHT: Latest Captured Digicam Frame + Contact Sheet Thumbnails */}
          <div className="lg:col-span-6 space-y-3.5">
            {/* Active Captured Frame Card */}
            <div className="rounded-2xl bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] overflow-hidden">
              <div className="relative aspect-[4/3] overflow-hidden bg-black">
                <img
                  src={activeShot.src}
                  alt={activeShot.title}
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    isFlashing && !reducedMotion ? 'brightness-150 contrast-110' : 'brightness-100'
                  }`}
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="mono-badge bg-[#0d0e12]/85 text-[#ff5e78] border border-[#ff2e2e]/40 backdrop-blur-md">
                    <Aperture className="w-3 h-3" />
                    <span>CAPTURED FRAME #{String(shotCount).padStart(3, '0')}</span>
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-[#0d0e12]/80 border border-[#27272a] px-3 py-2 backdrop-blur-md flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold text-[#fcfcfc]">{activeShot.title}</div>
                    <div className="font-mono text-[10px] text-[#ff5e78]">{activeShot.camera}</div>
                  </div>
                  <span className="font-mono text-[10px] text-[#ffafbd]">{activeShot.settings}</span>
                </div>
              </div>

              <div className="p-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-[var(--text-secondary)] flex-1 min-w-[180px]">
                  {activeShot.note}
                </p>
                <button
                  type="button"
                  onClick={() => handleLoadShotIntoLab(activeShot)}
                  disabled={loadingShotId === activeShot.id}
                  className="btn-primary text-xs py-2 px-4 shrink-0"
                >
                  <Scan className="w-3.5 h-3.5" />
                  <span>
                    {loadingShotId === activeShot.id ? 'Loading...' : 'Verify in Forensics Lab'}
                  </span>
                </button>
              </div>
            </div>

            {/* 3-Shot Contact Sheet Switcher */}
            <div className="grid grid-cols-3 gap-2.5">
              {DIGICAM_SHOTS.map((shot, idx) => {
                const isSelected = idx === activeShotIdx;
                return (
                  <button
                    key={shot.id}
                    type="button"
                    onClick={() => {
                      setActiveShotIdx(idx);
                      triggerCameraCapture(false, true);
                    }}
                    className={`rounded-xl overflow-hidden border text-left transition-all group ${
                      isSelected
                        ? 'border-[var(--blue)] ring-2 ring-[var(--blue)]/30'
                        : 'border-[var(--border-hairline)] opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-[#0d0e12] relative">
                      <img
                        src={shot.src}
                        alt={shot.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-[#ff2e2e] absolute top-1.5 right-1.5 drop-shadow" />
                      )}
                    </div>
                    <div className="px-2 py-1.5 bg-[var(--sub-block-bg)]">
                      <div className="font-mono text-[10px] font-semibold text-[var(--text-primary)] truncate">
                        {shot.title}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
