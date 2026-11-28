import React from 'react';
import { ArrowUp } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

function FooterOpticalMark() {
  return (
    <div className="w-8 h-8 rounded-lg bg-[#12141b] border border-[var(--border-hairline)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] flex items-center justify-center shrink-0">
      <svg viewBox="0 0 28 28" className="w-4.5 h-4.5" fill="none" aria-hidden="true">
        <path
          d="M14 2.5L23.5 6.4V13.8C23.5 19.3 19.4 23.8 14 25.5C8.6 23.8 4.5 19.3 4.5 13.8V6.4L14 2.5Z"
          stroke="#fcfcfc"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <circle cx="14" cy="13.5" r="5" stroke="#ff5e78" strokeWidth="1.1" strokeDasharray="2.5 1.8" />
        <circle cx="14" cy="13.5" r="2.2" fill="#ff2e2e" />
      </svg>
    </div>
  );
}

export default function Footer({ onNavigate, isBackendOnline = false }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-28 border-t border-[var(--border-hairline)] bg-[var(--bg-secondary)]/72 backdrop-blur-xl relative z-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="verilens-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12 items-start">
          {/* Brand Summary */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5 mb-3">
              <FooterOpticalMark />
              <span className="font-heading text-base font-extrabold text-[var(--text-primary)] tracking-[-0.02em]">
                VERILENS
              </span>
              <span className="font-mono text-[9.5px] tracking-[0.09em] px-1.5 py-[1px] rounded-[4px] bg-[var(--bg-main)]/85 text-[var(--text-muted)] border border-[var(--border-hairline)]">
                v2.0.0
              </span>
            </div>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-sm">
              Digital Truth &amp; Media Forensics Workbench. Auditing synthetic imagery and provenance with calibrated scientific uncertainty.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <h4 className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)] mb-3">
              Modules
            </h4>
            <div className="flex flex-col items-start gap-1.5">
              {[
                { id: 'checker', label: 'AI Image Checker' },
                { id: 'fakenews', label: 'Fake News Checker' },
                { id: 'privacy', label: 'Privacy & Media Guide' },
                { id: 'about', label: 'Architecture & Pipeline' }
              ].map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => onNavigate(link.id)}
                  className="text-sm font-medium text-[var(--text-secondary)] hover:text-[#ff5e78] transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Refined Forensic Hardware Status Plate */}
          <div className="md:col-span-4">
            <h4 className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)] mb-3">
              Telemetry &amp; Memory Posture
            </h4>
            <div className="relative rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-main)]/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden">
              {/* Crisp Hardware Corner Registration Marks */}
              <span aria-hidden="true" className="pointer-events-none absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-[#ff5e78]/45" />
              <span aria-hidden="true" className="pointer-events-none absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-[#ff5e78]/45" />
              <span aria-hidden="true" className="pointer-events-none absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l border-[#ff5e78]/45" />
              <span aria-hidden="true" className="pointer-events-none absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-[#ff5e78]/45" />

              <div className="px-4 py-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isBackendOnline
                        ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                        : 'bg-[#ff5e78]'
                    }`}
                  />
                  <span className="font-mono text-[11px] font-semibold tracking-wider text-[var(--text-primary)]">
                    {isBackendOnline ? 'ENGINE ONLINE' : 'CLIENT SANDBOX'}
                  </span>
                </div>
                <span className="font-mono text-[9.5px] tracking-widest text-[var(--text-muted)] tabular-nums">
                  RAM-ONLY · 0 KB DISK
                </span>
              </div>

              {/* Animated Live SVG Memory-Buffer Activity & SHA-256 Purge Divider */}
              <div className="px-4 py-1 border-y border-[var(--border-hairline)] bg-[var(--sub-block-bg)]/50">
                <svg viewBox="0 0 280 8" className="w-full h-2 block" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="shaPurgeSweep" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={isBackendOnline ? '#34d399' : '#ff2e2e'} stopOpacity="0" />
                      <stop offset="50%" stopColor={isBackendOnline ? '#34d399' : '#ff5e78'} stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#ff2e2e" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Segmented Buffer Hairlines */}
                  <line x1="0" y1="4" x2="280" y2="4" stroke="#27272a" strokeWidth="1" strokeDasharray="3 3" />
                  {/* Continuous 60fps Purge Packet Sweep */}
                  <rect x="-70" y="3" width="70" height="2" rx="1" fill="url(#shaPurgeSweep)">
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      from="0 0"
                      to="350 0"
                      dur="2.8s"
                      repeatCount="indefinite"
                    />
                  </rect>
                </svg>
              </div>

              <div className="px-4 py-2.5 flex items-center justify-between gap-3">
                <p className="text-[11.5px] text-[var(--text-muted)] leading-relaxed">
                  Sharp pixels decode inside volatile memory and purge immediately post SHA-256 audit.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--border-hairline)] flex flex-wrap items-center justify-between gap-3">
          <div className="font-mono text-[10.5px] tracking-wide text-[var(--text-muted)]">
            © {CURRENT_YEAR} VERILENS v2.0.0 · Crimson Pulse Forensics Suite
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-hairline)] bg-[var(--sub-block-bg)]/65 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] font-mono text-[11px] font-medium text-[var(--text-secondary)] hover:text-[#ff5e78] hover:border-[#ff2e2e]/45 transition-all"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
