import React from 'react';
import { 
  Lock, 
  ShieldCheck, 
  EyeOff, 
  FileCheck, 
  Check, 
  Sparkles,
  Info
} from 'lucide-react';

export default function PrivacyGuide() {
  const guideCards = [
    {
      title: 'Local Browser Processing (Zero Remote Storage)',
      icon: EyeOff,
      description: 'In VERILENS demo mode, image pixels are drawn to an offscreen HTML5 canvas element inside your browser window. No images are sent to external databases or stored permanently.'
    },
    {
      title: 'EXIF Metadata & Location Privacy',
      icon: Lock,
      description: 'Photos taken on smartphones frequently embed exact GPS coordinates, camera serial numbers, and device identifiers in EXIF headers. Scrubbing metadata before sharing public photos prevents geo-stalking.'
    },
    {
      title: 'C2PA Cryptographic Content Credentials',
      icon: FileCheck,
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
          padding: '7px 16px',
          borderRadius: '24px',
          background: 'rgba(12, 51, 85, 0.7)',
          border: '1px solid rgba(210, 245, 0, 0.35)',
          marginBottom: '18px'
        }}>
          <Lock size={15} color="#D2F500" />
          <span style={{ fontSize: '0.76rem', fontFamily: 'var(--font-mono)', color: '#D2F500', fontWeight: '700' }}>
            DIGITAL PRIVACY &amp; SECURITY PROTOCOLS
          </span>
        </div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--ghost-white)', marginBottom: '10px' }}>
          Privacy, Provenance &amp; Media Safety Guide
        </h2>
        <p style={{ color: 'var(--ghost-white-subtle)', maxWidth: '660px', margin: '0 auto', fontSize: '0.96rem', lineHeight: 1.6 }}>
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
            <div key={idx} className="glass-panel" style={{ padding: '26px', background: 'rgba(12, 51, 85, 0.75)' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(210, 245, 0, 0.12)',
                border: '1px solid rgba(210, 245, 0, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px'
              }}>
                <Icon size={22} color="#D2F500" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--ghost-white)', marginBottom: '10px' }}>
                {card.title}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--ghost-white-subtle)', lineHeight: 1.6 }}>
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Deepfake Defense Checklist */}
      <div className="glass-panel" style={{ padding: '30px', marginBottom: '24px', background: 'rgba(12, 51, 85, 0.75)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <Sparkles size={20} color="#D2F500" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--ghost-white)' }}>
            Practical Visual Anomaly Checklist for Everyday Users
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {detectionTips.map((tip, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '14px 18px',
              borderRadius: '10px',
              background: 'rgba(5, 24, 41, 0.65)',
              border: '1px solid rgba(248, 248, 255, 0.08)'
            }}>
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: 'rgba(210, 245, 0, 0.16)',
                border: '1px solid rgba(210, 245, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px'
              }}>
                <Check size={13} color="#D2F500" />
              </div>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--ghost-white)' }}>
                  {tip.title}
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--ghost-white-subtle)', marginTop: '2px', lineHeight: 1.5 }}>
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
