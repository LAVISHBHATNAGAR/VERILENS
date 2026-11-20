import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Download, 
  RefreshCw, 
  FileText, 
  ShieldAlert, 
  ShieldCheck, 
  Layers, 
  Info, 
  Lock, 
  ChevronDown, 
  ChevronUp,
  Activity,
  AlertCircle
} from 'lucide-react';
import { downloadPdfReport, downloadJsonData } from '../services/reportGenerator';
import confetti from 'canvas-confetti';

export default function AnalysisResult({ 
  result, 
  imageItem, 
  onReset, 
  onOpenApiConfig 
}) {
  const [expandedAnomalies, setExpandedAnomalies] = useState(true);
  const [downloading, setDownloading] = useState(false);

  if (!result) return null;

  const isAi = result.verdictLevel === 'ai';
  const isReal = result.verdictLevel === 'real';
  const isInconclusive = result.verdictLevel === 'inconclusive';

  const handleDownloadPdf = () => {
    setDownloading(true);
    try {
      downloadPdfReport(result, imageItem?.dataUrl);
      if (isReal) {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#D2F500', '#F8F8FF', '#092742']
        });
      }
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleExportJson = () => {
    downloadJsonData(result);
  };

  const themeColors = {
    ai: {
      primary: '#FF4757',
      bg: 'rgba(255, 71, 87, 0.12)',
      border: 'rgba(255, 71, 87, 0.45)',
      glow: 'rgba(255, 71, 87, 0.25)',
      badge: 'mono-badge-ai',
      icon: AlertTriangle
    },
    real: {
      primary: '#D2F500',
      bg: 'rgba(210, 245, 0, 0.12)',
      border: 'rgba(210, 245, 0, 0.45)',
      glow: 'rgba(210, 245, 0, 0.25)',
      badge: 'mono-badge-real',
      icon: CheckCircle2
    },
    inconclusive: {
      primary: '#FFB800',
      bg: 'rgba(255, 184, 0, 0.12)',
      border: 'rgba(255, 184, 0, 0.45)',
      glow: 'rgba(255, 184, 0, 0.25)',
      badge: 'mono-badge-warn',
      icon: HelpCircle
    }
  };

  const currentTheme = themeColors[result.verdictLevel] || themeColors.inconclusive;
  const VerdictIcon = currentTheme.icon;

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', animation: 'fadeIn 0.3s ease' }}>
      {/* Top Main Result Hero Card */}
      <div className="glass-panel" style={{
        padding: '36px 30px',
        marginBottom: '24px',
        background: 'rgba(12, 51, 85, 0.85)',
        borderColor: currentTheme.border,
        boxShadow: `0 16px 48px -10px rgba(0, 0, 0, 0.7), 0 0 35px -5px ${currentTheme.glow}`,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle accent corner glow */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: currentTheme.glow,
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }} />

        {/* Header with Verdict & Reference Tag */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className={`mono-badge ${currentTheme.badge}`}>
              <VerdictIcon size={13} />
              <span>FORENSIC ASSESSMENT</span>
            </span>
            <span style={{
              fontSize: '0.74rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--ghost-white-muted)'
            }}>
              ID: {result.id}
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.78rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--ghost-white-subtle)'
          }}>
            <span>ENGINE:</span>
            <span style={{ color: '#D2F500', fontWeight: '700' }}>
              {result.isRealEngine ? 'Multi-Signal Forensic Engine' : 'Client-Side Signal Engine'}
            </span>
          </div>
        </div>

        {/* Main Verdict Display */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '26px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '16px',
            background: currentTheme.bg,
            border: `1px solid ${currentTheme.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 28px ${currentTheme.glow}`,
            flexShrink: 0
          }}>
            <VerdictIcon size={40} color={currentTheme.primary} />
          </div>

          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <h2 style={{
                fontSize: 'clamp(1.7rem, 3.8vw, 2.3rem)',
                fontWeight: '800',
                color: 'var(--ghost-white)',
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              }}>
                {result.verdict}
              </h2>

              <span style={{
                fontSize: '0.74rem',
                fontFamily: 'var(--font-mono)',
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'rgba(5, 24, 41, 0.8)',
                border: `1px solid ${currentTheme.border}`,
                color: currentTheme.primary,
                fontWeight: '800'
              }}>
                CONFIDENCE: {result.confidenceLevel || 'Calibrated'} ({result.confidence || 0}%)
              </span>
            </div>

            <div style={{
              fontSize: '0.92rem',
              color: 'var(--ghost-white-subtle)',
              marginTop: '5px'
            }}>
              {isInconclusive ? (
                <span>Evidence is ambiguous or insufficient to categorize image with certainty.</span>
              ) : isAi ? (
                <span>Synthetic generative patterns detected with <strong>{result.confidence}% calibrated confidence</strong>.</span>
              ) : (
                <span>Optical camera signatures detected with <strong>{result.confidence}% calibrated confidence</strong>.</span>
              )}
            </div>
          </div>
        </div>

        {/* Dual Likelihood Progress Bar & Metrics */}
        <div style={{
          background: 'rgba(5, 24, 41, 0.75)',
          padding: '22px',
          borderRadius: '12px',
          border: '1px solid rgba(248, 248, 255, 0.1)',
          marginBottom: '26px'
        }}>
          {/* Percentages Bar Headings */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '12px',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div>
              <div style={{ fontSize: '0.76rem', fontFamily: 'var(--font-mono)', color: '#FF6B6B', fontWeight: '700' }}>
                AI SYNTHESIS LIKELIHOOD
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: '800', color: 'var(--ghost-white)', fontFamily: 'var(--font-mono)' }}>
                {result.aiScore}%
              </div>
            </div>

            {isInconclusive && (
              <div style={{
                textAlign: 'center',
                padding: '4px 14px',
                borderRadius: '6px',
                background: 'rgba(255, 184, 0, 0.15)',
                border: '1px solid rgba(255, 184, 0, 0.4)',
                color: '#FFB800',
                fontSize: '0.74rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: '700'
              }}>
                UNCERTAINTY SYSTEM TRIGGERED (AMBIGUOUS ZONE)
              </div>
            )}

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.76rem', fontFamily: 'var(--font-mono)', color: '#D2F500', fontWeight: '700' }}>
                AUTHENTIC CAPTURE LIKELIHOOD
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: '800', color: 'var(--ghost-white)', fontFamily: 'var(--font-mono)' }}>
                {result.realScore}%
              </div>
            </div>
          </div>

          {/* Split Visual Progress Bar */}
          <div style={{
            width: '100%',
            height: '14px',
            borderRadius: '7px',
            background: 'rgba(9, 39, 66, 0.9)',
            overflow: 'hidden',
            display: 'flex',
            boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.6)'
          }}>
            <div style={{
              width: `${result.aiScore}%`,
              background: 'linear-gradient(90deg, #FF4757 0%, #FF6B6B 100%)',
              boxShadow: '0 0 12px rgba(255, 71, 87, 0.5)',
              transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }} />
            <div style={{
              width: `${result.realScore}%`,
              background: 'linear-gradient(90deg, #D2F500 0%, #ffffff 100%)',
              boxShadow: '0 0 12px rgba(210, 245, 0, 0.5)',
              transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }} />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.7rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--ghost-white-muted)',
            marginTop: '8px'
          }}>
            <span>SYNTHETIC FREQUENCY SPECTRUM</span>
            <span>PHYSICAL SENSOR GRAIN SPECTRUM</span>
          </div>
        </div>

        {/* Short Explanation & Model Assessment */}
        <div style={{
          padding: '18px 22px',
          borderRadius: '10px',
          background: 'rgba(5, 24, 41, 0.6)',
          borderLeft: `4px solid ${currentTheme.primary}`,
          marginBottom: '24px'
        }}>
          <div style={{
            fontSize: '0.82rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: '700',
            color: 'var(--ghost-white)',
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Info size={15} color="#D2F500" />
            <span>MODEL ASSESSMENT &amp; EXPLANATION</span>
          </div>
          <p style={{
            fontSize: '0.95rem',
            color: 'var(--ghost-white-subtle)',
            lineHeight: 1.65
          }}>
            {result.summary}
          </p>
        </div>

        {/* 4-Pillar Multi-Signal Breakdown Matrix */}
        {result.pillars && (
          <div style={{ marginTop: '26px' }}>
            <div style={{
              fontSize: '0.84rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: '700',
              color: 'var(--ghost-white)',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Layers size={15} color="#D2F500" />
              <span>MULTI-SIGNAL FORENSIC DOMAINS</span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '12px'
            }}>
              {result.pillars.map((pillar, idx) => (
                <div 
                  key={idx}
                  style={{
                    background: 'rgba(5, 24, 41, 0.65)',
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1px solid rgba(248, 248, 255, 0.08)'
                  }}
                >
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--ghost-white)', marginBottom: '4px' }}>
                    {pillar.name}
                  </div>
                  <div style={{
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-mono)',
                    color: pillar.color === 'red' ? '#FF6B6B' : pillar.color === 'emerald' ? '#D2F500' : '#FFB800',
                    fontWeight: '700'
                  }}>
                    {pillar.status}
                  </div>
                  <div style={{
                    width: '100%',
                    height: '5px',
                    background: 'rgba(9, 39, 66, 0.8)',
                    borderRadius: '3px',
                    marginTop: '10px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${pillar.score}%`,
                      height: '100%',
                      background: pillar.color === 'red' ? '#FF4757' : pillar.color === 'emerald' ? '#D2F500' : '#FFB800'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Detected Irregularities & Indicators Accordion */}
      <div className="glass-panel" style={{
        padding: '26px',
        marginBottom: '24px',
        background: 'rgba(12, 51, 85, 0.75)'
      }}>
        <div 
          onClick={() => setExpandedAnomalies(!expandedAnomalies)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '9px',
              background: 'rgba(210, 245, 0, 0.12)',
              border: '1px solid rgba(210, 245, 0, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldAlert size={19} color="#D2F500" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--ghost-white)' }}>
                Detected Indicators &amp; Anomaly Signals ({result.anomalies?.length || 0})
              </h3>
              <p style={{ fontSize: '0.76rem', color: 'var(--ghost-white-muted)' }}>
                Frequency spectrum peaks, sensor grain floor, and container provenance logs
              </p>
            </div>
          </div>

          <button style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--ghost-white-subtle)',
            cursor: 'pointer',
            padding: '4px'
          }}>
            {expandedAnomalies ? <ChevronUp size={22} color="#D2F500" /> : <ChevronDown size={22} />}
          </button>
        </div>

        {expandedAnomalies && (
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {result.anomalies?.map((ano, idx) => {
              const isAnomaly = ano.type === 'ANOMALY' || ano.type === 'DEFINITIVE_ANOMALY';
              const isAuthentic = ano.type === 'AUTHENTIC';

              return (
                <div 
                  key={idx}
                  style={{
                    background: 'rgba(5, 24, 41, 0.65)',
                    padding: '16px 18px',
                    borderRadius: '10px',
                    border: '1px solid rgba(248, 248, 255, 0.08)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginBottom: '6px'
                  }}>
                    <div style={{
                      fontSize: '0.94rem',
                      fontWeight: '700',
                      color: 'var(--ghost-white)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: isAnomaly ? '#FF4757' : isAuthentic ? '#D2F500' : '#FFB800'
                      }} />
                      <span>{ano.name || ano.title}</span>
                    </div>

                    <span style={{
                      fontSize: '0.66rem',
                      fontFamily: 'var(--font-mono)',
                      padding: '3px 8px',
                      borderRadius: '5px',
                      background: isAnomaly ? 'rgba(255, 71, 87, 0.15)' : isAuthentic ? 'rgba(210, 245, 0, 0.15)' : 'rgba(255, 184, 0, 0.15)',
                      color: isAnomaly ? '#FF6B6B' : isAuthentic ? '#D2F500' : '#FFB800',
                      fontWeight: '800'
                    }}>
                      {isAnomaly ? 'ANOMALY MARKER' : isAuthentic ? 'AUTHENTIC SIGNAL' : 'NEUTRAL NOTE'}
                    </span>
                  </div>

                  <p style={{
                    fontSize: '0.86rem',
                    color: 'var(--ghost-white-subtle)',
                    lineHeight: 1.55,
                    paddingLeft: '16px'
                  }}>
                    {ano.detail || ano.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Limitations of Analysis & Reliability Notice */}
      {result.limitations && result.limitations.length > 0 && (
        <div className="glass-panel" style={{
          padding: '22px 26px',
          marginBottom: '24px',
          background: 'rgba(12, 51, 85, 0.65)',
          borderLeft: '4px solid #D2F500'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <AlertCircle size={17} color="#D2F500" />
            <span style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--ghost-white)', fontFamily: 'var(--font-mono)' }}>
              LIMITATIONS OF THIS ANALYSIS
            </span>
          </div>
          <ul style={{ paddingLeft: '22px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {result.limitations.map((lim, idx) => (
              <li key={idx} style={{ fontSize: '0.84rem', color: 'var(--ghost-white-subtle)', lineHeight: 1.55 }}>
                {lim}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '26px'
      }}>
        <button
          onClick={onReset}
          className="btn-secondary"
          style={{ padding: '13px 24px', fontSize: '0.94rem' }}
        >
          <RefreshCw size={16} />
          <span>Try Another Image</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleExportJson}
            className="btn-secondary"
            title="Export raw forensic schema"
            style={{ padding: '13px 20px', fontSize: '0.94rem' }}
          >
            <FileText size={16} />
            <span>Export JSON</span>
          </button>

          {/* Primary CTA: Download PDF in Acid Green */}
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="btn-primary"
            style={{ padding: '13px 28px', fontSize: '0.96rem' }}
          >
            <Download size={17} color="#092742" />
            <span>{downloading ? 'Compiling PDF...' : 'Download Analysis Report'}</span>
          </button>
        </div>
      </div>

      {/* Reliability & Privacy Standards Guarantee */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
        marginTop: '18px'
      }}>
        {/* Scientific Reliability Notice */}
        <div style={{
          padding: '18px 22px',
          borderRadius: '12px',
          background: 'rgba(12, 51, 85, 0.6)',
          border: '1px solid rgba(248, 248, 255, 0.1)',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start'
        }}>
          <Activity size={19} color="#D2F500" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#D2F500', marginBottom: '4px' }}>
              RELIABILITY &amp; INTEGRITY INFORMATION
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--ghost-white-subtle)', lineHeight: 1.55 }}>
              No AI detector is 100% accurate. Advanced generative models evolve continuously, and aggressive compression can mask signatures. These findings are probabilistic indicators and must never be treated as definitive legal proof.
            </p>
          </div>
        </div>

        {/* Privacy Safeguard Notice */}
        <div style={{
          padding: '18px 22px',
          borderRadius: '12px',
          background: 'rgba(12, 51, 85, 0.6)',
          border: '1px solid rgba(210, 245, 0, 0.25)',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start'
        }}>
          <Lock size={19} color="#D2F500" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#D2F500', marginBottom: '4px' }}>
              ZERO DISK RETENTION POLICY
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--ghost-white-subtle)', lineHeight: 1.55 }}>
              Uploaded images are processed ephemerally in RAM buffers to extract mathematical frequency and noise residuals, and are immediately flushed without permanent server disk storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
