import React, { useEffect, useRef } from 'react';
import { ShieldCheck, Activity } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function ScanningAnimation({
  progress = 0,
  currentStep = 'Initializing forensic sandbox...'
}) {
  const waveCanvasRef = useRef(null);
  const progressRef = useRef(progress);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const canvas = waveCanvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let rafId = 0;
    let phase = 0;

    const drawWave = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Subtle center baseline
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      const amp = 8 + (progressRef.current / 100) * 10;

      // Primary Fourier trace
      ctx.strokeStyle = '#ff2e2e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 3) {
        const norm = x / w;
        const envelope = Math.sin(norm * Math.PI);
        const y =
          h / 2 +
          (Math.sin(norm * 18 + phase) * amp * 0.65 +
            Math.cos(norm * 37 - phase * 1.4) * amp * 0.35) *
            envelope;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Secondary PRNU residual trace
      ctx.strokeStyle = 'rgba(255, 94, 120, 0.72)';
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const norm = x / w;
        const envelope = Math.sin(norm * Math.PI);
        const y =
          h / 2 +
          Math.sin(norm * 26 - phase * 0.9) * amp * 0.45 * envelope;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    const tick = () => {
      if (document.hidden || reducedMotion) return;
      phase += 0.08;
      drawWave();
      rafId = requestAnimationFrame(tick);
    };

    drawWave();
    if (!reducedMotion) {
      rafId = requestAnimationFrame(tick);
    }

    const handleVisibility = () => {
      if (!document.hidden && !reducedMotion) {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(rafId);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [reducedMotion]);

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const phases = [
    { label: 'Container & SHA', active: progress >= 15 },
    { label: '2D Fourier FFT', active: progress >= 35 },
    { label: 'CMOS Noise Floor', active: progress >= 60 },
    { label: 'Ensemble Fusion', active: progress >= 85 }
  ];

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <div className="glass-panel p-7 sm:p-9 text-center relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#e61919] via-[#ff2e2e] to-[#ffafbd]"
        />

        {/* Circular Telemetry Progress Gauge */}
        <div className="relative w-32 h-32 mx-auto mb-5 flex items-center justify-center">
          <svg width="128" height="128" className="-rotate-90 absolute inset-0" aria-hidden="true">
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="var(--sub-block-bg)"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="url(#scanCrimsonPulse)"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 280ms ease' }}
            />
            <defs>
              <linearGradient id="scanCrimsonPulse" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff2e2e" />
                <stop offset="100%" stopColor="#ff5e78" />
              </linearGradient>
            </defs>
          </svg>
          <div className="flex flex-col items-center">
            <span className="font-mono text-2xl font-semibold text-[var(--text-primary)] tabular-nums">
              {Math.round(progress)}%
            </span>
            <span className="font-mono text-[10px] tracking-widest text-[var(--cyan-accent)] uppercase">
              AUDITING
            </span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1.5">
          Executing Multi-Signal Forensic Pipeline
        </h3>

        <p className="font-mono text-xs sm:text-sm text-[var(--blue-light)] flex items-center justify-center gap-2 min-h-[24px] mb-4">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.85)]" />
          <span>{currentStep}</span>
        </p>

        {/* Live Signal Oscilloscope Canvas */}
        <div className="rounded-xl bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] p-2.5 mb-5">
          <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] mb-1 px-1">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-[var(--cyan-accent)]" />
              <span>SPECTRAL &amp; PRNU SIGNAL TRACE</span>
            </span>
            <span className="tabular-nums">BUFFER: 1024px MAX</span>
          </div>
          <canvas ref={waveCanvasRef} width={520} height={54} className="w-full h-[54px] block" />
        </div>

        {/* Stage Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {phases.map((phase, idx) => (
            <div
              key={idx}
              className={`px-2.5 py-2 rounded-full font-mono text-[11px] font-medium border transition-colors ${
                phase.active
                  ? 'bg-[var(--badge-blue-bg)] text-[var(--badge-blue-text)] border-[var(--border-specular)]'
                  : 'bg-[var(--sub-block-bg)] text-[var(--text-muted)] border-[var(--border-hairline)]'
              }`}
            >
              {phase.label}
            </div>
          ))}
        </div>

        <div className="mt-5 inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--success)]" />
          <span>Encrypted TLS transport · Zero persistent image storage</span>
        </div>
      </div>
    </div>
  );
}
