import React, { useState } from 'react';
import {
  Newspaper,
  Search,
  ExternalLink,
  RotateCcw,
  Link2,
  ShieldCheck,
  AlertTriangle,
  Globe
} from 'lucide-react';

const CLICKBAIT_WORDS = [
  'shocking',
  'secret',
  'hiding',
  'miracle',
  'doctors stunned',
  'they don’t want you to know',
  'overnight',
  'instant',
  'won’t believe'
];

const URGENCY_WORDS = [
  'within 48 hours',
  'danger',
  'deadly',
  'immediately',
  'catastrophe',
  'imminent',
  'collapse',
  'warning'
];

const PRESETS = [
  {
    title: 'Sensational Clickbait Claim',
    text: 'SHOCKING SECRET: Scientists Warn Global Grid Failure Within 48 Hours, Government Hiding Truth!!!',
    url: 'http://viral-breaking-alerts.example/grid-collapse'
  },
  {
    title: 'Verifiable News Report',
    text: 'Regional Meteorological Agency issues standard winter storm advisory for northern coastal districts.',
    url: 'https://www.reuters.com/world/'
  },
  {
    title: 'Unverified Health Panacea',
    text: 'Ancient Himalayan herb cures diabetes and reverse ages skin overnight with zero diet changes.',
    url: ''
  }
];

function buildAnnotatedSegments(text) {
  const tokens = text.split(/(\s+)/);
  const lowerFull = text.toLowerCase();
  const matchedPhrases = [...CLICKBAIT_WORDS, ...URGENCY_WORDS].filter((w) =>
    lowerFull.includes(w)
  );

  return tokens.map((part, idx) => {
    if (!part.trim()) return { text: part, kind: null, key: idx };
    const lower = part.toLowerCase();
    const isPhraseWord = matchedPhrases.some((phrase) =>
      phrase.split(/\s+/).some((pw) => lower.includes(pw))
    );
    const isExaggeratedPunct = /!{2,}|\?{2,}/.test(part);
    const isAllCaps = part.replace(/[^A-Za-z]/g, '').length >= 4 && part === part.toUpperCase();

    let kind = null;
    if (isPhraseWord) kind = 'trigger';
    else if (isExaggeratedPunct) kind = 'punctuation';
    else if (isAllCaps) kind = 'caps';

    return { text: part, kind, key: idx };
  });
}

function inspectSourceUrl(rawUrl) {
  if (!rawUrl || !rawUrl.trim()) return null;
  try {
    const parsed = new URL(rawUrl.trim());
    const isHttps = parsed.protocol === 'https:';
    const host = parsed.hostname.replace(/^www\./, '');
    const trustedExamples = ['reuters.com', 'apnews.com', 'bbc.com', 'nature.com', 'who.int', 'nasa.gov'];
    const isEstablished = trustedExamples.some((d) => host === d || host.endsWith(`.${d}`));
    return {
      valid: true,
      host,
      isHttps,
      isEstablished
    };
  } catch {
    return { valid: false };
  }
}

export default function FakeNewsChecker() {
  const [headline, setHeadline] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = () => {
    if (!headline.trim()) return;

    setAnalyzing(true);
    setTimeout(() => {
      const text = headline.trim();
      const lower = text.toLowerCase();

      let clickbaitSignals = 0;
      let sensationalSignals = 0;
      let urgencySignals = 0;
      const evidenceFlags = [];

      CLICKBAIT_WORDS.forEach((w) => {
        if (lower.includes(w)) {
          clickbaitSignals += 25;
          evidenceFlags.push(`Clickbait phrasing detected: "${w}"`);
        }
      });

      const capsCount = (text.match(/[A-Z]/g) || []).length;
      if (capsCount > 12 && capsCount / text.length > 0.22) {
        sensationalSignals += 35;
        evidenceFlags.push('Excessive uppercase formatting used to induce urgency');
      }

      if (/!{2,}/.test(text) || /\?{2,}/.test(text)) {
        sensationalSignals += 30;
        evidenceFlags.push('Punctuation exaggeration (multiple exclamation or question marks)');
      }

      URGENCY_WORDS.forEach((w) => {
        if (lower.includes(w)) {
          urgencySignals += 25;
          evidenceFlags.push(`High emotional polarity trigger: "${w}"`);
        }
      });

      const totalRisk = Math.min(95, Math.max(10, clickbaitSignals + sensationalSignals + urgencySignals));
      const credibilityScore = 100 - totalRisk;

      let verdict = 'Likely Authentic & Factual Format';
      let riskLevel = 'LOW';
      let badgeClass = 'mono-badge-real';
      let detailedVerdict =
        'This headline follows restrained journalistic formatting without sensational clickbait or emotional manipulation triggers.';

      if (totalRisk >= 60) {
        verdict = 'High Sensationalism / Probable Deceptive Media';
        riskLevel = 'HIGH';
        badgeClass = 'mono-badge-ai';
        detailedVerdict =
          'Severe linguistic red flags detected, including manipulative urgency, emotional distortion, or clickbait syntax.';
      } else if (totalRisk >= 35) {
        verdict = 'Unverified Claims / Sensationalized Phrasing';
        riskLevel = 'MODERATE';
        badgeClass = 'mono-badge-warn';
        detailedVerdict =
          'Contains exaggerated framing or unsupported assertions that warrant independent cross-checking.';
      }

      setAnalysis({
        headline: text,
        sourceUrl: sourceUrl.trim(),
        urlReport: inspectSourceUrl(sourceUrl),
        segments: buildAnnotatedSegments(text),
        credibilityScore,
        riskScore: totalRisk,
        verdict,
        badgeClass,
        riskLevel,
        detailedVerdict,
        evidenceFlags,
        metrics: [
          {
            name: 'Clickbait & Emotional Polarity',
            score: Math.min(100, clickbaitSignals + 10),
            flag: clickbaitSignals > 20 ? 'High' : 'Normal'
          },
          {
            name: 'Sensationalism / Syntax Distortion',
            score: Math.min(100, sensationalSignals + 10),
            flag: sensationalSignals > 20 ? 'High' : 'Normal'
          },
          {
            name: 'Urgency & Fear Induction Index',
            score: Math.min(100, urgencySignals + 10),
            flag: urgencySignals > 20 ? 'High' : 'Normal'
          }
        ]
      });

      setAnalyzing(false);
    }, 450);
  };

  return (
    <div className="max-w-5xl mx-auto pb-10 space-y-6">
      {/* Header */}
      <div className="text-center">
        <span className="mono-badge mono-badge-blue mb-4">
          <Newspaper className="w-3.5 h-3.5" />
          <span>VERILENS INFORMATION INTEGRITY LAB</span>
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] mb-2.5">
          Fake News &amp; Claim Credibility Scanner
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl mx-auto">
          Audit headlines, viral claims, and source URLs with inline trigger-phrase annotation and linguistic manipulation scoring.
        </p>
      </div>

      {/* Main Input Workbench */}
      <div className="glass-panel p-6 sm:p-8 rounded-[26px]">
        <label
          htmlFor="claim-input"
          className="block text-sm font-semibold text-[var(--text-primary)] mb-2.5"
        >
          Headline, Claim, or Social Post
        </label>
        <textarea
          id="claim-input"
          rows={3}
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="Paste article title or viral claim here..."
          className="w-full rounded-2xl bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] px-4 py-3.5 text-sm sm:text-base text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] focus:border-[var(--blue)] focus:outline-none mb-4"
        />

        <div className="mb-5">
          <label
            htmlFor="source-url-input"
            className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] mb-2"
          >
            <Link2 className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <span>Source URL (Optional Domain &amp; TLS Check)</span>
          </label>
          <input
            id="source-url-input"
            type="url"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder="https://example.com/article"
            className="w-full rounded-xl bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] px-4 py-2.5 text-sm font-mono text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] focus:border-[var(--blue)] focus:outline-none"
          />
        </div>

        {/* Reference Presets */}
        <div className="mb-6">
          <div className="text-xs font-medium text-[var(--text-muted)] mb-2.5">
            Load reference specimen:
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setHeadline(preset.text);
                  setSourceUrl(preset.url);
                }}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] text-[var(--text-primary)] hover:border-[var(--border-specular)] hover:text-[var(--blue-light)] transition-colors"
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          {headline && (
            <button
              type="button"
              onClick={() => {
                setHeadline('');
                setSourceUrl('');
                setAnalysis(null);
              }}
              className="btn-secondary px-5 py-2.5 text-sm"
            >
              <RotateCcw className="w-4 h-4 text-[var(--blue-light)]" />
              <span>Reset</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!headline.trim() || analyzing}
            className="btn-primary px-7 py-2.5 text-sm"
          >
            <Search className="w-4 h-4" />
            <span>{analyzing ? 'Scanning Syntax...' : 'Audit Credibility'}</span>
          </button>
        </div>
      </div>

      {/* Results Card */}
      {analysis && (
        <div className="glass-panel p-6 sm:p-8 rounded-[26px] space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className={`mono-badge ${analysis.badgeClass}`}>
              {analysis.riskLevel === 'LOW' ? (
                <ShieldCheck className="w-3.5 h-3.5" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5" />
              )}
              <span>RISK LEVEL: {analysis.riskLevel}</span>
            </span>

            <div className="font-mono text-xs sm:text-sm text-[var(--text-muted)] tabular-nums">
              Credibility Index:{' '}
              <strong className="text-[var(--blue-light)] font-bold">
                {analysis.credibilityScore}%
              </strong>
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-1.5">
              {analysis.verdict}
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              {analysis.detailedVerdict}
            </p>
          </div>

          {/* Animated Risk & Credibility Bar */}
          <div className="rounded-2xl bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] p-4">
            <div className="flex justify-between font-mono text-[11px] mb-2 tabular-nums">
              <span className="text-[var(--success)]">CREDIBILITY {analysis.credibilityScore}%</span>
              <span className="text-[var(--error)]">MANIPULATION RISK {analysis.riskScore}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-500/20 overflow-hidden flex">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${analysis.credibilityScore}%` }}
              />
              <div
                className="h-full bg-red-500 transition-all duration-500"
                style={{ width: `${analysis.riskScore}%` }}
              />
            </div>
          </div>

          {/* Inline Highlighted Claim Annotation */}
          <div className="rounded-2xl bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] p-4">
            <div className="font-mono text-[11px] text-[var(--text-muted)] uppercase mb-2">
              Annotated Headline Syntax
            </div>
            <p className="text-base leading-relaxed text-[var(--text-primary)]">
              {analysis.segments.map((seg) => {
                if (!seg.kind) return <React.Fragment key={seg.key}>{seg.text}</React.Fragment>;
                const styleClass =
                  seg.kind === 'trigger'
                    ? 'bg-[var(--error-bg)] text-[var(--error)] border border-red-500/30'
                    : seg.kind === 'caps'
                      ? 'bg-[var(--warning-bg)] text-[var(--warning)] border border-amber-500/30'
                      : 'bg-purple-500/15 text-purple-400 border border-purple-500/30';
                return (
                  <mark key={seg.key} className={`px-1.5 py-0.5 rounded-md font-medium ${styleClass}`}>
                    {seg.text}
                  </mark>
                );
              })}
            </p>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {analysis.metrics.map((m, i) => (
              <div
                key={i}
                className="rounded-2xl bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] p-4"
              >
                <div className="text-xs font-medium text-[var(--text-muted)] mb-2">{m.name}</div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xl font-semibold text-[var(--text-primary)] tabular-nums">
                    {m.score}%
                  </span>
                  <span
                    className={`mono-badge text-[10px] py-0.5 px-2.5 ${
                      m.flag === 'High' ? 'mono-badge-ai' : 'mono-badge-real'
                    }`}
                  >
                    {m.flag}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* URL Domain Inspection */}
          {analysis.urlReport && (
            <div className="rounded-2xl bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-[var(--blue-light)] shrink-0" />
                {analysis.urlReport.valid ? (
                  <div className="text-xs sm:text-sm text-[var(--text-primary)]">
                    Domain: <span className="font-mono font-semibold">{analysis.urlReport.host}</span>
                    <span className="mx-2 text-[var(--text-muted)]">·</span>
                    <span className={analysis.urlReport.isHttps ? 'text-[var(--success)]' : 'text-[var(--warning)]'}>
                      {analysis.urlReport.isHttps ? 'TLS HTTPS Verified' : 'Unencrypted HTTP'}
                    </span>
                  </div>
                ) : (
                  <div className="text-xs text-[var(--warning)]">
                    Provided URL is malformed; inspect domain carefully before trusting.
                  </div>
                )}
              </div>
              {analysis.urlReport.valid && (
                <span
                  className={`mono-badge text-[10px] py-0.5 px-2.5 ${
                    analysis.urlReport.isEstablished ? 'mono-badge-real' : 'mono-badge-warn'
                  }`}
                >
                  {analysis.urlReport.isEstablished ? 'RECOGNIZED WIRE' : 'UNVERIFIED DOMAIN'}
                </span>
              )}
            </div>
          )}

          {/* Evidence Flags */}
          {analysis.evidenceFlags.length > 0 && (
            <div className="rounded-2xl bg-[var(--warning-bg)] border border-amber-500/30 p-4">
              <div className="font-mono text-xs font-semibold text-[var(--warning)] mb-2">
                DETECTED LINGUISTIC SIGNALS
              </div>
              <ul className="list-disc pl-5 space-y-1 text-sm text-[var(--text-secondary)]">
                {analysis.evidenceFlags.map((flag, idx) => (
                  <li key={idx}>{flag}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Cross-Verify Links */}
          <div className="pt-4 border-t border-[var(--border-hairline)] flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-[var(--text-muted)]">
              Cross-verify claim in global fact-checking registries:
            </span>
            <div className="flex flex-wrap gap-2.5">
              <a
                href={`https://toolbox.google.com/factcheck/explorer/search/list:57?hl=en&num_results=10&query=${encodeURIComponent(analysis.headline)}`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary text-xs py-2 px-4"
              >
                <span>Google Fact Check</span>
                <ExternalLink className="w-3.5 h-3.5 text-[var(--blue-light)]" />
              </a>
              <a
                href="https://www.reuters.com/fact-check/"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary text-xs py-2 px-4"
              >
                <span>Reuters Fact Check</span>
                <ExternalLink className="w-3.5 h-3.5 text-[var(--blue-light)]" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
