import React from 'react';
import { ShieldCheck, Eye, Cpu, Lock, ArrowRight, Layers, Activity, Zap } from 'lucide-react';

export default function Hero({ onExploreSamples, onLearnMore }) {
  const scrollToUpload = () => {
    const uploadElement = document.getElementById('image-uploader-section');
    if (uploadElement) {
      uploadElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: Eye,
      title: 'AI Image Detection',
      desc: 'Multi-signal forensic analysis across spectral frequency, sensor noise, and deep learning signals.'
    },
    {
      icon: Cpu,
      title: 'News Verification',
      desc: 'Linguistic analysis flags sensational claims, clickbait patterns, and unverified assertions.'
    },
    {
      icon: Lock,
      title: 'Digital Privacy',
      desc: 'Learn to protect your EXIF metadata, identity, and digital footprint online.'
    }
  ];

  return (
    <section style={{
      textAlign: 'center',
      padding: '52px 0 44px 0',
      position: 'relative',
      maxWidth: '1040px',
      margin: '0 auto'
    }}>
      {/* Top badge (Pill rounded, borderless with subtle glow) */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '7px 18px',
        borderRadius: '9999px',
        background: 'var(--badge-blue-bg)',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <Zap size={14} color="var(--badge-blue-text)" />
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.74rem',
          letterSpacing: '0.05em',
          fontWeight: '500',
          color: 'var(--badge-blue-text)',
          textTransform: 'uppercase'
        }}>
          AI Image Forensics · Digital Truth Platform
        </span>
      </div>

      {/* Main Heading (Plus Jakarta Sans, 800) */}
      <h1 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(2.2rem, 5.2vw, 3.8rem)',
        fontWeight: '800',
        letterSpacing: '-0.035em',
        lineHeight: 1.14,
        marginBottom: '20px',
        color: 'var(--text-primary)'
      }}>
        See Beyond<br />
        <span style={{ color: 'var(--blue-light)' }}>What Looks Real.</span>
      </h1>

      {/* Subtitle (Inter, 400) */}
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'clamp(1rem, 2vw, 1.16rem)',
        color: 'var(--text-secondary)',
        maxWidth: '660px',
        margin: '0 auto 34px auto',
        lineHeight: 1.7,
        fontWeight: '400'
      }}>
        Verify digital content with multi-signal forensic analysis. Detect AI-generated imagery,
        identify misleading information, and protect your digital privacy.
      </p>

      {/* CTA Buttons (Pills, pure white text & icons on blue button) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '14px',
        flexWrap: 'wrap',
        marginBottom: '56px'
      }}>
        <button
          onClick={scrollToUpload}
          className="btn-primary"
          style={{ padding: '14px 34px', fontSize: '1rem', fontFamily: 'var(--font-body)', fontWeight: '600' }}
        >
          <span style={{ color: '#FFFFFF' }}>Check an Image</span>
          <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} />
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
          style={{ padding: '14px 28px', fontSize: '0.98rem', fontFamily: 'var(--font-body)', fontWeight: '600' }}
        >
          <Activity size={16} color="var(--blue-light)" />
          <span>Explore Digital Safety</span>
        </button>
      </div>

      {/* Feature Cards (Border-free, smooth 20px rounded corners, soft shadows) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '18px',
        textAlign: 'left'
      }}>
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              className="glass-panel"
              style={{
                padding: '28px 24px',
                borderRadius: '20px'
              }}
            >
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'var(--badge-blue-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <Icon size={22} color="var(--badge-blue-text)" />
              </div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.02rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '8px'
              }}>
                {f.title}
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.86rem',
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                fontWeight: '400'
              }}>
                {f.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
