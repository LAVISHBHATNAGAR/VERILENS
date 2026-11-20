import React, { useState } from 'react';
import { 
  Newspaper, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  HelpCircle,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export default function FakeNewsChecker() {
  const [headline, setHeadline] = useState('');
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

      // Heuristic linguistic scoring
      let clickbaitSignals = 0;
      let sensationalSignals = 0;
      let urgencySignals = 0;

      // Clickbait triggers
      const clickbaitWords = ['shocking', 'secret', 'hiding', 'miracle', 'doctors stunned', 'they don’t want you to know', 'overnight', 'instant'];
      clickbaitWords.forEach(w => {
        if (lower.includes(w)) clickbaitSignals += 25;
      });

      // Capital letters check
      const capsCount = (text.match(/[A-Z]/g) || []).length;
      if (capsCount > 15 && capsCount / text.length > 0.25) {
        sensationalSignals += 35;
      }

      // Multiple exclamation marks
      if (/!{2,}/.test(text) || /\?{2,}/.test(text)) {
        sensationalSignals += 30;
      }

      // Fear / urgency words
      const urgencyWords = ['within 48 hours', 'danger', 'deadly', 'immediately', 'catastrophe', 'imminent'];
      urgencyWords.forEach(w => {
        if (lower.includes(w)) urgencySignals += 30;
      });

      const totalRisk = Math.min(95, Math.max(12, clickbaitSignals + sensationalSignals + urgencySignals));
      const credibilityScore = 100 - totalRisk;

      let verdict = 'Likely Authentic & Factual Format';
      let verdictColor = '#D2F500';
      let riskLevel = 'LOW';

      if (totalRisk >= 65) {
        verdict = 'High Sensationalism / Probable Deceptive Media';
        verdictColor = '#FF4757';
        riskLevel = 'HIGH';
      } else if (totalRisk >= 40) {
        verdict = 'Unverified Claims / Sensationalized Phrasing';
        verdictColor = '#FFB800';
        riskLevel = 'MODERATE';
      }

      setAnalysis({
        headline: text,
        credibilityScore,
        riskScore: totalRisk,
        verdict,
        verdictColor,
        riskLevel,
        metrics: [
          { name: 'Clickbait & Emotional Polarity', score: Math.min(100, clickbaitSignals + 15), flag: clickbaitSignals > 20 ? 'High' : 'Normal' },
          { name: 'Sensationalism / Syntax Distortion', score: Math.min(100, sensationalSignals + 10), flag: sensationalSignals > 25 ? 'High' : 'Normal' },
          { name: 'Urgency & Fear Induction Index', score: Math.min(100, urgencySignals + 10), flag: urgencySignals > 20 ? 'High' : 'Normal' }
        ]
      });

      setAnalyzing(false);
    }, 700);
  };

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Title Card */}
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
          <Newspaper size={15} color="#D2F500" />
          <span style={{ fontSize: '0.76rem', fontFamily: 'var(--font-mono)', color: '#D2F500', fontWeight: '700' }}>
            VERILENS INFORMATION INTEGRITY SUITE
          </span>
        </div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--ghost-white)', marginBottom: '10px' }}>
          Fake News &amp; Claim Credibility Scanner
        </h2>
        <p style={{ color: 'var(--ghost-white-subtle)', maxWidth: '660px', margin: '0 auto', fontSize: '0.96rem', lineHeight: 1.6 }}>
          Inspect news headlines, social media posts, and viral claims for linguistic manipulation, hyper-partisan rhetoric, and lack of verified sourcing.
        </p>
      </div>

      {/* Main Input Box */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px', background: 'rgba(12, 51, 85, 0.75)' }}>
        <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: 'var(--ghost-white)', marginBottom: '10px' }}>
          Enter Headline, Claim, or Statement to Audit:
        </label>
        <textarea
          rows={3}
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="Paste article title or viral claim here (e.g. 'BREAKING: Secret research reveals miraculous new cure hidden by officials...')"
          style={{
            width: '100%',
            padding: '16px',
            background: 'rgba(5, 24, 41, 0.8)',
            border: '1px solid rgba(248, 248, 255, 0.14)',
            borderRadius: '10px',
            color: 'var(--ghost-white)',
            fontSize: '0.96rem',
            fontFamily: 'inherit',
            resize: 'vertical',
            outline: 'none',
            marginBottom: '18px'
          }}
        />

        {/* Preset quick buttons */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '0.76rem', color: 'var(--ghost-white-muted)', marginBottom: '10px' }}>
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
                  padding: '6px 14px',
                  borderRadius: '7px',
                  background: 'rgba(5, 24, 41, 0.7)',
                  border: '1px solid rgba(248, 248, 255, 0.12)',
                  color: 'var(--ghost-white-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
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
            >
              <RotateCcw size={15} />
              <span>Reset</span>
            </button>
          )}
          {/* Audit CTA (Acid Green) */}
          <button
            onClick={handleAnalyze}
            disabled={!headline.trim() || analyzing}
            className="btn-primary"
            style={{ padding: '12px 26px' }}
          >
            <Search size={16} color="#092742" />
            <span>{analyzing ? 'Scanning Linguistic Patterns...' : 'Audit Credibility'}</span>
          </button>
        </div>
      </div>

      {/* Analysis Results Display */}
      {analysis && (
        <div className="glass-panel" style={{
          padding: '28px',
          marginBottom: '24px',
          background: 'rgba(12, 51, 85, 0.85)',
          borderColor: analysis.verdictColor,
          boxShadow: `0 0 30px ${analysis.verdictColor}33`
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
                fontWeight: '800',
                padding: '4px 10px',
                borderRadius: '6px',
                background: `${analysis.verdictColor}22`,
                color: analysis.verdictColor,
                border: `1px solid ${analysis.verdictColor}55`
              }}>
                RISK LEVEL: {analysis.riskLevel}
              </span>
            </div>

            <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--ghost-white-subtle)' }}>
              Credibility Index: <strong style={{ color: '#D2F500' }}>{analysis.credibilityScore}%</strong>
            </div>
          </div>

          <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--ghost-white)', marginBottom: '16px' }}>
            {analysis.verdict}
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px',
            marginBottom: '22px'
          }}>
            {analysis.metrics.map((m, i) => (
              <div key={i} style={{
                background: 'rgba(5, 24, 41, 0.7)',
                padding: '14px',
                borderRadius: '10px',
                border: '1px solid rgba(248, 248, 255, 0.08)'
              }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--ghost-white-muted)', marginBottom: '4px' }}>{m.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--ghost-white)', fontFamily: 'var(--font-mono)' }}>
                    {m.score}%
                  </span>
                  <span style={{
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: '700',
                    color: m.flag === 'High' ? '#FF6B6B' : '#D2F500'
                  }}>
                    {m.flag}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Fact Check Resources */}
          <div style={{
            borderTop: '1px solid rgba(248, 248, 255, 0.1)',
            paddingTop: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--ghost-white-muted)' }}>
              Cross-verify claim in reputable global registries:
            </span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href={`https://toolbox.google.com/factcheck/explorer/search/list:57?hl=en&num_results=10&query=${encodeURIComponent(headline)}`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{ fontSize: '0.78rem', padding: '7px 14px' }}
              >
                <span>Google Fact Check</span>
                <ExternalLink size={13} color="#D2F500" />
              </a>
              <a
                href={`https://www.reuters.com/fact-check/`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{ fontSize: '0.78rem', padding: '7px 14px' }}
              >
                <span>Reuters</span>
                <ExternalLink size={13} color="#D2F500" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
