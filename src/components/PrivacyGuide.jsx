import React from 'react';
import { 
  KeyRound, 
  ShieldAlert, 
  MapPin, 
  Smartphone, 
  UserCheck, 
  FileCheck,
  CheckCircle2,
  Lock,
  Sparkles
} from 'lucide-react';

export default function PrivacyGuide() {
  const guideCards = [
    {
      title: 'Password Security & Credential Hygiene',
      icon: KeyRound,
      description: 'Use unique passphrases of at least 16 characters or a dedicated password manager. Never reuse credentials across social platforms and banking portals.'
    },
    {
      title: 'Phishing & Social Engineering Detection',
      icon: ShieldAlert,
      description: 'Scrutinize sender domains, unexpected urgency triggers, and suspicious attachments. Legitimate institutions never ask for full credentials via direct message.'
    },
    {
      title: 'EXIF Metadata & Location Privacy',
      icon: MapPin,
      description: 'Smartphones automatically embed GPS coordinates, device serials, and timestamps into image files. Scrub metadata before publishing images on public channels.'
    },
    {
      title: 'Two-Factor Authentication (2FA) Standards',
      icon: Smartphone,
      description: 'Upgrade from SMS-based verification to hardware security keys (FIDO2/WebAuthn) or time-based authenticator apps (TOTP) to resist SIM-swapping attacks.'
    },
    {
      title: 'Social Media & Digital Footprint Protection',
      icon: UserCheck,
      description: 'Regularly audit connected third-party applications, minimize public personal information, and disable cross-site telemetry trackers in your browser settings.'
    },
    {
      title: 'C2PA Cryptographic Content Credentials',
      icon: FileCheck,
      description: 'The Coalition for Content Provenance and Authenticity (C2PA) embeds tamper-evident cryptographic digital signatures into camera sensors to verify authentic origin.'
    }
  ];

  const detectionTips = [
    { title: 'Check Iris Reflections', desc: 'Real eyes reflect consistent directional light sources. AI portraits frequently place reflections at mismatched angles.' },
    { title: 'Examine Background Text', desc: 'Diffusion models struggle with consistent typography, producing pseudo-Latin, melted glyphs, or illegible fonts.' },
    { title: 'Look for Ear & Earring Asymmetry', desc: 'Generative models often render differing earring designs, blurred earlobes, or warped cartilage geometry.' },
    { title: 'Inspect Teeth & Dental Margins', desc: 'Synthetic faces frequently generate excessive numbers of teeth or a seamless monolithic white band without gum spacing.' },
    { title: 'Observe Hair Strand Transitions', desc: 'Real hair has distinct flyaways and strands; generative AI tends to dissolve hair into a painted, watercolor texture.' }
  ];

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '9999px',
          background: 'var(--badge-blue-bg)',
          marginBottom: '16px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <Lock size={14} color="var(--badge-blue-text)" />
          <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', fontWeight: '500', color: 'var(--badge-blue-text)' }}>
            DIGITAL PRIVACY &amp; SECURITY PROTOCOLS
          </span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>
          Privacy, Provenance &amp; Media Safety Guide
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontWeight: '400', color: 'var(--text-secondary)', maxWidth: '660px', margin: '0 auto', fontSize: '0.96rem', lineHeight: 1.6 }}>
          Essential practices to safeguard personal information, protect your online identity, and evaluate digital media critically.
        </p>
      </div>

      {/* 6 Topic Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
        marginBottom: '36px'
      }}>
        {guideCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="glass-panel" style={{ padding: '24px', borderRadius: '20px' }}>
              <div style={{
                width: '44px',
                height: '44px',
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
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
                {card.title}
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.86rem', fontWeight: '400', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Visual Anomaly Checklist */}
      <div className="glass-panel" style={{ padding: '30px', borderRadius: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <Sparkles size={20} color="var(--blue-light)" />
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)' }}>
            Practical Visual Anomaly Checklist for Everyday Users
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {detectionTips.map((tip, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '14px 18px',
              borderRadius: '16px',
              background: 'var(--sub-block-bg)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <CheckCircle2 size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>
                  {tip.title}
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', fontWeight: '400', color: 'var(--text-muted)', lineHeight: 1.55 }}>
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
