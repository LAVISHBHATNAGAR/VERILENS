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
  Sparkles, 
  Layers, 
  Info, 
  Eye, 
  Lock, 
  ChevronDown, 
  ChevronUp,
  Cpu,
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
          colors: ['#10b981', '#34d399', '#059669']
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
      primary: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.1)',
      border: 'rgba(239, 68, 68, 0.4)',
      glow: 'rgba(239, 68, 68, 0.25)',
      badge: 'mono-badge-ai',
      icon: AlertTriangle
    },
    real: {
      primary: '#10b981',
      bg: 'rgba(16, 185, 129, 0.1)',
      border: 'rgba(16, 185, 129, 0.4)',
      glow: 'rgba(16, 185, 129, 0.25)',
      badge: 'mono-badge-real',
      icon: CheckCircle2
    },
    inconclusive: {
      primary: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.4)',
      glow: 'rgba(245, 158, 11, 0.25)',
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
        padding: '32px 28px',
        marginBottom: '24px',
        background: 'rgba(15, 23, 42, 0.85)',
        borderColor: currentTheme.border,
        boxShadow: `0 14px 45px -10px rgba(0, 0, 0, 0.7), 0 0 35px -5px ${currentTheme.glow}`,
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
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)'
            }}>
              ID: {result.id}
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: '#94a3b8'
          }}>
            <span>ENGINE:</span>
            <span style={{ color: result.isRealEngine ? '#00f0ff' : '#c084fc' }}>
              {result.isRealEngine ? 'Multi-Signal Forensic Engine' : 'Client-Side Signal Engine'}
            </span>
          </div>
        </div>

        {/* Main Verdict Display */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '16px',
            background: currentTheme.bg,
            border: `1px solid ${currentTheme.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 25px ${currentTheme.glow}`,
            flexShrink: 0
          }}>
            <VerdictIcon size={38} color={currentTheme.primary} />
          </div>

          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexWrap: 'wrap'
            }}>
              <h2 style={{
                fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
                fontWeight: '800',
                color: '#ffffff',
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              }}>
                {result.verdict}
              </h2>

              <span style={{
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                padding: '3px 8px',
                borderRadius: '6px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: `1px solid ${currentTheme.border}`,
                color: currentTheme.primary,
                fontWeight: '700'
              }}>
                CONFIDENCE: {result.confidenceLevel || 'Calibrated'} ({result.confidence || 0}%)
              </span>
            </div>

            <div style={{
              fontSize: '0.88rem',
              color: 'var(--text-secondary)',
              marginTop: '4px'
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
          background: 'rgba(7, 11, 20, 0.75)',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid rgba(56, 189, 248, 0.12)',
          marginBottom: '24px'
        }}>
          {/* Percentages Bar Headings */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '10px',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#f87171', fontWeight: '600' }}>
                AI SYNTHESIS LIKELIHOOD
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                {result.aiScore}%
              </div>
            </div>

            {isInconclusive && (
              <div style={{
                textAlign: 'center',
                padding: '4px 12px',
                borderRadius: '6px',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                color: '#fbbf24',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)'
              }}>
                UNCERTAINTY SYSTEM TRIGGERED (AMBIGUOUS ZONE)
              </div>
            )}

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#34d399', fontWeight: '600' }}>
                AUTHENTIC CAPTURE LIKELIHOOD
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                {result.realScore}%
              </div>
            </div>
          </div>

          {/* Split Visual Progress Bar */}
          <div style={{
            width: '100%',
            height: '14px',
            borderRadius: '7px',
            background: 'rgba(30, 41, 59, 0.8)',
            overflow: 'hidden',
            display: 'flex',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{
              width: `${result.aiScore}%`,
              background: 'linear-gradient(90deg, #ef4444 0%, #ec4899 100%)',
              boxShadow: '0 0 12px rgba(239, 68, 68, 0.5)',
              transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }} />
            <div style={{
              width: `${result.realScore}%`,
              background: 'linear-gradient(90deg, #10b981 0%, #00f0ff 100%)',
              boxShadow: '0 0 12px rgba(16, 185, 129, 0.5)',
              transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }} />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.68rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            marginTop: '6px'
          }}>
            <span>SYNTHETIC FREQUENCY SPECTRUM</span>
            <span>PHYSICAL CMOS SILICON SPECTRUM</span>
          </div>
        </div>

        {/* Short Explanation & Model Assessment */}
        <div style={{
          padding: '16px 20px',
          borderRadius: '10px',
          background: 'rgba(30, 41, 59, 0.45)',
          borderLeft: `4px solid ${currentTheme.primary}`,
          marginBottom: '20px'
        }}>
          <div style={{
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: '600',
            color: '#cbd5e1',
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Info size={14} color="#38bdf8" />
            <span>MODEL ASSESSMENT &amp; EXPLANATION</span>
          </div>
          <p style={{
            fontSize: '0.94rem',
            color: '#f1f5f9',
            lineHeight: 1.6
          }}>
            {result.summary}
          </p>
        </div>

        {/* 4-Pillar Multi-Signal Breakdown Matrix */}
        {result.pillars && (
          <div style={{ marginTop: '24px' }}>
            <div style={{
              fontSize: '0.82rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: '600',
              color: '#94a3b8',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Layers size={14} color="#00f0ff" />
              <span>MULTI-SIGNAL FORENSIC DOMAINS</span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px'
            }}>
              {result.pillars.map((pillar, idx) => (
                <div 
                  key={idx}
                  style={{
                    background: 'rgba(7, 11, 20, 0.65)',
                    padding: '14px',
                    borderRadius: '10px',
                    border: '1px solid rgba(56, 189, 248, 0.1)'
                  }}
                >
                  <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '4px' }}>
                    {pillar.name}
                  </div>
                  <div style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    color: pillar.color === 'red' ? '#f87171' : pillar.color === 'emerald' ? '#34d399' : '#fbbf24',
                    fontWeight: '600'
                  }}>
                    {pillar.status}
                  </div>
                  <div style={{
                    width: '100%',
                    height: '4px',
                    background: 'rgba(30, 41, 59, 0.7)',
                    borderRadius: '2px',
                    marginTop: '8px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${pillar.score}%`,
                      height: '100%',
                      background: pillar.color === 'red' ? '#ef4444' : pillar.color === 'emerald' ? '#10b981' : '#f59e0b'
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
        padding: '24px',
        marginBottom: '24px',
        background: 'rgba(15, 23, 42, 0.75)'
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(0, 240, 255, 0.1)',
              border: '1px solid rgba(0, 240, 255, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldAlert size={18} color="#00f0ff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff' }}>
                Detected Indicators &amp; Anomaly Signals ({result.anomalies?.length || 0})
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Frequency spectrum peaks, sensor grain floor, and container provenance logs
              </p>
            </div>
          </div>

          <button style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '4px'
          }}>
            {expandedAnomalies ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {expandedAnomalies && (
          <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {result.anomalies?.map((ano, idx) => {
              const isAnomaly = ano.type === 'ANOMALY' || ano.type === 'DEFINITIVE_ANOMALY';
              const isAuthentic = ano.type === 'AUTHENTIC';

              return (
                <div 
                  key={idx}
                  style={{
                    background: 'rgba(7, 11, 20, 0.55)',
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1px solid rgba(56, 189, 248, 0.1)'
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
                      fontSize: '0.92rem',
                      fontWeight: '600',
                      color: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: isAnomaly ? '#ef4444' : isAuthentic ? '#10b981' : '#f59e0b'
                      }} />
                      <span>{ano.name || ano.title}</span>
                    </div>

                    <span style={{
                      fontSize: '0.65rem',
                      fontFamily: 'var(--font-mono)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: isAnomaly ? 'rgba(239, 68, 68, 0.15)' : isAuthentic ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: isAnomaly ? '#f87171' : isAuthentic ? '#34d399' : '#fbbf24',
                      fontWeight: '700'
                    }}>
                      {isAnomaly ? 'ANOMALY MARKER' : isAuthentic ? 'AUTHENTIC SIGNAL' : 'NEUTRAL NOTE'}
                    </span>
                  </div>

                  <p style={{
                    fontSize: '0.84rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    paddingLeft: '15px'
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
          padding: '20px 24px',
          marginBottom: '24px',
          background: 'rgba(15, 23, 42, 0.65)',
          borderLeft: '4px solid #38bdf8'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <AlertCircle size={16} color="#38bdf8" />
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
              LIMITATIONS OF THIS ANALYSIS
            </span>
          </div>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {result.limitations.map((lim, idx) => (
              <li key={idx} style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
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
        marginBottom: '24px'
      }}>
        <button
          onClick={onReset}
          className="btn-secondary"
          style={{ padding: '12px 22px' }}
        >
          <RefreshCw size={16} />
          <span>Try Another Image</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleExportJson}
            className="btn-secondary"
            title="Export raw forensic schema"
            style={{ padding: '12px 18px' }}
          >
            <FileText size={16} />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="btn-primary"
            style={{ padding: '12px 24px' }}
          >
            <Download size={16} />
            <span>{downloading ? 'Compiling PDF...' : 'Download Analysis Report'}</span>
          </button>
        </div>
      </div>

      {/* Reliability & Privacy Standards Guarantee */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
        marginTop: '16px'
      }}>
        {/* Scientific Reliability Notice */}
        <div style={{
          padding: '16px 20px',
          borderRadius: '12px',
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start'
        }}>
          <Activity size={18} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#38bdf8', marginBottom: '4px' }}>
              RELIABILITY &amp; INTEGRITY INFORMATION
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              No AI detector is 100% accurate. Advanced generative models evolve continuously, and aggressive compression can mask signatures. These findings are probabilistic indicators and must never be treated as definitive legal proof.
            </p>
          </div>
        </div>

        {/* Privacy Safeguard Notice */}
        <div style={{
          padding: '16px 20px',
          borderRadius: '12px',
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start'
        }}>
          <Lock size={18} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#34d399', marginBottom: '4px' }}>
              ZERO DISK RETENTION POLICY
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Uploaded images are processed ephemerally in RAM buffers to extract mathematical frequency and noise residuals, and are immediately flushed without permanent server disk storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
