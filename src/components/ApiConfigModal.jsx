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
import { checkBackendHealth } from '../services/detectionService';

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

  const verifyHealth = async (urlToTest) => {
    setCheckingBackend(true);
    try {
      const result = await checkBackendHealth(urlToTest);
      if (result.online) {
        setBackendStatus({ status: 'online', ...result.data });
        setActiveUrl(result.baseUrl || 'http://localhost:3001');
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
    }
  }, [isOpen, config?.apiEndpoint]);

  const handleSave = () => {
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
                Multi-Signal Forensic Pipeline &amp; Backend Telemetry
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
              onClick={() => verifyHealth(customEndpoint)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'transparent',
                border: 'none',
                color: '#D2F500',
                fontSize: '0.76rem',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontWeight: '700'
              }}
            >
              <RefreshCw size={12} className={checkingBackend ? 'spin-icon' : ''} />
              <span>{checkingBackend ? 'Probing...' : 'Re-check Connection'}</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
            <span style={{
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              background: backendStatus?.status === 'online' ? '#D2F500' : '#FFB800',
              boxShadow: backendStatus?.status === 'online' ? '0 0 10px #D2F500' : '0 0 10px #FFB800'
            }} />
            <span style={{ fontSize: '0.9rem', color: 'var(--ghost-white)', fontWeight: '700' }}>
              {backendStatus?.status === 'online' 
                ? `Multi-Signal Forensic Engine Online (${activeUrl || 'http://localhost:3001'})` 
                : 'Server Unreachable (Operating in Local Canvas Fallback Mode)'}
            </span>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--ghost-white-subtle)', marginTop: '8px', lineHeight: 1.5 }}>
            {backendStatus?.status === 'online' 
              ? 'Real 2D Fourier FFT, PRNU sensor noise variance, and optical dispersion analysis are active and receiving telemetry.'
              : 'Run `npm run server` in your project terminal to start the full multi-signal pipeline on port 3001.'}
          </p>
        </div>

        {/* Custom Endpoint Input Box */}
        <div style={{
          background: 'rgba(5, 24, 41, 0.75)',
          padding: '18px',
          borderRadius: '12px',
          border: '1px solid rgba(248, 248, 255, 0.1)',
          marginBottom: '20px'
        }}>
          <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: 'var(--ghost-white)', marginBottom: '8px' }}>
            Backend API Endpoint:
          </label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              type="text"
              value={customEndpoint}
              onChange={(e) => setCustomEndpoint(e.target.value)}
              placeholder="Auto-detect (/api/detect or http://localhost:3001/api/detect)"
              style={{
                flex: 1,
                padding: '10px 14px',
                background: '#04111d',
                border: '1px solid rgba(248, 248, 255, 0.14)',
                borderRadius: '8px',
                color: 'var(--ghost-white)',
                fontSize: '0.86rem',
                fontFamily: 'var(--font-mono)'
              }}
            />
            <button
              onClick={handleUseLocalhost}
              className="btn-secondary"
              style={{ padding: '8px 12px', fontSize: '0.78rem' }}
              title="Point to local Node server on port 3001"
            >
              <Server size={14} color="#D2F500" />
              <span>Use 3001</span>
            </button>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--ghost-white-muted)' }}>
            Leave blank to automatically connect to <code>/api/detect</code> or <code>http://localhost:3001/api/detect</code>.
          </span>
        </div>

        {/* Security Notice */}
        <div style={{
          background: 'rgba(12, 51, 85, 0.5)',
          padding: '16px',
          borderRadius: '10px',
          border: '1px solid rgba(210, 245, 0, 0.2)',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Lock size={15} color="#D2F500" />
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#D2F500', fontFamily: 'var(--font-mono)' }}>
              LOCAL PRIVACY &amp; SECURITY
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--ghost-white-subtle)', lineHeight: 1.5 }}>
            API keys and models stay securely on your server via <code>.env</code>. Uploaded images are analyzed in RAM buffers and discarded immediately.
          </p>
        </div>

        {/* Close and Save Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '10px 20px' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn-primary"
            style={{ padding: '10px 26px' }}
          >
            Save &amp; Apply
          </button>
        </div>
      </div>
    </div>
  );
}
