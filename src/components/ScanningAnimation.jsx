import React from 'react';
import { ShieldCheck, Cpu, Terminal, Eye, Sparkles, AlertCircle } from 'lucide-react';

export default function ScanningAnimation({ progress = 0, currentStep = 'Initializing forensic sandbox...' }) {
  // SVG circular progress calculation
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div style={{ maxWidth: '680px', margin: '32px auto 0 auto' }}>
      <div className="glass-panel glass-panel-glow" style={{
        padding: '32px 24px',
        textAlign: 'center',
        background: 'rgba(11, 15, 28, 0.88)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Cyber Ring Scanner */}
        <div style={{
          position: 'relative',
          width: '124px',
          height: '124px',
          margin: '0 auto 24px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* SVG Progress Circle */}
          <svg width="124" height="124" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
            <circle
              cx="62"
              cy="62"
              r={radius}
              stroke="rgba(56, 189, 248, 0.15)"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="62"
              cy="62"
              r={radius}
              stroke="url(#scanGrad)"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.35s ease' }}
            />
            <defs>
              <linearGradient id="scanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#00f0ff" />
                <stop offset="50%" stop-color="#38bdf8" />
                <stop offset="100%" stop-color="#a855f7" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Percentage & Icon */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{
              fontSize: '1.45rem',
              fontWeight: '800',
              fontFamily: 'var(--font-mono)',
              color: '#ffffff',
              letterSpacing: '-0.02em'
            }}>
              {Math.round(progress)}%
            </span>
            <span style={{
              fontSize: '0.62rem',
              fontFamily: 'var(--font-mono)',
              color: '#38bdf8',
              letterSpacing: '0.05em'
            }}>
              AUDITING
            </span>
          </div>
        </div>

        {/* Status Heading */}
        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: '700',
          marginBottom: '8px',
          color: '#f8fafc'
        }}>
          Executing Multi-Spectrum Forensic Audit
        </h3>

        {/* Current Pipeline Step */}
        <p style={{
          fontSize: '0.88rem',
          fontFamily: 'var(--font-mono)',
          color: '#38bdf8',
          marginBottom: '20px',
          minHeight: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#00f0ff',
            boxShadow: '0 0 10px #00f0ff',
            display: 'inline-block'
          }} />
          <span>{currentStep}</span>
        </p>

        {/* Linear Progress Indicator */}
        <div style={{
          width: '100%',
          height: '6px',
          background: 'rgba(30, 41, 59, 0.6)',
          borderRadius: '3px',
          overflow: 'hidden',
          marginBottom: '18px'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #00f0ff, #38bdf8, #a855f7)',
            boxShadow: '0 0 12px #00f0ff',
            transition: 'width 0.35s ease'
          }} />
        </div>

        {/* Pipeline Phase Indicators */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          textAlign: 'center'
        }}>
          {[
            { label: 'Container', active: progress >= 20 },
            { label: 'DCT Spectrum', active: progress >= 50 },
            { label: 'Texture Matrix', active: progress >= 75 },
            { label: 'Synthesis', active: progress >= 95 }
          ].map((phase, idx) => (
            <div 
              key={idx}
              style={{
                padding: '6px 4px',
                borderRadius: '6px',
                background: phase.active ? 'rgba(0, 240, 255, 0.12)' : 'rgba(15, 23, 42, 0.5)',
                border: phase.active ? '1px solid rgba(0, 240, 255, 0.35)' : '1px solid rgba(255, 255, 255, 0.05)',
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                color: phase.active ? '#38bdf8' : 'var(--text-muted)',
                fontWeight: phase.active ? '600' : '400',
                transition: 'all 0.25s ease'
              }}
            >
              {phase.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
