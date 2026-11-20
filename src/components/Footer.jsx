import React from 'react';
import { ShieldCheck, Heart, Terminal, Lock, Globe, ArrowUp } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      borderTop: '1px solid rgba(56, 189, 248, 0.12)',
      background: 'rgba(5, 8, 17, 0.95)',
      padding: '48px 0 32px 0',
      marginTop: '60px',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="verilens-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '32px',
          marginBottom: '36px'
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
                border: '1px solid rgba(0, 240, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldCheck size={18} color="#00f0ff" />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', letterSpacing: '0.04em' }}>
                VERILENS
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '320px' }}>
              Digital Truth &amp; Safety Assistant. Protecting information integrity, auditing synthetic imagery, and verifying digital media provenance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: '#38bdf8', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Truth Suite Modules
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => onNavigate('checker')}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', textAlign: 'left', fontSize: '0.86rem', cursor: 'pointer' }}
              >
                AI Image Checker
              </button>
              <button
                onClick={() => onNavigate('fakenews')}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', textAlign: 'left', fontSize: '0.86rem', cursor: 'pointer' }}
              >
                Fake News Checker
              </button>
              <button
                onClick={() => onNavigate('privacy')}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', textAlign: 'left', fontSize: '0.86rem', cursor: 'pointer' }}
              >
                Privacy &amp; Media Guide
              </button>
              <button
                onClick={() => onNavigate('about')}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', textAlign: 'left', fontSize: '0.86rem', cursor: 'pointer' }}
              >
                About Project
              </button>
            </div>
          </div>

          {/* Security Telemetry Status */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: '#c084fc', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              System Integrity Status
            </h4>
            <div style={{
              background: 'rgba(15, 23, 42, 0.65)',
              padding: '12px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(56, 189, 248, 0.15)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#34d399', fontWeight: '700' }}>
                  OPERATIONAL • SECURE
                </span>
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                Local execution active. Zero persistent image telemetry logged.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(56, 189, 248, 0.08)',
          paddingTop: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} VERILENS – Digital Truth &amp; Safety Assistant. Academic College Demonstration.
          </div>

          <button
            onClick={scrollToTop}
            className="btn-secondary"
            style={{ fontSize: '0.75rem', padding: '6px 12px' }}
          >
            <span>Back to top</span>
            <ArrowUp size={12} />
          </button>
        </div>
      </div>
    </footer>
  );
}
