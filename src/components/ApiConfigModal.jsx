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
  const [showCode, setShowCode] = useState(false);

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
      background: 'rgba(3, 7, 18, 0.82)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '620px',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: '#090d1a',
        border: '1px solid rgba(0, 240, 255, 0.3)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 240, 255, 0.15)',
        borderRadius: '16px',
        padding: '28px'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          paddingBottom: '14px',
          borderBottom: '1px solid rgba(56, 189, 248, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(0, 240, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(0, 240, 255, 0.35)'
            }}>
              <Sliders size={20} color="#00f0ff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ffffff' }}>
                Forensic Detection Engine Architecture
              </h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Multi-Signal Forensic Pipeline &amp; Secure Backend Integration
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Backend Server Status Card */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.7)',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} color="#00f0ff" />
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
                BACKEND SERVER STATUS
              </span>
            </div>
            <button
              onClick={checkServerHealth}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#38bdf8',
                fontSize: '0.72rem',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)'
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
              background: backendStatus?.status === 'online' ? '#10b981' : '#f59e0b',
              boxShadow: backendStatus?.status === 'online' ? '0 0 8px #10b981' : '0 0 8px #f59e0b'
            }} />
            <span style={{ fontSize: '0.86rem', color: '#f1f5f9', fontWeight: '600' }}>
              {backendStatus?.status === 'online' 
                ? 'Multi-Signal Forensic Backend Active (Port 3001)' 
                : 'Server Inactive (Falling back to local Canvas Signal Processor)'}
            </span>
          </div>

          <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '6px', lineHeight: 1.45 }}>
            {backendStatus?.status === 'online' 
              ? 'Real 2D Fourier FFT, PRNU sensor noise variance, and optical dispersion analysis are executing on server raw pixel buffers.'
              : 'Run `npm run server` in your project terminal to start the full multi-signal pipeline.'}
          </p>
        </div>

        {/* Security Notice: API Keys on Backend */}
        <div style={{
          background: 'rgba(168, 85, 247, 0.08)',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Lock size={16} color="#c084fc" />
            <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#c084fc', fontFamily: 'var(--font-mono)' }}>
              SECURE BACKEND CREDENTIALS (.env)
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '10px' }}>
            To prevent credential leaks, API keys are <strong>never stored or exposed in frontend client code</strong>. Configure your credentials inside the project's root <code>.env</code> file:
          </p>

          <pre style={{
            background: 'rgba(7, 11, 20, 0.9)',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '0.74rem',
            fontFamily: 'var(--font-mono)',
            color: '#7dd3fc',
            lineHeight: 1.5,
            overflowX: 'auto'
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
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: '600', color: '#94a3b8', marginBottom: '8px' }}>
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
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(7, 11, 20, 0.6)',
                border: '1px solid rgba(56, 189, 248, 0.1)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <CheckCircle2 size={15} color="#00f0ff" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: '600', color: '#f8fafc' }}>{item.name}</div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button
            onClick={onClose}
            className="btn-primary"
            style={{ padding: '10px 24px' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
