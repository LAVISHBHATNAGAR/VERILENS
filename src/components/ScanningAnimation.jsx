import React from 'react';
import { ShieldCheck, Cpu, Activity } from 'lucide-react';

export default function ScanningAnimation({ progress = 0, currentStep = 'Initializing forensic sandbox...' }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div style={{ maxWidth: '640px', margin: '32px auto 0 auto' }}>
      <div className="glass-panel" style={{
        padding: '36px 24px',
        textAlign: 'center',
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle blue tint at top */}
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
            <circle cx="65" cy="65" r={radius} stroke="#E2E8F0" strokeWidth="6" fill="transparent" />
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
              fontSize: '1.55rem', fontWeight: '800',
              fontFamily: 'var(--font-mono)', color: '#172B4D', letterSpacing: '-0.02em'
            }}>
              {Math.round(progress)}%
            </span>
            <span style={{
              fontSize: '0.6rem', fontFamily: 'var(--font-mono)',
              color: '#2563EB', fontWeight: '700', letterSpacing: '0.06em'
            }}>
              SCANNING
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px', color: '#172B4D' }}>
          Running Forensic Analysis
        </h3>

        {/* Current step */}
        <p style={{
          fontSize: '0.88rem', fontFamily: 'var(--font-mono)', color: '#2563EB',
          marginBottom: '22px', minHeight: '24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
        }}>
          <span style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: '#2563EB', boxShadow: '0 0 8px rgba(37,99,235,0.5)', display: 'inline-block'
          }} />
          <span>{currentStep}</span>
        </p>

        {/* Linear progress bar */}
        <div style={{
          width: '100%', height: '6px', background: '#F1F5F9',
          borderRadius: '3px', overflow: 'hidden', marginBottom: '20px'
        }}>
          <div style={{
            width: `${progress}%`, height: '100%',
            background: 'linear-gradient(90deg, #2563EB 0%, #60A5FA 100%)',
            transition: 'width 0.35s ease',
            borderRadius: '3px'
          }} />
        </div>

        {/* Phase indicators */}
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
              padding: '6px 4px',
              borderRadius: '6px',
              background: phase.active ? '#EFF6FF' : '#F8FAFC',
              border: `1px solid ${phase.active ? 'rgba(37,99,235,0.3)' : '#E2E8F0'}`,
              fontSize: '0.68rem',
              fontFamily: 'var(--font-mono)',
              color: phase.active ? '#2563EB' : '#94A3B8',
              fontWeight: phase.active ? '700' : '500',
              transition: 'all 0.2s ease'
            }}>
              {phase.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
