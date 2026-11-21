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
      let verdictBorder = '#BBF7D0';
      let riskLevel = 'LOW';
      let detailedVerdict = 'This headline follows objective journalistic formatting with restrained syntax and no sensational clickbait patterns.';

      if (totalRisk >= 60) {
        verdict = 'High Sensationalism / Probable Deceptive Media';
        verdictStatus = 'disputed';
        verdictColor = '#DC2626';
        verdictBg = '#FEF2F2';
        verdictBorder = '#FECACA';
        riskLevel = 'HIGH';
        detailedVerdict = 'This claim shows severe linguistic red flags including manipulative urgency, emotional distortion, and clickbait syntax.';
      } else if (totalRisk >= 35) {
        verdict = 'Unverified Claims / Sensationalized Phrasing';
        verdictStatus = 'unverified';
        verdictColor = '#D97706';
        verdictBg = '#FFFBEB';
        verdictBorder = '#FDE68A';
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
        verdictBorder,
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
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '24px',
          background: '#EFF6FF',
          border: '1px solid rgba(37,99,235,0.2)',
          marginBottom: '16px'
        }}>
          <Newspaper size={14} color="#2563EB" />
          <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#2563EB', fontWeight: '700' }}>
            VERILENS INFORMATION INTEGRITY SUITE
          </span>
        </div>
        <h2 style={{ fontSize: '2.1rem', fontWeight: '800', color: '#172B4D', marginBottom: '10px' }}>
          Fake News &amp; Claim Credibility Scanner
        </h2>
        <p style={{ color: '#475569', maxWidth: '640px', margin: '0 auto', fontSize: '0.96rem', lineHeight: 1.6 }}>
          Inspect news headlines, claims, and social media posts for linguistic manipulation, emotional triggers, and signs of deceptive media.
        </p>
      </div>

      {/* Main Input Box */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: '#172B4D', marginBottom: '8px' }}>
          Enter Headline, Claim, or Statement to Audit:
        </label>
        <textarea
          rows={3}
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="Paste article title or viral claim here (e.g. 'BREAKING: Secret research reveals miraculous new cure hidden by officials...')"
          style={{
            width: '100%',
            padding: '14px 16px',
            background: '#F8FAFC',
            border: '1px solid #CBD5E1',
            borderRadius: '8px',
            color: '#172B4D',
            fontSize: '0.95rem',
            fontFamily: 'inherit',
            resize: 'vertical',
            outline: 'none',
            marginBottom: '14px',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#2563EB'}
          onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
        />

        {/* Optional Source URL */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>
            <Link2 size={13} color="#64748B" />
            <span>Source URL (Optional):</span>
          </label>
          <input
            type="url"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder="https://example.com/article"
            style={{
              width: '100%',
              padding: '10px 14px',
              background: '#F8FAFC',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              color: '#172B4D',
              fontSize: '0.88rem',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#2563EB'}
            onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
          />
        </div>

        {/* Preset quick buttons */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '0.76rem', color: '#64748B', marginBottom: '8px', fontWeight: '600' }}>
            Or try a reference headline:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setHeadline(preset.text)}
                style={{
                  fontSize: '0.76rem',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  color: '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#EFF6FF';
                  e.currentTarget.style.color = '#2563EB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#F1F5F9';
                  e.currentTarget.style.color = '#475569';
                }}
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          {headline && (
            <button
              onClick={() => { setHeadline(''); setAnalysis(null); }}
              className="btn-secondary"
            >
              <RotateCcw size={15} />
              <span>Reset</span>
            </button>
          )}
          <button
            onClick={handleAnalyze}
            disabled={!headline.trim() || analyzing}
            className="btn-primary"
            style={{ padding: '12px 24px' }}
          >
            <Search size={16} />
            <span>{analyzing ? 'Scanning Linguistic Patterns...' : 'Audit Credibility'}</span>
          </button>
        </div>
      </div>

      {/* Analysis Results Display */}
      {analysis && (
        <div className="glass-panel" style={{
          padding: '28px',
          marginBottom: '24px',
          background: '#FFFFFF',
          borderColor: analysis.verdictBorder,
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.74rem',
                fontWeight: '800',
                padding: '4px 10px',
                borderRadius: '6px',
                background: analysis.verdictBg,
                color: analysis.verdictColor,
                border: `1px solid ${analysis.verdictBorder}`
              }}>
                RISK LEVEL: {analysis.riskLevel}
              </span>
            </div>

            <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#64748B' }}>
              Credibility Index: <strong style={{ color: '#2563EB' }}>{analysis.credibilityScore}%</strong>
            </div>
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#172B4D', marginBottom: '8px' }}>
            {analysis.verdict}
          </h3>

          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, marginBottom: '20px' }}>
            {analysis.detailedVerdict}
          </p>

          {/* Metric cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px',
            marginBottom: '22px'
          }}>
            {analysis.metrics.map((m, i) => (
              <div key={i} style={{
                background: '#F8FAFC',
                padding: '14px 16px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0'
              }}>
                <div style={{ fontSize: '0.76rem', color: '#64748B', marginBottom: '4px', fontWeight: '600' }}>
                  {m.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#172B4D', fontFamily: 'var(--font-mono)' }}>
                    {m.score}%
                  </span>
                  <span style={{
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: '700',
                    color: m.flag === 'High' ? '#DC2626' : '#16A34A',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: m.flag === 'High' ? '#FEF2F2' : '#F0FDF4',
                    border: `1px solid ${m.flag === 'High' ? '#FECACA' : '#BBF7D0'}`
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
              padding: '14px 16px',
              borderRadius: '8px',
              background: '#FFFBEB',
              border: '1px solid #FDE68A',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#92400E', marginBottom: '6px' }}>
                DETECTED LINGUISTIC SIGNALS:
              </div>
              <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {analysis.evidenceFlags.map((flag, idx) => (
                  <li key={idx} style={{ fontSize: '0.82rem', color: '#78350F' }}>
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Fact Check Resources */}
          <div style={{
            borderTop: '1px solid #E2E8F0',
            paddingTop: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
              Cross-verify claim in reputable global registries:
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <a
                href={`https://toolbox.google.com/factcheck/explorer/search/list:57?hl=en&num_results=10&query=${encodeURIComponent(headline)}`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{ fontSize: '0.78rem', padding: '6px 12px' }}
              >
                <span>Google Fact Check</span>
                <ExternalLink size={13} color="#2563EB" />
              </a>
              <a
                href={`https://www.reuters.com/fact-check/`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{ fontSize: '0.78rem', padding: '6px 12px' }}
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
