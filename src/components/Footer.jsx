import React from 'react';
import { ShieldCheck, ArrowUp } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      boxShadow: 'var(--shadow-sm)',
      padding: '48px 0 32px 0',
      marginTop: '60px',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="verilens-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '36px',
          marginBottom: '36px'
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
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
                <ShieldCheck size={18} color="var(--badge-blue-text)" />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                VERILENS
              </span>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', fontWeight: '400', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '340px' }}>
              Digital Truth &amp; Safety Assistant. Protecting information integrity, auditing synthetic imagery, and verifying digital media provenance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.8rem', fontFamily: 'var(--font-heading)', color: 'var(--blue-light)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600' }}>
              Truth Suite Modules
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => onNavigate('checker')}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', textAlign: 'left', fontSize: '0.86rem', fontFamily: 'var(--font-body)', fontWeight: '500', cursor: 'pointer', transition: 'color 0.15s' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--blue-light)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
              >
                AI Image Checker
              </button>
              <button
                onClick={() => onNavigate('fakenews')}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', textAlign: 'left', fontSize: '0.86rem', fontFamily: 'var(--font-body)', fontWeight: '500', cursor: 'pointer', transition: 'color 0.15s' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--blue-light)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
              >
                Fake News Checker
              </button>
              <button
                onClick={() => onNavigate('privacy')}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', textAlign: 'left', fontSize: '0.86rem', fontFamily: 'var(--font-body)', fontWeight: '500', cursor: 'pointer', transition: 'color 0.15s' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--blue-light)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
              >
                Privacy &amp; Media Guide
              </button>
              <button
                onClick={() => onNavigate('about')}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', textAlign: 'left', fontSize: '0.86rem', fontFamily: 'var(--font-body)', fontWeight: '500', cursor: 'pointer', transition: 'color 0.15s' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--blue-light)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
              >
                About Project
              </button>
            </div>
          </div>

          {/* Security Telemetry Status */}
          <div>
            <h4 style={{ fontSize: '0.8rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600' }}>
              System Integrity Status
            </h4>
            <div style={{
              background: 'var(--success-bg)',
              padding: '14px 18px',
              borderRadius: '18px',
              boxShadow: '0 2px 10px rgba(22, 163, 74, 0.06)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 6px rgba(22,163,74,0.4)' }} />
                <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--success)', fontWeight: '500' }}>
                  OPERATIONAL · SECURE
                </span>
              </div>
              <p style={{ fontSize: '0.76rem', fontFamily: 'var(--font-body)', fontWeight: '400', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Multi-signal forensic analysis active. Zero persistent image telemetry logged.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontWeight: '400' }}>
            © {new Date().getFullYear()} VERILENS – Digital Truth &amp; Safety Assistant. Academic College Demonstration.
          </div>

          <button
            onClick={scrollToTop}
            className="btn-secondary"
            style={{ fontSize: '0.76rem', padding: '6px 12px', fontFamily: 'var(--font-body)', fontWeight: '500' }}
          >
            <span>Back to top</span>
            <ArrowUp size={12} color="var(--blue-light)" />
          </button>
        </div>
      </div>
    </footer>
  );
}
