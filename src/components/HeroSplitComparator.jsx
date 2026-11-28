import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MoveHorizontal } from 'lucide-react';

const ASCII_RAMP = ' .:-=+*#%@';
const MOON_IMAGE_SRC = '/moon-real.jpg';

/**
 * Compute exact CSS `object-cover object-center` source-crop coordinates
 * so offscreen ASCII canvas sampling aligns to the optical <img> to 0.0px.
 */
function getCoverCrop(srcW, srcH, boxW, boxH) {
  const scale = Math.max(boxW / srcW, boxH / srcH);
  const drawW = srcW * scale;
  const drawH = srcH * scale;
  const offsetX = (boxW - drawW) / 2;
  const offsetY = (boxH - drawH) / 2;
  return {
    sx: -offsetX / scale,
    sy: -offsetY / scale,
    sw: boxW / scale,
    sh: boxH / scale,
  };
}

/**
 * Fallback procedural Full Moon height/albedo field (used ONLY if image fails to load).
 */
function sampleProceduralMoon(nx, ny) {
  const dx = (nx - 0.5) * 1.4545;
  const dy = ny - 0.5;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const radius = 0.42;
  if (dist > radius) return 0;

  const rNorm = dist / radius;
  const sphereShade = Math.sqrt(Math.max(0, 1 - rNorm * rNorm * 0.65));
  const mare1 = Math.sin(dx * 9.5 + 0.8) * Math.cos(dy * 8.2 - 0.4) * 0.16;
  const mare2 = Math.cos((dx - 0.12) * 16.0 - dy * 11.0) * 0.1;
  const craterTycho = Math.max(0, 1 - Math.hypot(dx + 0.08, dy - 0.18) / 0.16) * 0.35;
  const craterCopernicus = Math.max(0, 1 - Math.hypot(dx + 0.09, dy + 0.07) / 0.11) * 0.25;

  return Math.min(1, Math.max(0.06, sphereShade * 0.62 + mare1 + mare2 + craterTycho + craterCopernicus));
}

/**
 * Interactive draggable forensic split-curtain comparator embedded in the Hero:
 * - Left: Authentic full-bleed public-domain Full Moon optical photograph
 * - Right: Live pixel-aligned ASCII Moon computed via HTML5 <canvas> luminance mapper
 */
export default function HeroSplitComparator() {
  const [splitPct, setSplitPct] = useState(52);
  const [overlayMode, setOverlayMode] = useState('telemetry');
  const [moonReady, setMoonReady] = useState(false);

  const containerRef = useRef(null);
  const asciiCanvasRef = useRef(null);
  const offscreenCanvasRef = useRef(null);
  const moonImgRef = useRef(null);
  const draggingRef = useRef(false);

  const renderAsciiMoon = useCallback((showHud) => {
    const container = containerRef.current;
    const canvas = asciiCanvasRef.current;
    if (!container || !canvas) return;

    const W = container.clientWidth;
    const H = container.clientHeight;
    if (W <= 0 || H <= 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(W * dpr));
    canvas.height = Math.max(1, Math.floor(H * dpr));
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Deep Obsidian background (#08080B)
    ctx.fillStyle = '#08080B';
    ctx.fillRect(0, 0, W, H);

    // Faint spectral lattice underneath
    const gridStep = 24;
    ctx.strokeStyle = showHud ? 'rgba(255, 59, 92, 0.085)' : 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    for (let gx = 0; gx <= W; gx += gridStep) {
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, H);
    }
    for (let gy = 0; gy <= H; gy += gridStep) {
      ctx.moveTo(0, gy);
      ctx.lineTo(W, gy);
    }
    ctx.stroke();

    // Monospace sampling grid (6.5px x 7.5px crisp lunar detail)
    const targetCellW = 6.2;
    const targetCellH = 7.4;
    const cols = Math.max(24, Math.floor(W / targetCellW));
    const rows = Math.max(18, Math.floor(H / targetCellH));
    const cellW = W / cols;
    const cellH = H / rows;

    let pixelData = null;
    const img = moonImgRef.current;

    if (img && img.complete && img.naturalWidth > 0) {
      try {
        if (!offscreenCanvasRef.current) {
          offscreenCanvasRef.current = document.createElement('canvas');
        }
        const off = offscreenCanvasRef.current;
        off.width = cols;
        off.height = rows;
        const offCtx = off.getContext('2d', { willReadFrequently: true });
        if (offCtx) {
          offCtx.clearRect(0, 0, cols, rows);
          const { sx, sy, sw, sh } = getCoverCrop(img.naturalWidth, img.naturalHeight, W, H);
          offCtx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);
          pixelData = offCtx.getImageData(0, 0, cols, rows).data;
        }
      } catch {
        pixelData = null;
      }
    }

    ctx.font = `600 ${Math.max(6, Math.round(cellH * 1.04))}px "JetBrains Mono", "IBM Plex Mono", ui-monospace, SFMono-Regular, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const rampMax = ASCII_RAMP.length - 1;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let lum = 0;
        if (pixelData) {
          const pIdx = (row * cols + col) * 4;
          const r = pixelData[pIdx];
          const g = pixelData[pIdx + 1];
          const b = pixelData[pIdx + 2];
          lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        } else {
          lum = sampleProceduralMoon((col + 0.5) / cols, (row + 0.5) / rows);
        }

        // Keep dark cosmic sky around lunar limb clean deep obsidian
        if (lum < 0.045) continue;

        const normalized = Math.min(1, Math.max(0, (lum - 0.045) / 0.85));
        const toned = Math.pow(normalized, 0.84);
        const charIndex = Math.max(1, Math.min(rampMax, Math.round(toned * rampMax)));
        const glyph = ASCII_RAMP[charIndex];

        if (glyph === ' ') continue;

        if (toned < 0.34) {
          ctx.fillStyle = '#9E2A3B';
        } else if (toned < 0.64) {
          ctx.fillStyle = '#FF3B5C';
        } else if (toned < 0.82) {
          ctx.fillStyle = '#FF9EAE';
        } else {
          ctx.fillStyle = '#F8EEF0';
        }

        ctx.fillText(glyph, (col + 0.5) * cellW, (row + 0.5) * cellH);
      }
    }
  }, []);

  // Load CORS-clean Full Moon photo and trigger exact pixel-aligned ASCII synthesis
  useEffect(() => {
    let active = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (!active) return;
      moonImgRef.current = img;
      setMoonReady(true);
      renderAsciiMoon(overlayMode === 'telemetry');
    };
    img.onerror = () => {
      if (!active) return;
      moonImgRef.current = null;
      setMoonReady(false);
      renderAsciiMoon(overlayMode === 'telemetry');
    };
    img.src = MOON_IMAGE_SRC;

    return () => {
      active = false;
    };
  }, [overlayMode, renderAsciiMoon]);

  // Keep ASCII Moon resolution synchronized with container bounds
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const showHud = overlayMode === 'telemetry';
    renderAsciiMoon(showHud);

    const ro = new ResizeObserver(() => {
      renderAsciiMoon(showHud);
    });
    ro.observe(container);

    return () => ro.disconnect();
  }, [overlayMode, moonReady, renderAsciiMoon]);

  const updateFromClientX = (clientX) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (!rect.width) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSplitPct(Math.round(Math.min(92, Math.max(8, pct))));
  };

  const handlePointerDown = (e) => {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const handlePointerMove = (e) => {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  };

  const handlePointerUp = () => {
    draggingRef.current = false;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSplitPct((prev) => Math.max(8, prev - 4));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSplitPct((prev) => Math.min(92, prev + 4));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setSplitPct(8);
    } else if (e.key === 'End') {
      e.preventDefault();
      setSplitPct(92);
    }
  };

  const showTelemetry = overlayMode === 'telemetry';

  return (
    <div className="rounded-[20px] border border-[var(--border-hairline)] bg-[#0b0c10]/85 p-3 sm:p-4 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.07),var(--shadow-lg)]">
      {/* Slim Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 px-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#ff2e2e] shadow-[0_0_8px_rgba(255,46,46,0.95)]" />
          <span className="font-mono text-[10.5px] font-medium tracking-[0.12em] uppercase text-[#a1a1aa]">
            FORENSIC CURTAIN
          </span>
        </div>

        <div
          role="group"
          aria-label="Comparator view mode"
          className="inline-flex items-center gap-3 font-mono text-[10.5px]"
        >
          <button
            type="button"
            onClick={() => setOverlayMode('optical')}
            className={`pb-0.5 border-b transition-colors ${
              !showTelemetry
                ? 'border-[#34d399] text-[#fcfcfc]'
                : 'border-transparent text-[#71717a] hover:text-[#d4d4d8]'
            }`}
          >
            OPTICAL
          </button>
          <button
            type="button"
            onClick={() => setOverlayMode('telemetry')}
            className={`pb-0.5 border-b transition-colors ${
              showTelemetry
                ? 'border-[#ff2e2e] text-[#ff5e78]'
                : 'border-transparent text-[#71717a] hover:text-[#d4d4d8]'
            }`}
          >
            FFT &amp; NOISE HUD
          </button>
        </div>
      </div>

      {/* Main Viewport Stage */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-full aspect-[16/11] rounded-xl overflow-hidden select-none touch-none border border-[#27272a] bg-[#08080B]"
      >
        {/* ══ RIGHT LAYER: Pixel-Aligned ASCII Moon Canvas (#08080B Obsidian + Crimson/Bone Glyphs) ══ */}
        <div className="absolute inset-0 bg-[#08080B]">
          <canvas
            ref={asciiCanvasRef}
            aria-label="Synthesized ASCII luminance reconstruction of the lunar surface"
            className="w-full h-full block pointer-events-none"
          />

          {/* Top-Right Transparent Viewfinder Corner Callout */}
          <div className="absolute top-3 right-3.5 text-right pointer-events-none">
            <div className="inline-flex flex-col items-end pr-2 pt-1 border-t border-r border-[#ff5e78]/65 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
              <div className="font-mono text-[10px] font-semibold tracking-wider text-[#ff5e78] tabular-nums">
                SYNTHETIC · P(AI) 91%
              </div>
              {showTelemetry && (
                <div className="font-mono text-[9.5px] text-[#d4d4d8]/90 tabular-nums mt-0.5">
                  ASCII MATRIX · FFT +2.42 dB
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ══ LEFT LAYER: Authentic Full-Bleed NASA/Wikimedia Full Moon Optical Photograph ══ */}
        <div
          className="absolute inset-0 bg-black"
          style={{ clipPath: `inset(0 ${100 - splitPct}% 0 0)` }}
        >
          <img
            src={MOON_IMAGE_SRC}
            crossOrigin="anonymous"
            alt="Full-bleed optical photograph of the Full Moon showing natural lunar craters and maria"
            className="w-full h-full object-cover object-center contrast-[1.06] brightness-[0.98] pointer-events-none select-none"
          />

          {/* Subtle Optical Top-Left Scrim for HUD Legibility */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/50 via-transparent to-transparent"
          />

          {/* Top-Left Transparent Viewfinder Corner Callout */}
          <div className="absolute top-3 left-3.5 pointer-events-none">
            <div className="inline-flex flex-col items-start pl-2 pt-1 border-t border-l border-[#34d399]/65 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
              <div className="font-mono text-[10px] font-semibold tracking-wider text-[#34d399] tabular-nums">
                OPTICAL · P(REAL) 88%
              </div>
              {showTelemetry && (
                <div className="font-mono text-[9.5px] text-[#d4d4d8]/90 tabular-nums mt-0.5">
                  1/f -1.82 · CMOS VAR 2.48
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ══ Precision Optical Reticle Split Slider ══ */}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Forensic comparison slider between authentic Full Moon photograph and pixel-aligned ASCII synthesis"
          aria-valuemin={8}
          aria-valuemax={92}
          aria-valuenow={splitPct}
          onKeyDown={handleKeyDown}
          style={{ left: `${splitPct}%` }}
          className="absolute inset-y-0 -translate-x-1/2 z-20 flex items-center justify-center w-8 cursor-ew-resize group focus:outline-none"
        >
          <div className="relative h-full flex justify-center">
            <div className="w-[1.5px] h-full bg-gradient-to-b from-[#ffafbd]/75 via-[#ff2e2e] to-[#ff2e2e]/85 shadow-[0_0_10px_rgba(255,46,46,0.9)]" />
            <div className="absolute inset-y-6 w-px bg-white/75" />
          </div>

          <div className="absolute w-8 h-8 rounded-full bg-[#0d0e12]/95 border border-[#ff2e2e]/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_0_16px_rgba(255,46,46,0.55)] flex items-center justify-center transition-transform group-hover:scale-110 group-focus-visible:ring-2 group-focus-visible:ring-[#ff2e2e]">
            <MoveHorizontal className="w-3.5 h-3.5 text-[#ff5e78]" />
          </div>
        </div>

        {/* ══ Bottom Graduated Vernier Ruler Ticks & Clean Transparent Readout ══ */}
        <div className="absolute bottom-0 inset-x-0 pointer-events-none flex flex-col justify-end bg-gradient-to-t from-black/75 via-black/30 to-transparent pt-5 pb-1.5 px-3">
          <div className="flex items-center justify-between font-mono text-[9.5px] tracking-wider tabular-nums mb-1">
            <span className="text-[#34d399]">
              OPT {splitPct}% <span className="text-[#71717a]">|</span>{' '}
              <span className="text-[#ff5e78]">SYN {100 - splitPct}%</span>
            </span>
            <span className="hidden sm:inline text-[#71717a]">
              ← / → DRAG RETICLE
            </span>
          </div>
          <svg viewBox="0 0 400 8" className="w-full h-2 opacity-65" preserveAspectRatio="none" aria-hidden="true">
            {Array.from({ length: 41 }).map((_, idx) => {
              const x = idx * 10;
              const isMajor = idx % 5 === 0;
              return (
                <line
                  key={idx}
                  x1={x}
                  y1={isMajor ? 0 : 4}
                  x2={x}
                  y2={8}
                  stroke={idx === Math.round((splitPct / 100) * 40) ? '#ff2e2e' : '#71717a'}
                  strokeWidth={isMajor ? 1.1 : 0.7}
                />
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
