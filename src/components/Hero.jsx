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
      {/* Top badge (IBM Plex Mono, 500) */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 16px',
        borderRadius: '24px',
        background: '#EFF6FF',
        border: '1px solid rgba(37, 99, 235, 0.2)',
        marginBottom: '22px'
      }}>
        <Zap size={13} color="#2563EB" />
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.74rem',
          letterSpacing: '0.05em',
          fontWeight: '500',
          color: '#2563EB',
          textTransform: 'uppercase'
        }}>
          AI Image Forensics · Digital Truth Platform
        </span>
      </div>

      {/* Main Heading (Plus Jakarta Sans, 800) */}
      <h1 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(2.1rem, 5vw, 3.6rem)',
        fontWeight: '800',
        letterSpacing: '-0.03em',
        lineHeight: 1.15,
        marginBottom: '18px',
        color: '#172B4D'
      }}>
        See Beyond<br />
        <span style={{ color: '#2563EB' }}>What Looks Real.</span>
      </h1>

      {/* Subtitle (Inter, 400) */}
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'clamp(1rem, 2vw, 1.15rem)',
        color: '#475569',
        maxWidth: '660px',
        margin: '0 auto 32px auto',
        lineHeight: 1.7,
        fontWeight: '400'
      }}>
        Verify digital content with multi-signal forensic analysis. Detect AI-generated imagery,
        identify misleading information, and protect your digital privacy.
      </p>

      {/* CTA Buttons (Inter, 600) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '52px'
      }}>
        <button
          onClick={scrollToUpload}
          className="btn-primary"
          style={{ padding: '14px 32px', fontSize: '1rem', fontFamily: 'var(--font-body)', fontWeight: '600' }}
        >
          <span>Check an Image</span>
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
          style={{ padding: '14px 24px', fontSize: '0.98rem', fontFamily: 'var(--font-body)', fontWeight: '500' }}
        >
          <Activity size={16} color="#2563EB" />
          <span>Explore Digital Safety</span>
        </button>
      </div>

      {/* Feature Cards (Plus Jakarta Sans 600 headings, Inter 400 body) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        textAlign: 'left'
      }}>
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="glass-panel" style={{ padding: '24px 22px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
                border: '1px solid rgba(37,99,235,0.15)'
              }}>
                <Icon size={22} color="#2563EB" />
              </div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#172B4D',
                marginBottom: '7px'
              }}>
                {f.title}
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.86rem',
                color: '#64748B',
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
