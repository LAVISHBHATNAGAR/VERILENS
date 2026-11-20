import React from 'react';
import { ShieldCheck, Cpu, Terminal, Eye, Sparkles } from 'lucide-react';

export default function ScanningAnimation({ progress = 0, currentStep = 'Initializing forensic sandbox...' }) {
  // SVG circular progress calculation
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div style={{ maxWidth: '680px', margin: '32px auto 0 auto' }}>
      <div className="glass-panel glass-panel-glow" style={{
        padding: '36px 24px',
        textAlign: 'center',
        background: 'rgba(12, 51, 85, 0.88)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Cyber Ring Scanner */}
        <div style={{
          position: 'relative',
          width: '130px',
          height: '130px',
          margin: '0 auto 24px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* SVG Progress Circle */}
          <svg width="130" height="130" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
            <circle
              cx="65"
              cy="65"
              r={radius}
              stroke="rgba(248, 248, 255, 0.12)"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="65"
              cy="65"
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
                <stop offset="0%" stopColor="#D2F500" />
                <stop offset="100%" stopColor="#ffffff" />
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
              fontSize: '1.55rem',
              fontWeight: '800',
              fontFamily: 'var(--font-mono)',
              color: 'var(--ghost-white)',
              letterSpacing: '-0.02em'
            }}>
              {Math.round(progress)}%
            </span>
            <span style={{
              fontSize: '0.62rem',
              fontFamily: 'var(--font-mono)',
              color: '#D2F500',
              fontWeight: '700',
              letterSpacing: '0.06em'
            }}>
              AUDITING
            </span>
          </div>
        </div>

        {/* Status Heading */}
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          marginBottom: '8px',
          color: 'var(--ghost-white)'
        }}>
          Executing Multi-Spectrum Forensic Audit
        </h3>

        {/* Current Pipeline Step */}
        <p style={{
          fontSize: '0.9rem',
          fontFamily: 'var(--font-mono)',
          color: '#D2F500',
          marginBottom: '22px',
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
            background: '#D2F500',
            boxShadow: '0 0 10px #D2F500',
            display: 'inline-block'
          }} />
          <span>{currentStep}</span>
        </p>

        {/* Linear Progress Indicator */}
        <div style={{
          width: '100%',
          height: '6px',
          background: 'rgba(5, 24, 41, 0.7)',
          borderRadius: '3px',
          overflow: 'hidden',
          marginBottom: '20px'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #D2F500 0%, #ffffff 100%)',
            boxShadow: '0 0 14px #D2F500',
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
                background: phase.active ? 'rgba(210, 245, 0, 0.14)' : 'rgba(5, 24, 41, 0.55)',
                border: phase.active ? '1px solid rgba(210, 245, 0, 0.4)' : '1px solid rgba(248, 248, 255, 0.06)',
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                color: phase.active ? '#D2F500' : 'var(--ghost-white-muted)',
                fontWeight: phase.active ? '700' : '500',
                transition: 'all 0.2s ease'
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
