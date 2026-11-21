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
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12)',
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
          borderBottom: '1px solid #E2E8F0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#EFF6FF',
              border: '1px solid rgba(37,99,235,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Server size={18} color="#2563EB" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#172B4D' }}>
                Forensic Engine Telemetry
              </h3>
              <p style={{ fontSize: '0.74rem', color: '#64748B' }}>
                Multi-Signal Forensic Pipeline Status
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748B',
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
          borderRadius: '10px',
          background: backendStatus?.status === 'online' ? '#F0FDF4' : '#FEF2F2',
          border: `1px solid ${backendStatus?.status === 'online' ? '#BBF7D0' : '#FECACA'}`,
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: '700', color: backendStatus?.status === 'online' ? '#16A34A' : '#DC2626' }}>
              BACKEND SERVER STATUS
            </span>
            <button
              onClick={() => verifyHealth(customEndpoint)}
              disabled={checkingBackend}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#2563EB',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.74rem',
                fontWeight: '600'
              }}
            >
              <RefreshCw size={12} className={checkingBackend ? 'animate-spin' : ''} />
              <span>Re-check</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#172B4D' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: backendStatus?.status === 'online' ? '#16A34A' : '#DC2626'
            }} />
            <span>
              {backendStatus?.status === 'online'
                ? `Online & Connected (${activeUrl})`
                : 'Server Unreachable (Operating in Local Canvas Fallback Mode)'}
            </span>
          </div>

          {backendStatus?.status !== 'online' && (
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '6px', lineHeight: 1.5 }}>
              Run <code style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.76rem' }}>npm run server</code> to start the multi-signal forensic backend on port 3001.
            </p>
          )}
        </div>

        {/* Custom Endpoint Input */}
        <div style={{ marginBottom: '22px' }}>
          <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: '#172B4D', marginBottom: '6px' }}>
            Backend API Endpoint:
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={customEndpoint}
              onChange={(e) => setCustomEndpoint(e.target.value)}
              placeholder="Auto-detect (/api/detect or http://localhost:3001/api/detect)"
              style={{
                flex: 1,
                padding: '10px 14px',
                background: '#F8FAFC',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                color: '#172B4D',
                fontSize: '0.86rem',
                fontFamily: 'var(--font-mono)',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563EB'}
              onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
            />
            <button
              onClick={handleUseLocalhost}
              className="btn-secondary"
              style={{ fontSize: '0.78rem', padding: '8px 14px', whiteSpace: 'nowrap' }}
            >
              Use 3001
            </button>
          </div>
          <p style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '6px' }}>
            Leave blank to automatically connect to /api/detect or http://localhost:3001/api/detect.
          </p>
        </div>

        {/* Privacy Note */}
        <div style={{
          padding: '12px 14px',
          borderRadius: '8px',
          background: '#EFF6FF',
          border: '1px solid rgba(37,99,235,0.2)',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <Lock size={15} color="#2563EB" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.76rem', color: '#1E40AF', lineHeight: 1.45 }}>
            API keys and models stay securely on your server via .env. Uploaded images are analyzed in RAM buffers and discarded immediately.
          </span>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '9px 18px' }}>
            Cancel
          </button>
          <button onClick={handleSave} className="btn-primary" style={{ padding: '9px 22px' }}>
            Save &amp; Apply
          </button>
        </div>
      </div>
    </div>
  );
}
