import React, { useState } from 'react';
import { 
  Newspaper, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  HelpCircle, 
  RotateCcw,
  ShieldCheck,
  Link2
} from 'lucide-react';

export default function FakeNewsChecker() {
  const [headline, setHeadline] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const presets = [
    {
      title: 'Sensational Clickbait Claim',
      text: 'SHOCKING SECRET: Scientists Warn Global Grid Failure Within 48 Hours, Government Hiding Truth!!!'
    },
    {
      title: 'Verifiable News Report',
      text: 'Regional Meteorological Agency issues standard winter storm advisory for northern coastal districts.'
    },
    {
      title: 'Unverified Health Panacea',
      text: 'Ancient Himalayan herb cures diabetes and reverse ages skin overnight with zero diet changes.'
    }
  ];

  const handleAnalyze = () => {
    if (!headline.trim()) return;

    setAnalyzing(true);
    setTimeout(() => {
      const text = headline.trim();
      const lower = text.toLowerCase();

      let clickbaitSignals = 0;
      let sensationalSignals = 0;
      let urgencySignals = 0;
      let evidenceFlags = [];

      // Clickbait triggers
      const clickbaitWords = ['shocking', 'secret', 'hiding', 'miracle', 'doctors stunned', 'they don’t want you to know', 'overnight', 'instant', 'won’t believe'];
      clickbaitWords.forEach(w => {
        if (lower.includes(w)) {
          clickbaitSignals += 25;
          evidenceFlags.push(`Clickbait phrasing detected: "${w}"`);
        }
      });

      // Capital letters check
      const capsCount = (text.match(/[A-Z]/g) || []).length;
      if (capsCount > 12 && capsCount / text.length > 0.22) {
        sensationalSignals += 35;
        evidenceFlags.push('Excessive uppercase text formatting used to induce urgency');
      }

      // Multiple exclamation / question marks
      if (/!{2,}/.test(text) || /\?{2,}/.test(text)) {
        sensationalSignals += 30;
        evidenceFlags.push('Punctuation exaggeration (multiple exclamation or question marks)');
      }

      // Fear / urgency words
      const urgencyWords = ['within 48 hours', 'danger', 'deadly', 'immediately', 'catastrophe', 'imminent', 'collapse', 'warning'];
      urgencyWords.forEach(w => {
        if (lower.includes(w)) {
          urgencySignals += 25;
          evidenceFlags.push(`High emotional polarity trigger: "${w}"`);
        }
      });

      const totalRisk = Math.min(95, Math.max(10, clickbaitSignals + sensationalSignals + urgencySignals));
      const credibilityScore = 100 - totalRisk;

      let verdict = 'Likely Authentic & Factual Format';
      let verdictStatus = 'supported';
      let verdictColor = '#16A34A';
      let verdictBg = '#F0FDF4';
      let riskLevel = 'LOW';
      let detailedVerdict = 'This headline follows objective journalistic formatting with restrained syntax and no sensational clickbait patterns.';

      if (totalRisk >= 60) {
        verdict = 'High Sensationalism / Probable Deceptive Media';
        verdictStatus = 'disputed';
        verdictColor = '#DC2626';
        verdictBg = '#FEF2F2';
        riskLevel = 'HIGH';
        detailedVerdict = 'This claim shows severe linguistic red flags including manipulative urgency, emotional distortion, and clickbait syntax.';
      } else if (totalRisk >= 35) {
        verdict = 'Unverified Claims / Sensationalized Phrasing';
        verdictStatus = 'unverified';
        verdictColor = '#D97706';
        verdictBg = '#FFFBEB';
        riskLevel = 'MODERATE';
        detailedVerdict = 'This statement contains exaggerated framing or unsupported assertions that warrant independent cross-checking.';
      }

      setAnalysis({
        headline: text,
        sourceUrl: sourceUrl.trim(),
        credibilityScore,
        riskScore: totalRisk,
        verdict,
        verdictStatus,
        verdictColor,
        verdictBg,
        riskLevel,
        detailedVerdict,
        evidenceFlags,
        metrics: [
          { name: 'Clickbait & Emotional Polarity', score: Math.min(100, clickbaitSignals + 10), flag: clickbaitSignals > 20 ? 'High' : 'Normal' },
          { name: 'Sensationalism / Syntax Distortion', score: Math.min(100, sensationalSignals + 10), flag: sensationalSignals > 20 ? 'High' : 'Normal' },
          { name: 'Urgency & Fear Induction Index', score: Math.min(100, urgencySignals + 10), flag: urgencySignals > 20 ? 'High' : 'Normal' }
        ]
      });

      setAnalyzing(false);
    }, 600);
  };

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Title Card */}
      <div style={{ textAlign: 'center', marginBottom: '34px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '7px 18px',
          borderRadius: '9999px',
          background: 'var(--badge-blue-bg)',
          marginBottom: '18px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <Newspaper size={14} color="var(--badge-blue-text)" />
          <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', fontWeight: '500', color: 'var(--badge-blue-text)' }}>
            VERILENS INFORMATION INTEGRITY SUITE
          </span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.15rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>
          Fake News &amp; Claim Credibility Scanner
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontWeight: '400', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', fontSize: '0.96rem', lineHeight: 1.6 }}>
          Inspect news headlines, claims, and social media posts for linguistic manipulation, emotional triggers, and signs of deceptive media.
        </p>
      </div>

      {/* Main Input Box (Smooth 24px, borderless, soft shadow) */}
      <div className="glass-panel" style={{ padding: '32px 28px', marginBottom: '24px', borderRadius: '24px' }}>
        <label style={{ display: 'block', fontSize: '0.88rem', fontFamily: 'var(--font-body)', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '10px' }}>
          Enter Headline, Claim, or Statement to Audit:
        </label>
        <textarea
          rows={3}
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="Paste article title or viral claim here (e.g. 'BREAKING: Secret research reveals miraculous new cure hidden by officials...')"
          style={{
            width: '100%',
            padding: '16px 18px',
            background: 'var(--sub-block-bg)',
            border: 'none',
            borderRadius: '16px',
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
            fontFamily: 'var(--font-body)',
            fontWeight: '400',
            resize: 'vertical',
            outline: 'none',
            marginBottom: '16px',
            boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.03)'
          }}
        />

        {/* Optional Source URL */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontFamily: 'var(--font-body)', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <Link2 size={13} color="var(--text-muted)" />
            <span>Source URL (Optional):</span>
          </label>
          <input
            type="url"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder="https://example.com/article"
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'var(--sub-block-bg)',
              border: 'none',
              borderRadius: '12px',
              color: 'var(--text-primary)',
              fontSize: '0.88rem',
              fontFamily: 'var(--font-body)',
              outline: 'none',
              boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.03)'
            }}
          />
        </div>

        {/* Preset quick buttons (Pills, borderless) */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{ fontSize: '0.76rem', fontFamily: 'var(--font-body)', color: 'var(--text-muted)', marginBottom: '10px', fontWeight: '500' }}>
            Or try a reference headline:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setHeadline(preset.text)}
                style={{
                  fontSize: '0.78rem',
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  background: 'var(--sub-block-bg)',
                  border: 'none',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  fontFamily: 'var(--font-body)',
                  fontWeight: '500',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--badge-blue-bg)';
                  e.currentTarget.style.color = 'var(--badge-blue-text)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--sub-block-bg)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          {headline && (
            <button
              onClick={() => { setHeadline(''); setAnalysis(null); }}
              className="btn-secondary"
              style={{ fontFamily: 'var(--font-body)', fontWeight: '500', padding: '12px 20px' }}
            >
              <RotateCcw size={15} color="var(--blue-light)" />
              <span>Reset</span>
            </button>
          )}
          <button
            onClick={handleAnalyze}
            disabled={!headline.trim() || analyzing}
            className="btn-primary"
            style={{ padding: '13px 28px', fontFamily: 'var(--font-body)', fontWeight: '600' }}
          >
            <Search size={16} color="#FFFFFF" strokeWidth={2.2} />
            <span style={{ color: '#FFFFFF' }}>{analyzing ? 'Scanning Linguistic Patterns...' : 'Audit Credibility'}</span>
          </button>
        </div>
      </div>

      {/* Analysis Results Display (Smooth 24px, borderless) */}
      {analysis && (
        <div className="glass-panel" style={{
          padding: '32px 28px',
          marginBottom: '24px',
          borderRadius: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '18px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.74rem',
                fontWeight: '500',
                padding: '5px 14px',
                borderRadius: '9999px',
                background: analysis.verdictBg,
                color: analysis.verdictColor,
                border: 'none'
              }}>
                RISK LEVEL: {analysis.riskLevel}
              </span>
            </div>

            <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: '500', color: 'var(--text-muted)' }}>
              Credibility Index: <strong style={{ color: 'var(--blue-light)', fontWeight: '500' }}>{analysis.credibilityScore}%</strong>
            </div>
          </div>

          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
            {analysis.verdict}
          </h3>

          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '22px', fontWeight: '400' }}>
            {analysis.detailedVerdict}
          </p>

          {/* Metric cards (Borderless) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px',
            marginBottom: '24px'
          }}>
            {analysis.metrics.map((m, i) => (
              <div key={i} style={{
                background: 'var(--sub-block-bg)',
                padding: '16px 18px',
                borderRadius: '16px',
                border: 'none'
              }}>
                <div style={{ fontSize: '0.76rem', fontFamily: 'var(--font-body)', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '500' }}>
                  {m.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: '500', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    {m.score}%
                  </span>
                  <span style={{
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: '500',
                    color: m.flag === 'High' ? '#DC2626' : '#16A34A',
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    background: m.flag === 'High' ? 'var(--error-bg)' : 'var(--success-bg)'
                  }}>
                    {m.flag}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Evidence flags if any */}
          {analysis.evidenceFlags && analysis.evidenceFlags.length > 0 && (
            <div style={{
              padding: '16px 20px',
              borderRadius: '16px',
              background: '#FFFBEB',
              marginBottom: '22px'
            }}>
              <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: '500', color: '#92400E', marginBottom: '8px' }}>
                DETECTED LINGUISTIC SIGNALS:
              </div>
              <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {analysis.evidenceFlags.map((flag, idx) => (
                  <li key={idx} style={{ fontSize: '0.84rem', fontFamily: 'var(--font-body)', fontWeight: '400', color: '#78350F' }}>
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Fact Check Resources */}
          <div style={{
            paddingTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-body)', color: '#64748B', fontWeight: '400' }}>
              Cross-verify claim in reputable global registries:
            </span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href={`https://toolbox.google.com/factcheck/explorer/search/list:57?hl=en&num_results=10&query=${encodeURIComponent(headline)}`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{ fontSize: '0.8rem', padding: '8px 16px', fontFamily: 'var(--font-body)', fontWeight: '500' }}
              >
                <span>Google Fact Check</span>
                <ExternalLink size={13} color="#2563EB" />
              </a>
              <a
                href={`https://www.reuters.com/fact-check/`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{ fontSize: '0.8rem', padding: '8px 16px', fontFamily: 'var(--font-body)', fontWeight: '500' }}
              >
                <span>Reuters</span>
                <ExternalLink size={13} color="#2563EB" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
