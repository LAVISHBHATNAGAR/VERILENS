import React from 'react';
import { ShieldCheck, ArrowUp } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      borderTop: '1px solid rgba(248, 248, 255, 0.08)',
      background: 'rgba(9, 39, 66, 0.98)',
      padding: '52px 0 36px 0',
      marginTop: '68px',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="verilens-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '36px',
          marginBottom: '40px'
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0c3355 0%, #134673 100%)',
                border: '1px solid rgba(210, 245, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(210, 245, 0, 0.15)'
              }}>
                <ShieldCheck size={20} color="#D2F500" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--ghost-white)', letterSpacing: '0.04em' }}>
                VERILENS
              </span>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--ghost-white-subtle)', lineHeight: 1.65, maxWidth: '340px' }}>
              Digital Truth &amp; Safety Assistant. Protecting information integrity, auditing synthetic imagery, and verifying digital media provenance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.86rem', fontFamily: 'var(--font-mono)', color: '#D2F500', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700' }}>
              Truth Suite Modules
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => onNavigate('checker')}
                style={{ background: 'transparent', border: 'none', color: 'var(--ghost-white-subtle)', textAlign: 'left', fontSize: '0.88rem', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.target.style.color = '#D2F500'}
                onMouseLeave={(e) => e.target.style.color = 'var(--ghost-white-subtle)'}
              >
                AI Image Checker
              </button>
              <button
                onClick={() => onNavigate('fakenews')}
                style={{ background: 'transparent', border: 'none', color: 'var(--ghost-white-subtle)', textAlign: 'left', fontSize: '0.88rem', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.target.style.color = '#D2F500'}
                onMouseLeave={(e) => e.target.style.color = 'var(--ghost-white-subtle)'}
              >
                Fake News Checker
              </button>
              <button
                onClick={() => onNavigate('privacy')}
                style={{ background: 'transparent', border: 'none', color: 'var(--ghost-white-subtle)', textAlign: 'left', fontSize: '0.88rem', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.target.style.color = '#D2F500'}
                onMouseLeave={(e) => e.target.style.color = 'var(--ghost-white-subtle)'}
              >
                Privacy &amp; Media Guide
              </button>
              <button
                onClick={() => onNavigate('about')}
                style={{ background: 'transparent', border: 'none', color: 'var(--ghost-white-subtle)', textAlign: 'left', fontSize: '0.88rem', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.target.style.color = '#D2F500'}
                onMouseLeave={(e) => e.target.style.color = 'var(--ghost-white-subtle)'}
              >
                About Project
              </button>
            </div>
          </div>

          {/* Security Telemetry Status */}
          <div>
            <h4 style={{ fontSize: '0.86rem', fontFamily: 'var(--font-mono)', color: 'var(--ghost-white)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700' }}>
              System Integrity Status
            </h4>
            <div style={{
              background: 'rgba(12, 51, 85, 0.75)',
              padding: '14px 16px',
              borderRadius: '10px',
              border: '1px solid rgba(248, 248, 255, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#D2F500', boxShadow: '0 0 8px #D2F500' }} />
                <span style={{ fontSize: '0.76rem', fontFamily: 'var(--font-mono)', color: '#D2F500', fontWeight: '800' }}>
                  OPERATIONAL • SECURE
                </span>
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--ghost-white-muted)', lineHeight: 1.5 }}>
                Multi-signal forensic analysis active. Zero persistent image telemetry logged.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(248, 248, 255, 0.08)',
          paddingTop: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--ghost-white-muted)' }}>
            © {new Date().getFullYear()} VERILENS – Digital Truth &amp; Safety Assistant. Academic College Demonstration.
          </div>

          <button
            onClick={scrollToTop}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '7px 14px' }}
          >
            <span>Back to top</span>
            <ArrowUp size={13} color="#D2F500" />
          </button>
        </div>
      </div>
    </footer>
  );
}
