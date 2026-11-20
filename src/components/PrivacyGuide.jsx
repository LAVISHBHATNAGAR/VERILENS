import React from 'react';
import { 
  Lock, 
  ShieldCheck, 
  EyeOff, 
  FileCheck, 
  AlertCircle, 
  Check, 
  Sparkles,
  Info,
  Layers
} from 'lucide-react';

export default function PrivacyGuide() {
  const guideCards = [
    {
      title: 'Local Browser Processing (Zero Remote Storage)',
      icon: EyeOff,
      color: '#00f0ff',
      description: 'In VERILENS demo mode, image pixels are drawn to an offscreen HTML5 canvas element inside your browser window. No images are sent to external databases or stored permanently.'
    },
    {
      title: 'EXIF Metadata & Location Privacy',
      icon: Lock,
      color: '#a855f7',
      description: 'Photos taken on smartphones frequently embed exact GPS coordinates, camera serial numbers, and device identifiers in EXIF headers. Scrubbing metadata before sharing public photos prevents geo-stalking.'
    },
    {
      title: 'C2PA Cryptographic Content Credentials',
      icon: FileCheck,
      color: '#10b981',
      description: 'The Coalition for Content Provenance and Authenticity (C2PA) standard embeds tamper-evident cryptographic digital signatures into camera firmware to certify authentic origin from lens to display.'
    }
  ];

  const detectionTips = [
    { title: 'Check Iris Reflections', desc: 'Real eyes reflect consistent light sources. AI portraits frequently place reflections at mismatched angles.' },
    { title: 'Examine Background Text', desc: 'Diffusion models struggle with consistent typography, producing pseudo-Latin or melted glyphs.' },
    { title: 'Look for Ear & Earring Asymmetry', desc: 'Generative models often render differing earring designs or warped earlobe cartilage.' },
    { title: 'Inspect Teeth & Dental Margins', desc: 'Synthetic faces frequently generate excessive numbers of teeth or a seamless monolithic white strip.' },
    { title: 'Observe Hair Strand Transitions', desc: 'Real hair has distinct flyaways and strands; AI tends to dissolve hair into a painted texture.' }
  ];

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '20px',
          background: 'rgba(168, 85, 247, 0.1)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          marginBottom: '16px'
        }}>
          <Lock size={14} color="#c084fc" />
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#c084fc', fontWeight: '600' }}>
            DIGITAL PRIVACY &amp; SECURITY PROTOCOLS
          </span>
        </div>
        <h2 style={{ fontSize: '2.1rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px' }}>
          Privacy, Provenance &amp; Media Safety Guide
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', fontSize: '0.95rem' }}>
          Understanding how digital imagery can expose personal information, and how to verify synthetic media responsibly.
        </p>
      </div>

      {/* Main Privacy Pillars */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {guideCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="glass-panel" style={{ padding: '24px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: `${card.color}15`,
                border: `1px solid ${card.color}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Icon size={22} color={card.color} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>
                {card.title}
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Deepfake Defense Checklist */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Sparkles size={20} color="#00f0ff" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ffffff' }}>
            Practical Visual Anomaly Checklist for Everyday Users
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {detectionTips.map((tip, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '8px',
              background: 'rgba(7, 11, 20, 0.55)',
              border: '1px solid rgba(56, 189, 248, 0.1)'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'rgba(0, 240, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px'
              }}>
                <Check size={12} color="#00f0ff" />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#f1f5f9' }}>
                  {tip.title}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {tip.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
