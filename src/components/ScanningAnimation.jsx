import React from 'react';
import { ShieldCheck, Cpu, Activity } from 'lucide-react';

export default function ScanningAnimation({ progress = 0, currentStep = 'Initializing forensic sandbox...' }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div style={{ maxWidth: '640px', margin: '32px auto 0 auto' }}>
      <div className="glass-panel" style={{
        padding: '38px 26px',
        textAlign: 'center',
        borderRadius: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle blue accent at top */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
          background: 'linear-gradient(90deg, #2563EB 0%, #60A5FA 50%, #2563EB 100%)'
        }} />

        {/* Circular Progress Ring */}
        <div style={{
          position: 'relative',
          width: '130px',
          height: '130px',
          margin: '0 auto 24px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg width="130" height="130" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
            <circle cx="65" cy="65" r={radius} stroke="var(--sub-block-bg)" strokeWidth="6" fill="transparent" />
            <circle
              cx="65" cy="65" r={radius}
              stroke="url(#blueGrad)"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.35s ease' }}
            />
            <defs>
              <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#60A5FA" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{
              fontSize: '1.6rem',
              fontWeight: '500',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em'
            }}>
              {Math.round(progress)}%
            </span>
            <span style={{
              fontSize: '0.62rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--blue-light)',
              fontWeight: '500',
              letterSpacing: '0.06em'
            }}>
              SCANNING
            </span>
          </div>
        </div>

        {/* Title (Plus Jakarta Sans, 700) */}
        <h3 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.2rem',
          fontWeight: '700',
          marginBottom: '8px',
          color: 'var(--text-primary)'
        }}>
          Running Forensic Analysis
        </h3>

        {/* Current step (IBM Plex Mono, 400) */}
        <p style={{
          fontSize: '0.88rem',
          fontFamily: 'var(--font-mono)',
          fontWeight: '400',
          color: 'var(--blue-light)',
          marginBottom: '22px',
          minHeight: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <span style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: 'var(--blue-light)', boxShadow: '0 0 8px rgba(37,99,235,0.5)', display: 'inline-block'
          }} />
          <span>{currentStep}</span>
        </p>

        {/* Linear progress bar (Pill rounded) */}
        <div style={{
          width: '100%', height: '6px', background: 'var(--sub-block-bg)',
          borderRadius: '9999px', overflow: 'hidden', marginBottom: '22px'
        }}>
          <div style={{
            width: `${progress}%`, height: '100%',
            background: 'linear-gradient(90deg, #2563EB 0%, #60A5FA 100%)',
            transition: 'width 0.35s ease',
            borderRadius: '9999px'
          }} />
        </div>

        {/* Phase indicators (Pills, borderless) */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center'
        }}>
          {[
            { label: 'Container', active: progress >= 20 },
            { label: 'DCT Spectrum', active: progress >= 50 },
            { label: 'Noise Floor', active: progress >= 75 },
            { label: 'Synthesis', active: progress >= 95 }
          ].map((phase, idx) => (
            <div key={idx} style={{
              padding: '7px 6px',
              borderRadius: '9999px',
              background: phase.active ? 'var(--badge-blue-bg)' : 'var(--sub-block-bg)',
              fontSize: '0.68rem',
              fontFamily: 'var(--font-mono)',
              color: phase.active ? 'var(--badge-blue-text)' : 'var(--text-muted)',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              boxShadow: phase.active ? '0 2px 6px rgba(37,99,235,0.1)' : 'none'
            }}>
              {phase.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
