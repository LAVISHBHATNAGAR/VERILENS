import React, { useState, useEffect, useRef } from 'react';
import {
  Trash2,
  Scan,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FileCheck,
  Search,
  SplitSquareHorizontal,
  Maximize2,
  SlidersHorizontal
} from 'lucide-react';
import { drawFilterToCanvas } from '../utils/canvasFilters';
import { formatBytes } from '../services/detectionService';

const FILTERS = [
  { id: 'original', label: 'Normal' },
  { id: 'ela', label: 'JPEG ELA' },
  { id: 'noise', label: 'Noise Floor' },
  { id: 'bitplane', label: 'Bit-Plane' },
  { id: 'pca', label: 'Color PCA' },
  { id: 'wavelet', label: '2D Wavelet' },
  { id: 'edges', label: 'Sobel Edges' }
];

export default function ImagePreview({ imageItem, onRemove, onAnalyze, isAnalyzing = false }) {
  const [activeFilter, setActiveFilter] = useState('original');
  const [compareMode, setCompareMode] = useState('split'); // 'split' | 'full'
  const [splitPct, setSplitPct] = useState(50);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [loupeMag, setLoupeMag] = useState(0); // 0 | 4 | 8

  // Interactive Sherloq DSP parameters
  const [filterOpts, setFilterOpts] = useState({
    elaQuality: 85,
    elaScale: 16,
    elaGrayscale: false,
    noiseGain: 8,
    noiseGrayscale: false,
    bitIndex: 0,
    bitChannel: 'lum',
    pcaComponent: 1,
    pcaMode: 'distance'
  });
  const [filterMeta, setFilterMeta] = useState({});

  const [loupeState, setLoupeState] = useState({
    visible: false,
    viewX: 0,
    viewY: 0,
    viewW: 300,
    viewH: 300,
    pixelX: 0,
    pixelY: 0,
    rgb: [0, 0, 0],
    hex: '#000000',
    luma: 0
  });

  const baseCanvasRef = useRef(null);
  const filterCanvasRef = useRef(null);
  const loupeCanvasRef = useRef(null);
  const viewportRef = useRef(null);
  const isDraggingSplit = useRef(false);

  // Render Original + Active Sherloq Forensic Canvas asynchronously with cancellation safety
  useEffect(() => {
    if (!imageItem?.element || !baseCanvasRef.current || !filterCanvasRef.current) return;
    let cancelled = false;
    const img = imageItem.element;
    const maxPreviewWidth = 880;
    const maxPreviewHeight = 520;
    const w = img.naturalWidth || img.width || 800;
    const h = img.naturalHeight || img.height || 600;
    const scale = Math.min(maxPreviewWidth / w, maxPreviewHeight / h, 1);
    const cw = Math.max(1, Math.floor(w * scale));
    const ch = Math.max(1, Math.floor(h * scale));

    baseCanvasRef.current.width = cw;
    baseCanvasRef.current.height = ch;
    filterCanvasRef.current.width = cw;
    filterCanvasRef.current.height = ch;

    drawFilterToCanvas(baseCanvasRef.current, img, 'original', {}, () => cancelled);
    drawFilterToCanvas(
      filterCanvasRef.current,
      img,
      activeFilter,
      filterOpts,
      () => cancelled
    ).then((meta) => {
      if (!cancelled && meta) {
        setFilterMeta(meta);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [imageItem, activeFilter, filterOpts]);

  // Draw zoomed pixel crop inside optical loupe canvas
  useEffect(() => {
    if (!loupeMag || !loupeState.visible || !loupeCanvasRef.current) return;
    const sourceCanvas =
      activeFilter !== 'original' &&
      (compareMode === 'full' ||
        (viewportRef.current &&
          loupeState.viewX / Math.max(1, viewportRef.current.clientWidth) >= splitPct / 100))
        ? filterCanvasRef.current
        : baseCanvasRef.current;

    if (!sourceCanvas) return;
    const loupeCanvas = loupeCanvasRef.current;
    const ctx = loupeCanvas.getContext('2d');
    if (!ctx) return;

    const size = 144;
    loupeCanvas.width = size;
    loupeCanvas.height = size;
    ctx.clearRect(0, 0, size, size);
    ctx.imageSmoothingEnabled = false;

    const sampleSpan = Math.max(10, Math.round(size / loupeMag));
    const halfSpan = Math.floor(sampleSpan / 2);
    const sx = Math.max(0, Math.min(sourceCanvas.width - sampleSpan, loupeState.pixelX - halfSpan));
    const sy = Math.max(0, Math.min(sourceCanvas.height - sampleSpan, loupeState.pixelY - halfSpan));

    ctx.drawImage(sourceCanvas, sx, sy, sampleSpan, sampleSpan, 0, 0, size, size);

    if (loupeMag >= 4) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      const step = size / sampleSpan;
      for (let i = 0; i <= sampleSpan; i++) {
        const pos = Math.round(i * step) + 0.5;
        ctx.beginPath();
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, size);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, pos);
        ctx.lineTo(size, pos);
        ctx.stroke();
      }
    }

    ctx.strokeStyle = 'rgba(255, 46, 46, 0.85)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(size / 2 - 6, size / 2 - 6, 12, 12);
  }, [loupeMag, loupeState, activeFilter, compareMode, splitPct]);

  const updateSplitFromClientX = (clientX) => {
    const el = viewportRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (!rect.width) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSplitPct(Math.round(Math.min(94, Math.max(6, pct))));
  };

  const handleViewportPointerMove = (e) => {
    if (isDraggingSplit.current) {
      updateSplitFromClientX(e.clientX);
    }

    if (!loupeMag || !viewportRef.current || !baseCanvasRef.current) return;
    const activeCanvas =
      activeFilter !== 'original' ? filterCanvasRef.current : baseCanvasRef.current;
    if (!activeCanvas) return;

    const canvasRect = activeCanvas.getBoundingClientRect();
    const viewRect = viewportRef.current.getBoundingClientRect();
    if (!canvasRect.width || !canvasRect.height) return;

    const insideCanvas =
      e.clientX >= canvasRect.left &&
      e.clientX <= canvasRect.right &&
      e.clientY >= canvasRect.top &&
      e.clientY <= canvasRect.bottom;

    if (!insideCanvas) {
      setLoupeState((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      return;
    }

    const px = Math.min(
      activeCanvas.width - 1,
      Math.max(0, Math.floor(((e.clientX - canvasRect.left) / canvasRect.width) * activeCanvas.width))
    );
    const py = Math.min(
      activeCanvas.height - 1,
      Math.max(0, Math.floor(((e.clientY - canvasRect.top) / canvasRect.height) * activeCanvas.height))
    );

    const viewPct = (e.clientX - viewRect.left) / Math.max(1, viewRect.width);
    const useFiltered =
      activeFilter !== 'original' && (compareMode === 'full' || viewPct * 100 >= splitPct);
    const sampleCanvas = useFiltered ? filterCanvasRef.current : baseCanvasRef.current;
    const sampleCtx = sampleCanvas?.getContext('2d', { willReadFrequently: true });
    let rgb = [0, 0, 0];
    if (sampleCtx) {
      const pixel = sampleCtx.getImageData(px, py, 1, 1).data;
      rgb = [pixel[0], pixel[1], pixel[2]];
    }
    const hex =
      '#' + rgb.map((c) => c.toString(16).padStart(2, '0').toUpperCase()).join('');
    const luma = Math.round(0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]);

    setLoupeState({
      visible: true,
      viewX: e.clientX - viewRect.left,
      viewY: e.clientY - viewRect.top,
      viewW: viewRect.width,
      viewH: viewRect.height,
      pixelX: px,
      pixelY: py,
      rgb,
      hex,
      luma
    });
  };

  const handleCycleLoupe = () => {
    setLoupeMag((prev) => (prev === 0 ? 4 : prev === 4 ? 8 : 0));
  };

  const updateOpt = (key, val) => {
    setFilterOpts((prev) => ({ ...prev, [key]: val }));
  };

  const isSplitActive = activeFilter !== 'original' && compareMode === 'split';

  return (
    <div id="image-preview-workbench" className="mx-auto">
      <div className="glass-panel p-6 sm:p-8 rounded-[22px]">
        {/* Top File Header + Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-[var(--border-hairline)]">
          {/* File Metadata */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[var(--badge-blue-bg)] border border-[var(--border-specular)] flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5 text-[var(--badge-blue-text)]" />
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-[0.95rem] text-[var(--text-primary)] truncate max-w-[240px] sm:max-w-[300px]">
                {imageItem.name}
              </div>
              <div className="font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
                {imageItem.dimensions.width} × {imageItem.dimensions.height} px · {formatBytes(imageItem.size)}
              </div>
            </div>
          </div>

          {/* Loupe, Split & Zoom Controls */}
          <div className="flex flex-wrap items-center gap-1.5">
            {activeFilter !== 'original' && (
              <button
                type="button"
                onClick={() => setCompareMode((m) => (m === 'split' ? 'full' : 'split'))}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all flex items-center gap-1.5 ${
                  compareMode === 'split'
                    ? 'bg-[var(--badge-blue-bg)] text-[var(--badge-blue-text)] border-[var(--border-specular)]'
                    : 'bg-[var(--btn-sec-bg)] text-[var(--text-secondary)] border-[var(--border-hairline)]'
                }`}
                title="Toggle between draggable Split-Screen Wipe and Full Filter"
              >
                {compareMode === 'split' ? (
                  <>
                    <SplitSquareHorizontal className="w-3.5 h-3.5" />
                    <span>Split Wipe</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Full Layer</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={handleCycleLoupe}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all flex items-center gap-1.5 ${
                loupeMag > 0
                  ? 'bg-[#ff2e2e]/15 text-[#ff5e78] border-[#ff2e2e]/45'
                  : 'bg-[var(--btn-sec-bg)] text-[var(--text-secondary)] border-[var(--border-hairline)]'
              }`}
              title="Toggle 4× / 8× optical pixel loupe magnifier"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{loupeMag > 0 ? `Loupe ${loupeMag}×` : 'Loupe Off'}</span>
            </button>

            <button
              type="button"
              onClick={() => setZoomLevel((p) => Math.min(p + 0.25, 2.5))}
              aria-label="Zoom in"
              className="p-2 rounded-lg bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel((p) => Math.max(p - 0.25, 0.75))}
              aria-label="Zoom out"
              className="p-2 rounded-lg bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(1)}
              aria-label="Reset zoom"
              className="p-2 rounded-lg bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Sherloq Forensic DSP Filter Rail */}
        <div
          role="group"
          aria-label="Sherloq forensic inspection layers"
          className="flex flex-wrap items-center gap-1.5 mb-4"
        >
          {FILTERS.map((f) => {
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-medium border transition-all ${
                  isActive
                    ? 'bg-[#ff2e2e]/15 text-[#ff5e78] border-[#ff2e2e]/50 shadow-sm'
                    : 'bg-[var(--sub-block-bg)]/80 text-[var(--text-muted)] border-[var(--border-hairline)] hover:text-[var(--text-primary)] hover:border-[var(--border-specular)]'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Contextual Sherloq Parameter Bar */}
        {activeFilter !== 'original' && (
          <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-[var(--bg-main)]/75 border border-[var(--border-hairline)] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#ff5e78]">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Sherloq DSP</span>
              </span>

              {activeFilter === 'ela' && (
                <>
                  <label className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--text-secondary)]">
                    <span>Quality:</span>
                    {[60, 75, 85, 95].map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => updateOpt('elaQuality', q)}
                        className={`px-2 py-0.5 rounded border text-[10px] tabular-nums ${
                          filterOpts.elaQuality === q
                            ? 'border-[#ff2e2e] bg-[#ff2e2e]/15 text-[#ff5e78]'
                            : 'border-[var(--border-hairline)] text-[var(--text-muted)]'
                        }`}
                      >
                        {q}%
                      </button>
                    ))}
                  </label>
                  <label className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--text-secondary)]">
                    <span>Gain:</span>
                    {[8, 16, 28].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => updateOpt('elaScale', g)}
                        className={`px-2 py-0.5 rounded border text-[10px] tabular-nums ${
                          filterOpts.elaScale === g
                            ? 'border-[#ff2e2e] bg-[#ff2e2e]/15 text-[#ff5e78]'
                            : 'border-[var(--border-hairline)] text-[var(--text-muted)]'
                        }`}
                      >
                        {g}×
                      </button>
                    ))}
                  </label>
                  <button
                    type="button"
                    onClick={() => updateOpt('elaGrayscale', !filterOpts.elaGrayscale)}
                    className={`px-2 py-0.5 rounded border font-mono text-[10px] ${
                      filterOpts.elaGrayscale
                        ? 'border-[#ff2e2e] bg-[#ff2e2e]/15 text-[#ff5e78]'
                        : 'border-[var(--border-hairline)] text-[var(--text-muted)]'
                    }`}
                  >
                    Grayscale
                  </button>
                </>
              )}

              {activeFilter === 'noise' && (
                <>
                  <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--text-secondary)]">
                    <span>Median Gain:</span>
                    {[4, 8, 16].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => updateOpt('noiseGain', g)}
                        className={`px-2 py-0.5 rounded border text-[10px] tabular-nums ${
                          filterOpts.noiseGain === g
                            ? 'border-[#ff2e2e] bg-[#ff2e2e]/15 text-[#ff5e78]'
                            : 'border-[var(--border-hairline)] text-[var(--text-muted)]'
                        }`}
                      >
                        {g}×
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => updateOpt('noiseGrayscale', !filterOpts.noiseGrayscale)}
                    className={`px-2 py-0.5 rounded border font-mono text-[10px] ${
                      filterOpts.noiseGrayscale
                        ? 'border-[#ff2e2e] bg-[#ff2e2e]/15 text-[#ff5e78]'
                        : 'border-[var(--border-hairline)] text-[var(--text-muted)]'
                    }`}
                  >
                    Luma Only
                  </button>
                </>
              )}

              {activeFilter === 'bitplane' && (
                <>
                  <div className="inline-flex items-center gap-1 font-mono text-[11px] text-[var(--text-secondary)]">
                    <span>Bit:</span>
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => updateOpt('bitIndex', b)}
                        className={`px-1.5 py-0.5 rounded border text-[10px] tabular-nums ${
                          filterOpts.bitIndex === b
                            ? 'border-[#ff2e2e] bg-[#ff2e2e]/15 text-[#ff5e78]'
                            : 'border-[var(--border-hairline)] text-[var(--text-muted)]'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                  <div className="inline-flex items-center gap-1 font-mono text-[11px] text-[var(--text-secondary)]">
                    {[
                      { id: 'lum', l: 'Lum' },
                      { id: 'r', l: 'R' },
                      { id: 'g', l: 'G' },
                      { id: 'b', l: 'B' }
                    ].map((ch) => (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => updateOpt('bitChannel', ch.id)}
                        className={`px-2 py-0.5 rounded border text-[10px] ${
                          filterOpts.bitChannel === ch.id
                            ? 'border-[#ff2e2e] bg-[#ff2e2e]/15 text-[#ff5e78]'
                            : 'border-[var(--border-hairline)] text-[var(--text-muted)]'
                        }`}
                      >
                        {ch.l}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {activeFilter === 'pca' && (
                <>
                  <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--text-secondary)]">
                    <span>Axis:</span>
                    {[0, 1, 2].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => updateOpt('pcaComponent', c)}
                        className={`px-2 py-0.5 rounded border text-[10px] tabular-nums ${
                          filterOpts.pcaComponent === c
                            ? 'border-[#ff2e2e] bg-[#ff2e2e]/15 text-[#ff5e78]'
                            : 'border-[var(--border-hairline)] text-[var(--text-muted)]'
                        }`}
                      >
                        PC{c + 1}
                      </button>
                    ))}
                  </div>
                  <div className="inline-flex items-center gap-1 font-mono text-[11px]">
                    {['distance', 'projection'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => updateOpt('pcaMode', m)}
                        className={`px-2 py-0.5 rounded border text-[10px] capitalize ${
                          filterOpts.pcaMode === m
                            ? 'border-[#ff2e2e] bg-[#ff2e2e]/15 text-[#ff5e78]'
                            : 'border-[var(--border-hairline)] text-[var(--text-muted)]'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {activeFilter === 'wavelet' && (
                <span className="font-mono text-[11px] text-[var(--text-muted)]">
                  2D Haar DWT Subbands: TL=LL · TR=HL · BL=LH · BR=HH Detail
                </span>
              )}

              {activeFilter === 'edges' && (
                <span className="font-mono text-[11px] text-[var(--text-muted)]">
                  Sobel gradient boundary inspection (synthetic vs. optical edge anti-aliasing)
                </span>
              )}
            </div>

            {/* Live Computed DSP Readout */}
            <div className="font-mono text-[10.5px] text-[#34d399] tabular-nums">
              {activeFilter === 'ela' && filterMeta.elaMeanDelta != null && (
                <span>MEAN Δ: {filterMeta.elaMeanDelta}</span>
              )}
              {activeFilter === 'bitplane' && filterMeta.bitEntropy != null && (
                <span>ENTROPY (BIT {filterOpts.bitIndex}): {filterMeta.bitEntropy} bits</span>
              )}
              {activeFilter === 'pca' && Array.isArray(filterMeta.pcaVariance) && (
                <span>VAR: {filterMeta.pcaVariance.join('% / ')}%</span>
              )}
            </div>
          </div>
        )}

        {/* Interactive Inspection Canvas Viewport */}
        <div
          ref={viewportRef}
          onPointerMove={handleViewportPointerMove}
          onPointerUp={() => {
            isDraggingSplit.current = false;
          }}
          onPointerCancel={() => {
            isDraggingSplit.current = false;
          }}
          onPointerLeave={() => {
            isDraggingSplit.current = false;
            setLoupeState((prev) => (prev.visible ? { ...prev, visible: false } : prev));
          }}
          className={`relative min-h-[340px] max-h-[540px] rounded-2xl overflow-hidden bg-[#060B17] border border-[var(--border-hairline)] flex items-center justify-center select-none ${
            loupeMag > 0 ? 'cursor-crosshair' : ''
          }`}
        >
          {isAnalyzing && <div className="scan-laser-line" />}

          {/* Zoom Wrapper */}
          <div
            style={{
              transform: `scale(${zoomLevel})`,
              transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            className="relative flex items-center justify-center max-w-full max-h-full"
          >
            {/* Base Original Layer */}
            <canvas
              ref={baseCanvasRef}
              className="max-w-full max-h-[480px] object-contain rounded-lg block"
            />

            {/* Filtered Overlay Layer (full or split-clipped) */}
            <canvas
              ref={filterCanvasRef}
              style={
                activeFilter === 'original'
                  ? { display: 'none' }
                  : isSplitActive
                    ? { clipPath: `inset(0 0 0 ${splitPct}%)` }
                    : undefined
              }
              className="absolute inset-0 w-full h-full object-contain rounded-lg block pointer-events-none"
            />
          </div>

          {/* Draggable Split Wipe Divider */}
          {isSplitActive && (
            <div
              role="slider"
              tabIndex={0}
              aria-label="Comparison divider between original image and forensic filter"
              aria-valuemin={6}
              aria-valuemax={94}
              aria-valuenow={splitPct}
              onPointerDown={(e) => {
                e.stopPropagation();
                isDraggingSplit.current = true;
                e.currentTarget.setPointerCapture?.(e.pointerId);
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') {
                  e.preventDefault();
                  setSplitPct((p) => Math.max(6, p - 4));
                } else if (e.key === 'ArrowRight') {
                  e.preventDefault();
                  setSplitPct((p) => Math.min(94, p + 4));
                }
              }}
              style={{ left: `${splitPct}%` }}
              className="absolute inset-y-0 -translate-x-1/2 z-20 w-8 flex items-center justify-center cursor-ew-resize group focus:outline-none"
            >
              <div className="w-[2px] h-full bg-[#ff2e2e] shadow-[0_0_12px_rgba(255,46,46,0.85)]" />
              <div className="absolute px-2 py-1 rounded-full bg-[#0d0e12]/90 border border-[#ff5e78]/70 text-[10px] font-mono text-[#ffafbd] shadow-lg whitespace-nowrap">
                {splitPct}%
              </div>
            </div>
          )}

          {/* Optical Pixel Loupe Magnifier */}
          {loupeMag > 0 && loupeState.visible && (
            <div
              className="pointer-events-none absolute z-30 flex flex-col items-center gap-1.5"
              style={{
                left: Math.min(
                  Math.max(12, loupeState.viewX + 18),
                  Math.max(12, loupeState.viewW - 166)
                ),
                top: Math.min(
                  Math.max(12, loupeState.viewY - 72),
                  Math.max(12, loupeState.viewH - 196)
                )
              }}
            >
              <div className="w-[144px] h-[144px] rounded-full overflow-hidden border-2 border-[#ff2e2e] shadow-[0_12px_32px_rgba(0,0,0,0.65)] bg-[#0d0e12]">
                <canvas ref={loupeCanvasRef} className="w-full h-full block" />
              </div>
              <div className="rounded-xl bg-[#0d0e12]/92 border border-[#ff5e78]/45 px-2.5 py-1 backdrop-blur-md shadow-lg text-[10px] font-mono text-[#fcfcfc] tabular-nums whitespace-nowrap">
                <span>({loupeState.pixelX},{loupeState.pixelY})</span>
                <span className="mx-1.5 text-[#ff5e78]">{loupeState.hex}</span>
                <span className="text-[#a1a1aa]">L:{loupeState.luma}</span>
              </div>
            </div>
          )}

          {/* Bottom-left Telemetry Watermark Pill */}
          <div className="pointer-events-none absolute bottom-3 left-3 flex flex-wrap items-center gap-2 rounded-full bg-[#0d0e12]/88 border border-[#27272a] px-3.5 py-1.5 backdrop-blur-md font-mono text-[11px] text-[#ffafbd] tabular-nums">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff2e2e]" />
            <span>
              {isSplitActive
                ? `ORIGINAL | ${activeFilter.toUpperCase()} (${splitPct}%)`
                : `LAYER: ${activeFilter.toUpperCase()}`}
            </span>
            <span className="text-slate-500">|</span>
            <span>ZOOM: {Math.round(zoomLevel * 100)}%</span>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6">
          <button
            type="button"
            onClick={onRemove}
            disabled={isAnalyzing}
            className="btn-danger-outline"
          >
            <Trash2 className="w-4 h-4" />
            <span>Remove Image</span>
          </button>

          <button
            type="button"
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="btn-primary px-8 py-3.5 text-base"
          >
            <Scan className="w-4.5 h-4.5" />
            <span>{isAnalyzing ? 'Analyzing Multi-Signal Forensics...' : 'Run Forensic Analysis'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
