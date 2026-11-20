import React from 'react';
import { 
  ShieldCheck, 
  Eye, 
  Cpu, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  Layers,
  Activity
} from 'lucide-react';

export default function Hero({ onExploreSamples, onLearnMore }) {
  const scrollToUpload = () => {
    const uploadElement = document.getElementById('image-uploader-section');
    if (uploadElement) {
      uploadElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  };

  return (
    <section style={{
      textAlign: 'center',
      padding: '52px 0 36px 0',
      position: 'relative',
      maxWidth: '1040px',
      margin: '0 auto'
    }}>
      {/* Top Cyber Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '7px 16px',
        borderRadius: '24px',
        background: 'rgba(12, 51, 85, 0.7)',
        border: '1px solid rgba(210, 245, 0, 0.35)',
        marginBottom: '22px',
        boxShadow: '0 0 20px rgba(210, 245, 0, 0.12)'
      }}>
        <Sparkles size={14} color="#D2F500" />
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.76rem',
          letterSpacing: '0.08em',
          fontWeight: '700',
          color: '#D2F500',
          textTransform: 'uppercase'
        }}>
          Multi-Spectral Visual Forensics • Digital Truth Platform
        </span>
      </div>

      {/* Main Heading */}
      <h1 style={{
        fontSize: 'clamp(2.2rem, 5.2vw, 3.8rem)',
        fontWeight: '800',
        letterSpacing: '-0.03em',
        lineHeight: 1.14,
        marginBottom: '18px',
        color: 'var(--ghost-white)'
      }}>
        Is This Image Real <br />
        or <span className="heading-acid-accent">AI Generated?</span>
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: 'clamp(1.05rem, 2.1vw, 1.22rem)',
        color: 'var(--ghost-white-subtle)',
        maxWidth: '740px',
        margin: '0 auto 28px auto',
        lineHeight: 1.65,
        fontWeight: '400'
      }}>
        Upload an image and analyze visual patterns to identify possible signs of AI generation. Inspect synthetic frequency residuals, noise floor inconsistencies, and deep learning signatures.
      </p>

      {/* Action CTA Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '14px',
        flexWrap: 'wrap',
        marginBottom: '36px'
      }}>
        <button
          onClick={scrollToUpload}
          className="btn-primary"
          style={{
            padding: '14px 32px',
            fontSize: '1.02rem',
            boxShadow: '0 6px 28px rgba(210, 245, 0, 0.4)'
          }}
        >
          <span>Verify Image Now</span>
          <ArrowRight size={18} />
        </button>

        <button
          onClick={() => {
            if (onLearnMore) {
              onLearnMore();
            } else {
              const aboutSec = document.getElementById('about-section');
              if (aboutSec) aboutSec.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="btn-secondary"
          style={{
            padding: '14px 26px',
            fontSize: '1rem'
          }}
        >
          <Activity size={17} color="#D2F500" />
          <span>How Verification Works</span>
        </button>
      </div>

      {/* Capabilities Feature Badges */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '12px'
      }}>
        <div className="mono-badge mono-badge-acid">
          <Eye size={13} color="#D2F500" />
          <span>Error Level Analysis (ELA)</span>
        </div>
        <div className="mono-badge mono-badge-ghost">
          <Cpu size={13} color="var(--ghost-white)" />
          <span>Fourier 2D Frequency FFT</span>
        </div>
        <div className="mono-badge mono-badge-acid">
          <ShieldCheck size={13} color="#D2F500" />
          <span>PRNU Sensor Grain Analysis</span>
        </div>
        <div className="mono-badge mono-badge-ghost">
          <Lock size={13} color="var(--ghost-white)" />
          <span>Ephemeral RAM Execution</span>
        </div>
      </div>
    </section>
  );
}
