import React, { useState, useEffect, useCallback } from 'react';
import { Lock, RefreshCw, Server } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
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
  const [customEndpoint, setCustomEndpoint] = useState(() => config?.apiEndpoint || '');
  const [hfToken, setHfToken] = useState(() => {
    try {
      return localStorage.getItem('verilens_hf_token') || '';
    } catch {
      return '';
    }
  });
  const [geminiKey, setGeminiKey] = useState(() => {
    try {
      return localStorage.getItem('verilens_gemini_key') || '';
    } catch {
      return '';
    }
  });

  const runHealthCheck = useCallback(async (urlToTest) => {
    setCheckingBackend(true);
    try {
      const result = await checkBackendHealth(urlToTest);
      if (result.online) {
        setBackendStatus({ status: 'online', ...result.data });
        setActiveUrl(
          result.baseUrl ||
            CONFIGURED_BACKEND_URL ||
            (typeof window !== 'undefined' ? window.location.origin : 'Relative (/api)')
        );
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
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;
    let active = true;
    checkBackendHealth(config?.apiEndpoint)
      .then((result) => {
        if (!active) return;
        if (result.online) {
          setBackendStatus({ status: 'online', ...result.data });
          setActiveUrl(
            result.baseUrl ||
              CONFIGURED_BACKEND_URL ||
              (typeof window !== 'undefined' ? window.location.origin : 'Relative (/api)')
          );
        } else {
          setBackendStatus({ status: 'offline' });
          setActiveUrl('');
        }
      })
      .catch(() => {
        if (active) {
          setBackendStatus({ status: 'offline' });
          setActiveUrl('');
        }
      });
    return () => {
      active = false;
    };
  }, [isOpen, config?.apiEndpoint]);

  const handleSave = () => {
    try {
      if (hfToken.trim()) localStorage.setItem('verilens_hf_token', hfToken.trim());
      else localStorage.removeItem('verilens_hf_token');

      if (geminiKey.trim()) localStorage.setItem('verilens_gemini_key', geminiKey.trim());
      else localStorage.removeItem('verilens_gemini_key');
    } catch {
      // Ignore storage errors in private mode
    }

    onSaveConfig?.({
      ...config,
      apiEndpoint: customEndpoint.trim()
    });
    onClose();
  };

  const handleUseLocalhost = () => {
    const local = 'http://localhost:3001/api/detect';
    setCustomEndpoint(local);
    runHealthCheck('http://localhost:3001');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl bg-[var(--bg-secondary)] border border-[var(--border-hairline)] rounded-[24px] p-6 shadow-[var(--shadow-lg)]">
        <DialogHeader className="text-left pb-3 border-b border-[var(--border-hairline)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--badge-blue-bg)] border border-[var(--border-specular)] flex items-center justify-center shrink-0">
              <Server className="w-5 h-5 text-[var(--badge-blue-text)]" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-[var(--text-primary)]">
                Forensic Engine Telemetry
              </DialogTitle>
              <DialogDescription className="text-xs text-[var(--text-muted)]">
                Configure backend node connectivity and optional Deep Learning API keys
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-1 max-h-[68vh] overflow-y-auto pr-1">
          {/* Backend Status Banner */}
          <div
            className={`rounded-2xl p-4 border ${
              backendStatus?.status === 'online'
                ? 'bg-[var(--success-bg)] border-emerald-500/30'
                : 'bg-[var(--error-bg)] border-red-500/30'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span
                className={`font-mono text-xs font-semibold ${
                  backendStatus?.status === 'online' ? 'text-[var(--success)]' : 'text-[var(--error)]'
                }`}
              >
                BACKEND SERVER STATUS
              </span>
              <button
                type="button"
                onClick={() => runHealthCheck(customEndpoint)}
                disabled={checkingBackend}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--blue-light)] hover:underline"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${checkingBackend ? 'animate-spin' : ''}`} />
                <span>Re-check</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
              <span
                className={`w-2 h-2 rounded-full ${
                  backendStatus?.status === 'online' ? 'bg-[var(--success)]' : 'bg-[var(--error)]'
                }`}
              />
              <span>
                {backendStatus?.status === 'online'
                  ? `Online & Connected (${activeUrl})`
                  : 'Server Unreachable (Using Local Canvas Fallback)'}
              </span>
            </div>

            {backendStatus?.status !== 'online' && (
              <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
                Start locally with <code className="font-mono bg-[var(--sub-block-bg)] px-1.5 py-0.5 rounded">npm run server</code> on port 3001, or configure <code className="font-mono bg-[var(--sub-block-bg)] px-1.5 py-0.5 rounded">VITE_API_URL</code>.
              </p>
            )}
          </div>

          {/* Custom Endpoint */}
          <div>
            <label
              htmlFor="backend-endpoint-input"
              className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5"
            >
              Backend API Endpoint
            </label>
            <div className="flex gap-2">
              <input
                id="backend-endpoint-input"
                type="text"
                value={customEndpoint}
                onChange={(e) => setCustomEndpoint(e.target.value)}
                placeholder={
                  CONFIGURED_BACKEND_URL
                    ? `${CONFIGURED_BACKEND_URL}/api/detect`
                    : 'Auto-detect (/api/detect)'
                }
                className="flex-1 rounded-xl bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] px-3.5 py-2 text-xs sm:text-sm font-mono text-[var(--text-primary)] focus:border-[var(--blue)] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleUseLocalhost}
                className="btn-secondary text-xs py-2 px-3.5 whitespace-nowrap"
              >
                Local 3001
              </button>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] mt-1.5">
              Leave empty to auto-probe configured Render backend, relative proxy, or localhost:3001.
            </p>
          </div>

          {/* Vision Model Keys */}
          <div className="rounded-2xl bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--text-primary)]">
                Deep Learning Vision Model (Optional)
              </span>
              <span
                className={`mono-badge text-[10px] py-0.5 px-2.5 ${
                  hfToken || geminiKey ? 'mono-badge-real' : 'mono-badge-blue'
                }`}
              >
                {hfToken || geminiKey ? 'CONFIGURED' : 'UNCONFIGURED'}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <label htmlFor="hf-token-input" className="font-medium text-[var(--text-secondary)]">
                  Hugging Face Token
                </label>
                <a
                  href="https://huggingface.co/settings/tokens"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--blue-light)] hover:underline"
                >
                  Get free token
                </a>
              </div>
              <input
                id="hf-token-input"
                type="password"
                value={hfToken}
                onChange={(e) => setHfToken(e.target.value)}
                placeholder="hf_xxxxxxxxxxxxxxxxxxxx"
                className="w-full rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-hairline)] px-3 py-2 text-xs font-mono text-[var(--text-primary)] focus:border-[var(--blue)] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="gemini-key-input"
                className="block text-xs font-medium text-[var(--text-secondary)] mb-1"
              >
                Google Gemini API Key
              </label>
              <input
                id="gemini-key-input"
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy... (Gemini Multimodal Verification)"
                className="w-full rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-hairline)] px-3 py-2 text-xs font-mono text-[var(--text-primary)] focus:border-[var(--blue)] focus:outline-none"
              />
            </div>
          </div>

          {/* Privacy Guarantee */}
          <div className="rounded-xl bg-[var(--badge-blue-bg)] border border-[var(--border-specular)] p-3 flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-[var(--badge-blue-text)] shrink-0" />
            <span className="text-xs text-[var(--badge-blue-text)] leading-relaxed">
              Keys remain local in your browser or server .env. Uploaded images stay strictly in RAM buffers.
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-2.5 pt-3 border-t border-[var(--border-hairline)]">
          <button type="button" onClick={onClose} className="btn-secondary text-xs py-2 px-4">
            Cancel
          </button>
          <button type="button" onClick={handleSave} className="btn-primary text-xs py-2 px-5">
            Save &amp; Apply
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
