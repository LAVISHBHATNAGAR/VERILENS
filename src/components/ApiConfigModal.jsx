import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sliders, 
  Cpu, 
  Globe, 
  Key, 
  Code, 
  CheckCircle2, 
  ExternalLink,
  ShieldAlert,
  Save,
  Activity,
  Layers,
  Lock
} from 'lucide-react';

export default function ApiConfigModal({ 
  isOpen, 
  onClose, 
  config, 
  onSaveConfig 
}) {
  const [backendStatus, setBackendStatus] = useState(null);
  const [checkingBackend, setCheckingBackend] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkServerHealth();
    }
  }, [isOpen]);

  const checkServerHealth = async () => {
    setCheckingBackend(true);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setBackendStatus(data);
      } else {
        setBackendStatus({ status: 'offline' });
      }
    } catch {
      setBackendStatus({ status: 'offline' });
    } finally {
      setCheckingBackend(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 250,
      background: 'rgba(5, 24, 41, 0.85)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '640px',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: '#092742',
        border: '1px solid rgba(210, 245, 0, 0.35)',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(210, 245, 0, 0.15)',
        borderRadius: '16px',
        padding: '30px'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '22px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(248, 248, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(210, 245, 0, 0.14)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(210, 245, 0, 0.4)'
            }}>
              <Sliders size={20} color="#D2F500" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--ghost-white)' }}>
                Forensic Detection Engine Architecture
              </h3>
              <p style={{ fontSize: '0.76rem', color: 'var(--ghost-white-muted)' }}>
                Multi-Signal Forensic Pipeline &amp; Secure Backend Integration
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--ghost-white-subtle)',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={20} color="#D2F500" />
          </button>
        </div>

        {/* Backend Server Status Card */}
        <div style={{
          background: 'rgba(12, 51, 85, 0.75)',
          padding: '18px',
          borderRadius: '12px',
          border: '1px solid rgba(248, 248, 255, 0.1)',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={17} color="#D2F500" />
              <span style={{ fontSize: '0.86rem', fontWeight: '800', color: 'var(--ghost-white)', fontFamily: 'var(--font-mono)' }}>
                BACKEND SERVER STATUS
              </span>
            </div>
            <button
              onClick={checkServerHealth}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#D2F500',
                fontSize: '0.74rem',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontWeight: '700'
              }}
            >
              {checkingBackend ? 'Pinging...' : 'Refresh Status'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: backendStatus?.status === 'online' ? '#D2F500' : '#FFB800',
              boxShadow: backendStatus?.status === 'online' ? '0 0 10px #D2F500' : '0 0 10px #FFB800'
            }} />
            <span style={{ fontSize: '0.88rem', color: 'var(--ghost-white)', fontWeight: '700' }}>
              {backendStatus?.status === 'online' 
                ? 'Multi-Signal Forensic Backend Active (Port 3001)' 
                : 'Server Inactive (Falling back to local Canvas Signal Processor)'}
            </span>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--ghost-white-subtle)', marginTop: '8px', lineHeight: 1.5 }}>
            {backendStatus?.status === 'online' 
              ? 'Real 2D Fourier FFT, PRNU sensor noise variance, and optical dispersion analysis are executing on server raw pixel buffers.'
              : 'Run `npm run server` in your project terminal to start the full multi-signal pipeline.'}
          </p>
        </div>

        {/* Security Notice: API Keys on Backend */}
        <div style={{
          background: 'rgba(5, 24, 41, 0.75)',
          padding: '18px',
          borderRadius: '12px',
          border: '1px solid rgba(248, 248, 255, 0.1)',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Lock size={16} color="#D2F500" />
            <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#D2F500', fontFamily: 'var(--font-mono)' }}>
              SECURE BACKEND CREDENTIALS (.env)
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--ghost-white-subtle)', lineHeight: 1.55, marginBottom: '12px' }}>
            To prevent credential leaks, API keys are <strong>never stored or exposed in frontend client code</strong>. Configure your credentials inside the project's root <code>.env</code> file:
          </p>

          <pre style={{
            background: '#04111d',
            padding: '14px',
            borderRadius: '8px',
            fontSize: '0.76rem',
            fontFamily: 'var(--font-mono)',
            color: '#D2F500',
            lineHeight: 1.55,
            overflowX: 'auto',
            border: '1px solid rgba(248, 248, 255, 0.08)'
          }}>
{`# .env configuration
PORT=3001
HUGGINGFACE_API_KEY=hf_your_key_here
SIGHTENGINE_API_USER=
SIGHTENGINE_API_SECRET=
HIVE_API_KEY=`}
          </pre>
        </div>

        {/* Multi-Signal Pipeline Pillars List */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{ fontSize: '0.84rem', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--ghost-white)', marginBottom: '10px' }}>
            ACTIVE FORENSIC SIGNAL PIPELINE:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { name: '2D Spatial Fast Fourier Transform (FFT)', desc: 'Detects periodic upsampling lattice peaks and unnatural power spectral decay.' },
              { name: 'PRNU CMOS Sensor Noise Floor & Kurtosis', desc: 'Measures Poisson-Gaussian shot noise in smooth areas to isolate synthetic waxiness.' },
              { name: 'Optical Chromatic Dispersion & Edges', desc: 'Checks for sub-pixel optical glass dispersion vs achromatic synthetic boundary cuts.' },
              { name: 'Container & EXIF Metadata Provenance', desc: 'Inspects camera tags, ComfyUI/Stable Diffusion prompt chunks, and container headers.' },
              { name: 'Pretrained Vision Model (ViT)', desc: 'Deep neural network classification via Hugging Face Inference API or configured model.' }
            ].map((item, idx) => (
              <div key={idx} style={{
                padding: '12px 14px',
                borderRadius: '8px',
                background: 'rgba(12, 51, 85, 0.6)',
                border: '1px solid rgba(248, 248, 255, 0.08)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <CheckCircle2 size={16} color="#D2F500" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--ghost-white)' }}>{item.name}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--ghost-white-subtle)', marginTop: '2px' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Close Button (Acid Green) */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
          <button
            onClick={onClose}
            className="btn-primary"
            style={{ padding: '11px 26px' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
