import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Radar, Waves } from 'lucide-react';

gsap.registerPlugin(useGSAP);

/**
 * Animated Calibrated Verdict Arc Gauge with Uncertainty Zone indicator.
 */
export function CalibratedVerdictGauge({ aiScore = 50, realScore = 50, confidence = 40, verdictLevel = 'inconclusive' }) {
  const [displayAi, setDisplayAi] = useState(aiScore);
  const [displayConf, setDisplayConf] = useState(confidence);
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const counter = { ai: 0, conf: 0 };
        gsap.to(counter, {
          ai: aiScore,
          conf: confidence,
          duration: 0.9,
          ease: 'power3.out',
          onUpdate: () => {
            setDisplayAi(Math.round(counter.ai));
            setDisplayConf(Math.round(counter.conf));
          }
        });
      });
      mm.add('(prefers-reduced-motion: reduce)', () => {
        setDisplayAi(aiScore);
        setDisplayConf(confidence);
      });
      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [aiScore, confidence] }
  );

  const radius = 78;
  const strokeWidth = 12;
  const cx = 100;
  const cy = 92;
  const halfCircumference = Math.PI * radius;
  const clampedAi = Math.max(0, Math.min(100, aiScore));
  const aiDash = (clampedAi / 100) * halfCircumference;

  // Angle for indicator needle (-90 deg = 0% AI / Real; +90 deg = 100% AI)
  const needleAngleDeg = -90 + (clampedAi / 100) * 180;

  const accentHex =
    verdictLevel === 'ai'
      ? '#EF4444'
      : verdictLevel === 'real'
        ? '#10B981'
        : '#F59E0B';

  return (
    <div
      ref={containerRef}
      className="rounded-2xl bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] p-4 sm:p-5 flex flex-col items-center"
    >
      <div className="w-full flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] mb-1">
        <span className="text-emerald-500 font-medium">AUTHENTIC</span>
        <span className="text-amber-500 font-medium">AMBIGUOUS BAND</span>
        <span className="text-red-500 font-medium">SYNTHETIC</span>
      </div>

      <svg viewBox="0 0 200 116" className="w-full max-w-[260px] overflow-visible" aria-label={`AI likelihood ${aiScore} percent, Authentic likelihood ${realScore} percent`}>
        <defs>
          <linearGradient id="verdictArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="45%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>

        {/* Background track */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="rgba(148, 163, 184, 0.2)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Subtle spectrum arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="url(#verdictArcGrad)"
          strokeOpacity="0.28"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Active filled arc up to aiScore */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke={accentHex}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${aiDash} ${halfCircumference}`}
          style={{ transition: 'stroke-dasharray 750ms cubic-bezier(0.16, 1, 0.3, 1)' }}
        />

        {/* Ambiguous zone markers (40% - 60%) */}
        <circle cx={cx - radius * Math.cos(Math.PI * 0.4)} cy={cy - radius * Math.sin(Math.PI * 0.4)} r="2.2" fill="#F59E0B" />
        <circle cx={cx - radius * Math.cos(Math.PI * 0.6)} cy={cy - radius * Math.sin(Math.PI * 0.6)} r="2.2" fill="#F59E0B" />

        {/* Needle */}
        <g transform={`translate(${cx}, ${cy}) rotate(${needleAngleDeg})`} style={{ transition: 'transform 750ms cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <line x1="0" y1="4" x2="0" y2={-(radius - 14)} stroke={accentHex} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="0" cy="0" r="5" fill={accentHex} />
          <circle cx="0" cy="0" r="2.2" fill="#FFFFFF" />
        </g>

        {/* Numeric Readout */}
        <text x={cx} y={cy + 20} textAnchor="middle" fill="var(--text-primary)" fontFamily="var(--font-mono)" fontSize="19" fontWeight="600" className="tabular-nums">
          {displayAi}% AI
        </text>
      </svg>

      {/* Score Strip */}
      <div className="w-full grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-[var(--border-hairline)] text-center">
        <div>
          <div className="font-mono text-[10px] text-[var(--text-muted)]">P(AI)</div>
          <div className="font-mono text-sm font-semibold text-[var(--error)] tabular-nums">{displayAi}%</div>
        </div>
        <div>
          <div className="font-mono text-[10px] text-[var(--text-muted)]">CONFIDENCE</div>
          <div className="font-mono text-sm font-semibold text-[var(--text-primary)] tabular-nums">{displayConf}%</div>
        </div>
        <div>
          <div className="font-mono text-[10px] text-[var(--text-muted)]">P(REAL)</div>
          <div className="font-mono text-sm font-semibold text-[var(--success)] tabular-nums">{realScore}%</div>
        </div>
      </div>
    </div>
  );
}

/**
 * 5-Axis Forensic Radar Chart with interactive vertex inspection + accessible value readout.
 */
export function ForensicRadarChart({ pillars = [] }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const normalizedAxes = normalizeAxes(pillars);
  const cx = 150;
  const cy = 132;
  const maxR = 82;
  const count = normalizedAxes.length;

  const pointFor = (idx, pct) => {
    const angle = -Math.PI / 2 + (idx * 2 * Math.PI) / count;
    const r = (Math.max(6, Math.min(100, pct)) / 100) * maxR;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      labelX: cx + (maxR + 24) * Math.cos(angle),
      labelY: cy + (maxR + 20) * Math.sin(angle)
    };
  };

  const polygonPoints = normalizedAxes
    .map((axis, idx) => {
      const pt = pointFor(idx, axis.score);
      return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
    })
    .join(' ');

  const rings = [25, 50, 75, 100];

  return (
    <div className="glass-panel p-5 sm:p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[var(--badge-blue-bg)] flex items-center justify-center">
            <Radar className="w-4 h-4 text-[var(--badge-blue-text)]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              5-Axis Forensic Anomaly Radar
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Higher radius = stronger synthetic signal per domain
            </p>
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-center my-1">
        <svg viewBox="0 0 300 264" className="w-full max-w-[310px]" role="img" aria-label="5-axis forensic anomaly radar chart">
          {/* Concentric pentagon grid rings */}
          {rings.map((ring) => {
            const pts = normalizedAxes
              .map((_, i) => {
                const pt = pointFor(i, ring);
                return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
              })
              .join(' ');
            return (
              <polygon
                key={ring}
                points={pts}
                fill="none"
                stroke="rgba(148, 163, 184, 0.22)"
                strokeWidth={ring === 50 ? '1.2' : '0.8'}
                strokeDasharray={ring === 50 ? '3 3' : undefined}
              />
            );
          })}

          {/* Axis spokes & labels */}
          {normalizedAxes.map((axis, idx) => {
            const outer = pointFor(idx, 100);
            const anchor =
              outer.labelX < cx - 14 ? 'end' : outer.labelX > cx + 14 ? 'start' : 'middle';
            return (
              <g key={axis.shortLabel}>
                <line
                  x1={cx}
                  y1={cy}
                  x2={outer.x}
                  y2={outer.y}
                  stroke="rgba(148, 163, 184, 0.2)"
                  strokeWidth="1"
                />
                <text
                  x={outer.labelX}
                  y={outer.labelY}
                  textAnchor={anchor}
                  dominantBaseline="middle"
                  fill="var(--text-muted)"
                  fontFamily="var(--font-mono)"
                  fontSize="9.5"
                  fontWeight="500"
                >
                  {axis.shortLabel}
                </text>
              </g>
            );
          })}

          {/* Data polygon */}
          <polygon
            points={polygonPoints}
            fill="rgba(255, 46, 46, 0.22)"
            stroke="#ff5e78"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Interactive Vertices */}
          {normalizedAxes.map((axis, idx) => {
            const pt = pointFor(idx, axis.score);
            const color =
              axis.color === 'red' ? '#EF4444' : axis.color === 'emerald' ? '#10B981' : '#F59E0B';
            const isHovered = hoveredIdx === idx;
            return (
              <g
                key={axis.shortLabel}
                tabIndex={0}
                role="button"
                aria-label={`${axis.name}: ${axis.score}% (${axis.status})`}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onFocus={() => setHoveredIdx(idx)}
                onBlur={() => setHoveredIdx(null)}
                className="cursor-pointer focus:outline-none"
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 7 : 4.5}
                  fill={color}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  style={{ transition: 'r 150ms ease' }}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Accessible Hover / Summary Strip */}
      <div className="rounded-xl bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] px-3.5 py-2.5 text-xs font-mono flex flex-wrap items-center justify-between gap-2">
        {hoveredIdx !== null && normalizedAxes[hoveredIdx] ? (
          <>
            <span className="text-[var(--text-primary)] font-medium truncate">
              {normalizedAxes[hoveredIdx].name}
            </span>
            <span className="text-[var(--blue-light)] tabular-nums font-semibold">
              {normalizedAxes[hoveredIdx].score}% · {normalizedAxes[hoveredIdx].status}
            </span>
          </>
        ) : (
          <div className="w-full grid grid-cols-5 gap-1 text-center">
            {normalizedAxes.map((ax) => (
              <div key={ax.shortLabel} className="truncate">
                <span className="block text-[9px] text-[var(--text-muted)]">{ax.shortLabel}</span>
                <span className="text-[11px] font-semibold text-[var(--text-primary)] tabular-nums">
                  {ax.score}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Radial 2D Fourier Power Decay & Noise Floor Visualizer using real measured telemetry.
 */
export function SpectralDecayChart({ result }) {
  const telemetry = result?.telemetry || {};
  const fourier = telemetry.fourier || {};
  const noise = telemetry.noise || {};
  const gradients = telemetry.gradients || {};

  // Fallback parse from signalsSummary if reading older cached result
  const parsedSlope =
    typeof fourier.avgDecaySlope === 'number'
      ? fourier.avgDecaySlope
      : parseFloat((result?.signalsSummary?.fourier || '').match(/Decay:\s*(-?[\d.]+)/)?.[1] || '-1.8');

  const periodicSpikes =
    typeof fourier.avgPeriodicSpikes === 'number' ? fourier.avgPeriodicSpikes : 0.6;

  // Build SVG log-log power curve from f = 1..16
  const width = 320;
  const height = 152;
  const padX = 24;
  const padY = 18;
  const plotW = width - padX * 2;
  const plotH = height - padY * 2;

  const makePath = (slopeVal, includeSpike = false) => {
    const points = [];
    for (let i = 0; i <= 24; i++) {
      const t = i / 24;
      const freq = 1 + t * 15;
      // Normalized log power drop
      const rawDrop = Math.log(freq) / Math.log(16); // 0..1
      const slopeFactor = Math.min(1.4, Math.max(0.25, Math.abs(slopeVal) / 2.2));
      let normY = rawDrop * slopeFactor;
      if (includeSpike && periodicSpikes > 1.2 && (i === 15 || i === 19)) {
        normY = Math.max(0.08, normY - Math.min(0.45, periodicSpikes * 0.12));
      }
      const x = padX + t * plotW;
      const y = padY + Math.min(0.95, Math.max(0.05, normY)) * plotH;
      points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return points.join(' ');
  };

  const naturalPath = makePath(-1.85, false);
  const measuredPath = makePath(Number.isFinite(parsedSlope) ? parsedSlope : -1.8, true);

  return (
    <div className="glass-panel p-5 sm:p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[var(--badge-blue-bg)] flex items-center justify-center">
            <Waves className="w-4 h-4 text-[var(--badge-blue-text)]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              2D Fourier Radial Power Falloff
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Measured P(f) slope vs natural 1/f⁻¹·⁸ camera baseline
            </p>
          </div>
        </div>

        <span className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] text-[var(--text-primary)] tabular-nums">
          α = {Number.isFinite(parsedSlope) ? parsedSlope.toFixed(2) : 'N/A'}
        </span>
      </div>

      {/* Log-Log Spectrum SVG */}
      <div className="rounded-xl bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] p-3">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img" aria-label="2D Fourier radial power decay curve">
          {/* Axes */}
          <line x1={padX} y1={padY} x2={padX} y2={height - padY} stroke="rgba(148,163,184,0.3)" strokeWidth="1" />
          <line x1={padX} y1={height - padY} x2={width - padX} y2={height - padY} stroke="rgba(148,163,184,0.3)" strokeWidth="1" />

          {/* Natural 1/f baseline */}
          <path
            d={naturalPath}
            fill="none"
            stroke="#10B981"
            strokeWidth="1.6"
            strokeDasharray="4 4"
            opacity="0.85"
          />

          {/* Measured radial spectrum */}
          <path
            d={measuredPath}
            fill="none"
            stroke={periodicSpikes > 2.0 ? '#ff2e2e' : '#ff5e78'}
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          <text x={padX + 4} y={padY + 9} fill="var(--text-muted)" fontFamily="var(--font-mono)" fontSize="8">
            LOG P(f)
          </text>
          <text x={width - padX} y={height - 4} textAnchor="end" fill="var(--text-muted)" fontFamily="var(--font-mono)" fontSize="8">
            SPATIAL FREQ (CYCLES/PX) →
          </text>
        </svg>

        <div className="flex flex-wrap items-center justify-between gap-2 mt-1.5 text-[10px] font-mono text-[var(--text-muted)]">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-500 inline-block" />
            <span>Optical 1/f Baseline (-1.85)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className={`w-3 h-0.5 inline-block ${periodicSpikes > 2.0 ? 'bg-[#ff2e2e]' : 'bg-[#ff5e78]'}`} />
            <span>Measured Spectrum ({periodicSpikes.toFixed(2)} dB spikes)</span>
          </span>
        </div>
      </div>

      {/* Measured Physical Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
        <div className="rounded-xl bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] px-2.5 py-2">
          <div className="font-mono text-[10px] text-[var(--text-muted)]">NOISE VAR</div>
          <div className="font-mono text-xs font-semibold text-[var(--text-primary)] tabular-nums mt-0.5">
            {noise.avgNoiseVariance ?? '—'}
          </div>
        </div>
        <div className="rounded-xl bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] px-2.5 py-2">
          <div className="font-mono text-[10px] text-[var(--text-muted)]">ZERO-FLOOR</div>
          <div className="font-mono text-xs font-semibold text-[var(--text-primary)] tabular-nums mt-0.5">
            {noise.zeroNoiseRatio != null ? `${noise.zeroNoiseRatio}%` : '—'}
          </div>
        </div>
        <div className="rounded-xl bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] px-2.5 py-2">
          <div className="font-mono text-[10px] text-[var(--text-muted)]">JPEG BLOCK</div>
          <div className="font-mono text-xs font-semibold text-[var(--text-primary)] tabular-nums mt-0.5">
            {noise.jpegBlockiness ?? '—'}
          </div>
        </div>
        <div className="rounded-xl bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] px-2.5 py-2">
          <div className="font-mono text-[10px] text-[var(--text-muted)]">DISPERSION</div>
          <div className="font-mono text-xs font-semibold text-[var(--text-primary)] tabular-nums mt-0.5">
            {gradients.avgDispersion != null ? `${gradients.avgDispersion} px` : '—'}
          </div>
        </div>
      </div>
    </div>
  );
}

function normalizeAxes(pillars) {
  const defaults = [
    { shortLabel: 'DL ViT', match: 'deep learning', fallbackName: 'Deep Learning Vision Model' },
    { shortLabel: 'Visual', match: 'visual content', fallbackName: 'Visual Content & Composition' },
    { shortLabel: '2D FFT', match: 'fourier', fallbackName: '2D Fourier Frequency Spectrum' },
    { shortLabel: 'CMOS', match: 'noise', fallbackName: 'CMOS Sensor Noise Floor' },
    { shortLabel: 'Optics', match: 'optical', fallbackName: 'Optical Dispersion & Provenance' }
  ];

  return defaults.map((def) => {
    const found =
      pillars.find((p) => (p.name || '').toLowerCase().includes(def.match)) ||
      (def.shortLabel === 'Optics'
        ? pillars.find((p) => (p.name || '').toLowerCase().includes('provenance'))
        : null);

    return {
      shortLabel: def.shortLabel,
      name: found?.name || def.fallbackName,
      score: typeof found?.score === 'number' ? found.score : 50,
      status: found?.status || 'Baseline',
      color: found?.color || 'amber'
    };
  });
}
