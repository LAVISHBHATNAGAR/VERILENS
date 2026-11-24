import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sliders, 
  CheckCircle2, 
  Activity, 
  Lock,
  Globe,
  RefreshCw,
  Server
} from 'lucide-react';
import { checkBackendHealth, CONFIGURED_BACKEND_URL } from '../services/detectionService';

export default function ApiConfigModal({ 
  isOpen, 
  onClose, 
  config, 
  onSaveConfig 
}) {
  const [backendStatus, setBackendStatus] = useState(null);
  const [checkingBackend, setCheckingBackend] = useState(false);
  const [activeUrl, setActiveUrl] = useState('');
  const [customEndpoint, setCustomEndpoint] = useState(config?.apiEndpoint || '');
  const [hfToken, setHfToken] = useState('');
  const [geminiKey, setGeminiKey] = useState('');

  const verifyHealth = async (urlToTest) => {
    setCheckingBackend(true);
    try {
      const result = await checkBackendHealth(urlToTest);
      if (result.online) {
        setBackendStatus({ status: 'online', ...result.data });
        setActiveUrl(result.baseUrl || CONFIGURED_BACKEND_URL || (typeof window !== 'undefined' ? window.location.origin : 'Relative (/api)'));
      } else {
        setBackendStatus({ status: 'offline' });
        setActiveUrl('');
      }
    } catch {
      setBackendStatus({ status: 'offline' });
      setActiveUrl('');
    } finally {
      setCheckingBackend(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      verifyHealth(config?.apiEndpoint);
      setCustomEndpoint(config?.apiEndpoint || '');
      setHfToken(localStorage.getItem('verilens_hf_token') || '');
      setGeminiKey(localStorage.getItem('verilens_gemini_key') || '');
    }
  }, [isOpen, config?.apiEndpoint]);

  const handleSave = () => {
    if (hfToken.trim()) {
      localStorage.setItem('verilens_hf_token', hfToken.trim());
    } else {
      localStorage.removeItem('verilens_hf_token');
    }

    if (geminiKey.trim()) {
      localStorage.setItem('verilens_gemini_key', geminiKey.trim());
    } else {
      localStorage.removeItem('verilens_gemini_key');
    }

    if (onSaveConfig) {
      onSaveConfig({
        ...config,
        apiEndpoint: customEndpoint.trim()
      });
    }
    onClose();
  };

  const handleUseLocalhost = () => {
    const local = 'http://localhost:3001/api/detect';
    setCustomEndpoint(local);
    verifyHealth('http://localhost:3001');
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 250,
      background: 'rgba(23, 43, 77, 0.45)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '580px',
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: '24px',
        padding: '28px'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          paddingBottom: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              background: 'var(--badge-blue-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <Server size={18} color="var(--badge-blue-text)" />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Forensic Engine Telemetry
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '400' }}>
                Multi-Signal Forensic Pipeline Status
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Backend Status Section */}
        <div style={{
          padding: '16px',
          borderRadius: '18px',
          background: backendStatus?.status === 'online' ? 'var(--success-bg)' : 'var(--error-bg)',
          boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: '500', color: backendStatus?.status === 'online' ? 'var(--success)' : 'var(--error)' }}>
              BACKEND SERVER STATUS
            </span>
            <button
              onClick={() => verifyHealth(customEndpoint)}
              disabled={checkingBackend}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--blue-light)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.74rem',
                fontFamily: 'var(--font-body)',
                fontWeight: '500'
              }}
            >
              <RefreshCw size={12} className={checkingBackend ? 'animate-spin' : ''} />
              <span>Re-check</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontFamily: 'var(--font-body)', fontWeight: '500', color: 'var(--text-primary)' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: backendStatus?.status === 'online' ? 'var(--success)' : 'var(--error)'
            }} />
            <span>
              {backendStatus?.status === 'online'
                ? `Online & Connected (${activeUrl})`
                : 'Server Unreachable (Operating in Local Canvas Fallback Mode)'}
            </span>
          </div>

          {backendStatus?.status !== 'online' && (
            <p style={{ fontSize: '0.8rem', fontFamily: 'var(--font-body)', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.5, fontWeight: '400' }}>
              Run <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--sub-block-bg)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.76rem' }}>npm run server</code> locally on port 3001, or deploy the backend to Render and set <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--sub-block-bg)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.76rem' }}>VITE_API_URL</code> on Vercel.
            </p>
          )}
        </div>

        {/* Custom Endpoint Input */}
        <div style={{ marginBottom: '22px' }}>
          <label style={{ display: 'block', fontSize: '0.84rem', fontFamily: 'var(--font-body)', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '6px' }}>
            Backend API Endpoint:
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={customEndpoint}
              onChange={(e) => setCustomEndpoint(e.target.value)}
              placeholder={CONFIGURED_BACKEND_URL ? `${CONFIGURED_BACKEND_URL}/api/detect` : "Auto-detect (/api/detect or https://your-backend.onrender.com/api/detect)"}
              style={{
                flex: 1,
                padding: '10px 16px',
                background: 'var(--sub-block-bg)',
                border: 'none',
                borderRadius: '14px',
                color: 'var(--text-primary)',
                fontSize: '0.86rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: '400',
                outline: 'none',
                boxShadow: 'inset 0 1px 3px rgba(15, 23, 42, 0.05)'
              }}
            />
            <button
              onClick={handleUseLocalhost}
              className="btn-secondary"
              title="Reset to local server on port 3001"
              style={{ fontSize: '0.78rem', padding: '8px 14px', whiteSpace: 'nowrap', fontFamily: 'var(--font-body)', fontWeight: '500' }}
            >
              Local 3001
            </button>
          </div>
          <p style={{ fontSize: '0.74rem', fontFamily: 'var(--font-body)', color: 'var(--text-muted)', marginTop: '6px', fontWeight: '400' }}>
            Leave blank to connect automatically via VITE_API_URL, relative proxy, or local port 3001.
          </p>
        </div>

        {/* Deep Learning Vision Model Integration */}
        <div style={{
          padding: '16px',
          borderRadius: '16px',
          background: 'var(--sub-block-bg)',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.84rem', fontFamily: 'var(--font-heading)', fontWeight: '600', color: 'var(--text-primary)' }}>
              Deep Learning Vision Model (Optional)
            </span>
            <span style={{
              fontSize: '0.68rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: '500',
              padding: '2px 8px',
              borderRadius: '9999px',
              background: (hfToken || geminiKey) ? 'var(--success-bg)' : 'var(--badge-blue-bg)',
              color: (hfToken || geminiKey) ? 'var(--success)' : 'var(--blue-light)'
            }}>
              {(hfToken || geminiKey) ? 'CONFIGURED' : 'UNCONFIGURED (.ENV)'}
            </span>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontFamily: 'var(--font-body)', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              <span>Hugging Face API Token:</span>
              <a 
                href="https://huggingface.co/settings/tokens" 
                target="_blank" 
                rel="noreferrer" 
                style={{ color: 'var(--blue-light)', textDecoration: 'none' }}
              >
                Get free token ↗
              </a>
            </label>
            <input
              type="password"
              value={hfToken}
              onChange={(e) => setHfToken(e.target.value)}
              placeholder="hf_xxxxxxxxxxxxxxxxxxxx (umm-maybe/AI-image-detector)"
              style={{
                width: '100%',
                padding: '9px 14px',
                background: 'var(--bg-primary)',
                border: 'none',
                borderRadius: '12px',
                color: 'var(--text-primary)',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-mono)',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontFamily: 'var(--font-body)', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Google Gemini API Key:
            </label>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIzaSy... (Gemini 2.0 Flash Vision Verification)"
              style={{
                width: '100%',
                padding: '9px 14px',
                background: 'var(--bg-primary)',
                border: 'none',
                borderRadius: '12px',
                color: 'var(--text-primary)',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-mono)',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <p style={{ fontSize: '0.72rem', fontFamily: 'var(--font-body)', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.45 }}>
            Token is stored in browser memory &amp; sent in secure request headers (<code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>x-huggingface-key</code>) so the backend can query inference models without modifying server files.
          </p>
        </div>

        {/* Privacy Note */}
        <div style={{
          padding: '12px 16px',
          borderRadius: '14px',
          background: 'var(--badge-blue-bg)',
          boxShadow: '0 2px 8px rgba(37,99,235,0.06)',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <Lock size={15} color="var(--badge-blue-text)" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.76rem', fontFamily: 'var(--font-body)', color: 'var(--badge-blue-text)', lineHeight: 1.45, fontWeight: '400' }}>
            API keys and models stay securely on your server via .env. Uploaded images are analyzed in RAM buffers and discarded immediately.
          </span>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '9px 18px', fontFamily: 'var(--font-body)', fontWeight: '500' }}>
            Cancel
          </button>
          <button onClick={handleSave} className="btn-primary" style={{ padding: '9px 22px', fontFamily: 'var(--font-body)', fontWeight: '600', color: '#FFFFFF' }}>
            Save &amp; Apply
          </button>
        </div>
      </div>
    </div>
  );
}
