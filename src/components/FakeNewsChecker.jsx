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
      let verdictColor = '#10b981';
      let riskLevel = 'LOW';

      if (totalRisk >= 65) {
        verdict = 'High Sensationalism / Probable Deceptive Media';
        verdictColor = '#ef4444';
        riskLevel = 'HIGH';
      } else if (totalRisk >= 40) {
        verdict = 'Unverified Claims / Sensationalized Phrasing';
        verdictColor = '#f59e0b';
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
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '20px',
          background: 'rgba(0, 240, 255, 0.1)',
          border: '1px solid rgba(0, 240, 255, 0.3)',
          marginBottom: '16px'
        }}>
          <Newspaper size={14} color="#00f0ff" />
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#38bdf8', fontWeight: '600' }}>
            VERILENS INFORMATION INTEGRITY SUITE
          </span>
        </div>
        <h2 style={{ fontSize: '2.1rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px' }}>
          Fake News &amp; Claim Credibility Scanner
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', fontSize: '0.95rem' }}>
          Inspect news headlines, social media posts, and viral claims for linguistic manipulation, hyper-partisan rhetoric, and lack of verified sourcing.
        </p>
      </div>

      {/* Main Input Box */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>
          Enter Headline, Claim, or Statement to Audit:
        </label>
        <textarea
          rows={3}
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="Paste article title or viral claim here (e.g. 'BREAKING: Secret research reveals miraculous new cure hidden by officials...')"
          style={{
            width: '100%',
            padding: '14px',
            background: 'rgba(7, 11, 20, 0.75)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            borderRadius: '10px',
            color: '#ffffff',
            fontSize: '0.95rem',
            fontFamily: 'inherit',
            resize: 'vertical',
            outline: 'none',
            marginBottom: '16px'
          }}
        />

        {/* Preset quick buttons */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Or try a reference headline:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setHeadline(preset.text)}
                style={{
                  fontSize: '0.75rem',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(56, 189, 248, 0.15)',
                  color: '#94a3b8',
                  cursor: 'pointer'
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
          >
            <Search size={16} />
            <span>{analyzing ? 'Scanning Linguistic Patterns...' : 'Audit Credibility'}</span>
          </button>
        </div>
      </div>

      {/* Analysis Results Display */}
      {analysis && (
        <div className="glass-panel" style={{
          padding: '24px',
          marginBottom: '24px',
          borderColor: analysis.verdictColor,
          boxShadow: `0 0 25px ${analysis.verdictColor}33`
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
                fontSize: '0.72rem',
                fontWeight: '700',
                padding: '3px 8px',
                borderRadius: '4px',
                background: `${analysis.verdictColor}22`,
                color: analysis.verdictColor,
                border: `1px solid ${analysis.verdictColor}44`
              }}>
                RISK LEVEL: {analysis.riskLevel}
              </span>
            </div>

            <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
              Credibility Index: <strong style={{ color: '#ffffff' }}>{analysis.credibilityScore}%</strong>
            </div>
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#ffffff', marginBottom: '14px' }}>
            {analysis.verdict}
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px',
            marginBottom: '20px'
          }}>
            {analysis.metrics.map((m, i) => (
              <div key={i} style={{
                background: 'rgba(7, 11, 20, 0.65)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(56, 189, 248, 0.1)'
              }}>
                <div style={{ fontSize: '0.76rem', color: '#cbd5e1', marginBottom: '4px' }}>{m.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                    {m.score}%
                  </span>
                  <span style={{
                    fontSize: '0.65rem',
                    fontFamily: 'var(--font-mono)',
                    color: m.flag === 'High' ? '#f87171' : '#34d399'
                  }}>
                    {m.flag}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Fact Check Resources */}
          <div style={{
            borderTop: '1px solid rgba(56, 189, 248, 0.12)',
            paddingTop: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Cross-verify claim in reputable global registries:
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <a
                href={`https://toolbox.google.com/factcheck/explorer/search/list:57?hl=en&num_results=10&query=${encodeURIComponent(headline)}`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '6px 12px' }}
              >
                <span>Google Fact Check</span>
                <ExternalLink size={12} />
              </a>
              <a
                href={`https://www.reuters.com/fact-check/`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '6px 12px' }}
              >
                <span>Reuters</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
