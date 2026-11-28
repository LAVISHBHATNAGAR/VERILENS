import React, { useState } from 'react';
import {
  KeyRound,
  ShieldAlert,
  MapPin,
  Smartphone,
  UserCheck,
  FileCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  ShieldOff,
  Eraser
} from 'lucide-react';

const EXIF_FIELDS = [
  {
    id: 'gps',
    label: 'GPS Coordinates',
    risk: 35,
    exposedValue: '37.7749° N, 122.4194° W (Alt: 18.4m)'
  },
  {
    id: 'device',
    label: 'Camera Make & Serial',
    risk: 20,
    exposedValue: 'Apple iPhone 16 Pro · SN: F2L9X84K2'
  },
  {
    id: 'timestamp',
    label: 'Exact Timestamp',
    risk: 15,
    exposedValue: '2026-11-27 18:42:11 +05:30'
  },
  {
    id: 'lens',
    label: 'Lens & Exposure Telemetry',
    risk: 10,
    exposedValue: '24mm f/1.78 · 1/120s · ISO 160'
  },
  {
    id: 'software',
    label: 'Software / Workflow Tag',
    risk: 20,
    exposedValue: 'Adobe Lightroom 7.4 / C2PA Unsigned'
  }
];

export default function PrivacyGuide() {
  const [exposedFields, setExposedFields] = useState({
    gps: true,
    device: true,
    timestamp: true,
    lens: true,
    software: false
  });

  const toggleField = (id) => {
    setExposedFields((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const scrubAll = () => {
    setExposedFields({
      gps: false,
      device: false,
      timestamp: false,
      lens: false,
      software: false
    });
  };

  const exposureScore = EXIF_FIELDS.reduce(
    (sum, field) => (exposedFields[field.id] ? sum + field.risk : sum),
    0
  );

  const guideCards = [
    {
      title: 'Password Security & Credential Hygiene',
      icon: KeyRound,
      description:
        'Use unique passphrases of at least 16 characters or a dedicated password manager. Never reuse credentials across social platforms and banking portals.'
    },
    {
      title: 'Phishing & Social Engineering Detection',
      icon: ShieldAlert,
      description:
        'Scrutinize sender domains, unexpected urgency triggers, and suspicious attachments. Legitimate institutions never ask for full credentials via direct message.'
    },
    {
      title: 'EXIF Metadata & Location Privacy',
      icon: MapPin,
      description:
        'Smartphones automatically embed GPS coordinates, device serials, and timestamps into image files. Scrub metadata before publishing images on public channels.'
    },
    {
      title: 'Two-Factor Authentication (2FA) Standards',
      icon: Smartphone,
      description:
        'Upgrade from SMS-based verification to hardware security keys (FIDO2/WebAuthn) or time-based authenticator apps (TOTP) to resist SIM-swapping attacks.'
    },
    {
      title: 'Social Media & Digital Footprint Protection',
      icon: UserCheck,
      description:
        'Regularly audit connected third-party applications, minimize public personal information, and disable cross-site telemetry trackers in your browser settings.'
    },
    {
      title: 'C2PA Cryptographic Content Credentials',
      icon: FileCheck,
      description:
        'The Coalition for Content Provenance and Authenticity (C2PA) embeds tamper-evident cryptographic digital signatures into camera sensors to verify authentic origin.'
    }
  ];

  const detectionTips = [
    {
      title: 'Check Iris Reflections',
      desc: 'Real eyes reflect consistent directional light sources. AI portraits frequently place reflections at mismatched angles.'
    },
    {
      title: 'Examine Background Text',
      desc: 'Diffusion models struggle with consistent typography, producing pseudo-Latin, melted glyphs, or illegible fonts.'
    },
    {
      title: 'Look for Ear & Earring Asymmetry',
      desc: 'Generative models often render differing earring designs, blurred earlobes, or warped cartilage geometry.'
    },
    {
      title: 'Inspect Teeth & Dental Margins',
      desc: 'Synthetic faces frequently generate excessive numbers of teeth or a seamless monolithic white band without gum spacing.'
    },
    {
      title: 'Observe Hair Strand Transitions',
      desc: 'Real hair has distinct flyaways and strands; generative AI tends to dissolve hair into a painted, watercolor texture.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto pb-10 space-y-8">
      {/* Header */}
      <div className="text-center">
        <span className="mono-badge mono-badge-blue mb-4">
          <Lock className="w-3.5 h-3.5" />
          <span>DIGITAL PRIVACY &amp; PROVENANCE PROTOCOLS</span>
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] mb-2.5">
          Privacy, Provenance &amp; Media Safety Guide
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl mx-auto">
          Simulate EXIF metadata exposure before sharing files publicly and master physical inspection checklists for AI media.
        </p>
      </div>

      {/* Interactive EXIF Privacy Risk Simulator */}
      <div className="glass-panel p-6 sm:p-8 rounded-[26px]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <div className="font-mono text-[11px] text-[var(--cyan-accent)] uppercase tracking-wider mb-1">
              Interactive Metadata Audit
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
              EXIF Privacy Risk Simulator
            </h3>
          </div>

          <div className="flex items-center gap-2.5">
            <span
              className={`mono-badge tabular-nums ${
                exposureScore === 0
                  ? 'mono-badge-real'
                  : exposureScore <= 35
                    ? 'mono-badge-warn'
                    : 'mono-badge-ai'
              }`}
            >
              {exposureScore === 0 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ShieldOff className="w-3.5 h-3.5" />}
              <span>EXPOSURE RISK: {exposureScore}%</span>
            </span>

            <button
              type="button"
              onClick={scrubAll}
              className="btn-secondary text-xs py-1.5 px-3.5"
            >
              <Eraser className="w-3.5 h-3.5 text-[var(--blue-light)]" />
              <span>Scrub All EXIF</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Toggle Controls */}
          <div className="lg:col-span-6 space-y-2.5">
            {EXIF_FIELDS.map((field) => {
              const isExposed = exposedFields[field.id];
              return (
                <button
                  key={field.id}
                  type="button"
                  onClick={() => toggleField(field.id)}
                  className={`w-full rounded-2xl p-3.5 border text-left flex items-center justify-between gap-3 transition-colors ${
                    isExposed
                      ? 'bg-[var(--sub-block-bg)] border-amber-500/35'
                      : 'bg-[var(--sub-block-bg)] border-[var(--border-hairline)] opacity-75'
                  }`}
                >
                  <div>
                    <div className="text-sm font-semibold text-[var(--text-primary)]">
                      {field.label}
                    </div>
                    <div className="font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
                      Weight: +{field.risk}% risk
                    </div>
                  </div>
                  <span
                    className={`mono-badge text-[10px] py-0.5 px-2.5 ${
                      isExposed ? 'mono-badge-warn' : 'mono-badge-real'
                    }`}
                  >
                    {isExposed ? 'EXPOSED' : 'SCRUBBED'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Live Simulated Container Payload */}
          <div className="lg:col-span-6 rounded-2xl bg-[#0d0e12] border border-[#27272a] p-4 sm:p-5 text-[#fcfcfc]">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
              <span className="font-mono text-[11px] text-[#ff5e78]">
                CONTAINER HEADER PREVIEW (JPEG / APP1)
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                {exposureScore === 0 ? 'SAFE FOR UPLOAD' : 'METADATA PRESENT'}
              </span>
            </div>

            <pre className="font-mono text-xs leading-relaxed overflow-x-auto text-slate-300">
{JSON.stringify(
  EXIF_FIELDS.reduce((acc, f) => {
    acc[f.id] = exposedFields[f.id] ? f.exposedValue : '[STRIPPED]';
    return acc;
  }, {}),
  null,
  2
)}
            </pre>
          </div>
        </div>
      </div>

      {/* 6 Security Topic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {guideCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="glass-panel glass-panel-interactive p-6 flex flex-col">
              <div className="w-11 h-11 rounded-2xl bg-[var(--badge-blue-bg)] border border-[var(--border-specular)] flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-[var(--badge-blue-text)]" />
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Practical Visual Anomaly Checklist */}
      <div className="glass-panel p-6 sm:p-8 rounded-[26px]">
        <div className="flex items-center gap-2.5 mb-5">
          <Sparkles className="w-5 h-5 text-[var(--blue-light)]" />
          <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
            Practical Visual Anomaly Checklist
          </h3>
        </div>

        <div className="space-y-3">
          {detectionTips.map((tip, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] p-4 flex items-start gap-3"
            >
              <CheckCircle2 className="w-4.5 h-4.5 text-[var(--success)] shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-[var(--text-primary)] mb-0.5">
                  {tip.title}
                </div>
                <div className="text-sm text-[var(--text-muted)] leading-relaxed">
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
