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
          colors: ['#2563EB', '#60A5FA', '#16A34A']
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
      primary: '#DC2626',
      bg: '#FEF2F2',
      glow: 'rgba(220, 38, 38, 0.08)',
      badge: 'mono-badge-ai',
      icon: AlertTriangle
    },
    real: {
      primary: '#16A34A',
      bg: '#F0FDF4',
      glow: 'rgba(22, 163, 74, 0.08)',
      badge: 'mono-badge-real',
      icon: CheckCircle2
    },
    inconclusive: {
      primary: '#D97706',
      bg: '#FFFBEB',
      glow: 'rgba(217, 119, 6, 0.08)',
      badge: 'mono-badge-warn',
      icon: HelpCircle
    }
  };

  const currentTheme = themeColors[result.verdictLevel] || themeColors.inconclusive;
  const VerdictIcon = currentTheme.icon;

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', animation: 'fadeIn 0.3s ease' }}>
      {/* Top Main Result Hero Card (Smooth 24px, borderless, elevated shadow) */}
      <div className="glass-panel" style={{
        padding: '38px 32px',
        marginBottom: '24px',
        background: '#FFFFFF',
        borderRadius: '24px',
        border: 'none',
        boxShadow: '0 14px 45px -4px rgba(37, 99, 235, 0.08)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Header with Verdict & Reference Tag (IBM Plex Mono for technical ID) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '22px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className={`mono-badge ${currentTheme.badge}`} style={{ borderRadius: '9999px', border: 'none' }}>
              <VerdictIcon size={14} />
              <span>FORENSIC ASSESSMENT</span>
            </span>
            <span style={{
              fontSize: '0.74rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: '500',
              color: '#64748B'
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
            fontWeight: '500',
            color: '#64748B'
          }}>
            <span>ENGINE:</span>
            <span style={{ color: '#2563EB', fontWeight: '500' }}>
              {result.isRealEngine ? 'Multi-Signal Forensic Engine' : 'Client-Side Signal Engine'}
            </span>
          </div>
        </div>

        {/* Main Verdict Display (Plus Jakarta Sans, 800) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '22px',
          marginBottom: '28px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            width: '74px',
            height: '74px',
            borderRadius: '20px',
            background: currentTheme.bg,
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: `0 8px 24px ${currentTheme.glow}`
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
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.75rem, 3.8vw, 2.35rem)',
                fontWeight: '800',
                color: '#172B4D',
                letterSpacing: '-0.025em',
                lineHeight: 1.2
              }}>
                {result.verdict}
              </h2>

              <span style={{
                fontSize: '0.74rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: '500',
                padding: '4px 12px',
                borderRadius: '9999px',
                background: currentTheme.bg,
                border: 'none',
                color: currentTheme.primary
              }}>
                CONFIDENCE: {result.confidenceLevel || 'Calibrated'} ({result.confidence || 0}%)
              </span>
            </div>

            <div style={{
              fontSize: '0.94rem',
              fontFamily: 'var(--font-body)',
              color: '#475569',
              marginTop: '6px',
              fontWeight: '400'
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

        {/* Dual Likelihood Progress Bar & Metrics (Smooth 18px rounded, borderless) */}
        <div style={{
          background: '#F8FAFC',
          padding: '24px',
          borderRadius: '18px',
          border: 'none',
          marginBottom: '26px'
        }}>
          {/* Percentages Bar Headings (IBM Plex Mono) */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '12px',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div>
              <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#DC2626', fontWeight: '500' }}>
                AI SYNTHESIS LIKELIHOOD
              </div>
              <div style={{ fontSize: '1.95rem', fontWeight: '500', color: '#172B4D', fontFamily: 'var(--font-mono)' }}>
                {result.aiScore}%
              </div>
            </div>

            {isInconclusive && (
              <div style={{
                textAlign: 'center',
                padding: '5px 16px',
                borderRadius: '9999px',
                background: '#FFFBEB',
                border: 'none',
                color: '#D97706',
                fontSize: '0.74rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: '500'
              }}>
                UNCERTAINTY SYSTEM TRIGGERED (AMBIGUOUS ZONE)
              </div>
            )}

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#16A34A', fontWeight: '500' }}>
                AUTHENTIC CAPTURE LIKELIHOOD
              </div>
              <div style={{ fontSize: '1.95rem', fontWeight: '500', color: '#172B4D', fontFamily: 'var(--font-mono)' }}>
                {result.realScore}%
              </div>
            </div>
          </div>

          {/* Split Visual Progress Bar (Pill rounded) */}
          <div style={{
            width: '100%',
            height: '14px',
            borderRadius: '9999px',
            background: '#E2E8F0',
            overflow: 'hidden',
            display: 'flex'
          }}>
            <div style={{
              width: `${result.aiScore}%`,
              background: '#DC2626',
              transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }} />
            <div style={{
              width: `${result.realScore}%`,
              background: '#16A34A',
              transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }} />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.7rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: '400',
            color: '#64748B',
            marginTop: '8px'
          }}>
            <span>SYNTHETIC FREQUENCY SPECTRUM</span>
            <span>PHYSICAL SENSOR GRAIN SPECTRUM</span>
          </div>
        </div>

        {/* Short Explanation & Model Assessment (Clean left-accent, borderless box) */}
        <div style={{
          padding: '18px 22px',
          borderRadius: '16px',
          background: '#F8FAFC',
          borderLeft: `4px solid ${currentTheme.primary}`,
          marginBottom: '26px'
        }}>
          <div style={{
            fontSize: '0.82rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: '500',
            color: '#172B4D',
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Info size={15} color="#2563EB" />
            <span>MODEL ASSESSMENT &amp; EXPLANATION</span>
          </div>
          <p style={{
            fontSize: '0.94rem',
            fontFamily: 'var(--font-body)',
            fontWeight: '400',
            color: '#475569',
            lineHeight: 1.65
          }}>
            {result.summary}
          </p>
        </div>

        {/* 4-Pillar Multi-Signal Breakdown Matrix */}
        {result.pillars && (
          <div style={{ marginTop: '28px' }}>
            <div style={{
              fontSize: '0.86rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: '600',
              color: '#172B4D',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Layers size={15} color="#2563EB" />
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
                    background: '#F8FAFC',
                    padding: '18px',
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.84rem',
                    fontWeight: '600',
                    color: '#172B4D',
                    marginBottom: '4px'
                  }}>
                    {pillar.name}
                  </div>
                  <div style={{
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-mono)',
                    color: pillar.color === 'red' ? '#DC2626' : pillar.color === 'emerald' ? '#16A34A' : '#D97706',
                    fontWeight: '500'
                  }}>
                    {pillar.status}
                  </div>
                  <div style={{
                    width: '100%',
                    height: '5px',
                    background: '#E2E8F0',
                    borderRadius: '9999px',
                    marginTop: '10px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${pillar.score}%`,
                      height: '100%',
                      background: pillar.color === 'red' ? '#DC2626' : pillar.color === 'emerald' ? '#16A34A' : '#D97706',
                      borderRadius: '9999px'
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
        padding: '28px',
        marginBottom: '24px',
        background: '#FFFFFF',
        borderRadius: '24px',
        border: 'none',
        boxShadow: '0 10px 30px -4px rgba(37, 99, 235, 0.06)'
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
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: '#EFF6FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(37,99,235,0.08)'
            }}>
              <ShieldAlert size={20} color="#2563EB" />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.08rem', fontWeight: '700', color: '#172B4D' }}>
                Detected Indicators &amp; Anomaly Signals ({result.anomalies?.length || 0})
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: '#64748B', fontWeight: '400' }}>
                Frequency spectrum peaks, sensor grain floor, and container provenance logs
              </p>
            </div>
          </div>

          <button style={{
            background: 'transparent',
            border: 'none',
            color: '#64748B',
            cursor: 'pointer',
            padding: '6px'
          }}>
            {expandedAnomalies ? <ChevronUp size={22} color="#2563EB" /> : <ChevronDown size={22} />}
          </button>
        </div>

        {expandedAnomalies && (
          <div style={{ marginTop: '22px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {result.anomalies?.map((ano, idx) => {
              const isAnomaly = ano.type === 'ANOMALY' || ano.type === 'DEFINITIVE_ANOMALY';
              const isAuthentic = ano.type === 'AUTHENTIC';

              return (
                <div 
                  key={idx}
                  style={{
                    background: '#F8FAFC',
                    padding: '16px 20px',
                    borderRadius: '16px',
                    border: 'none'
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
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.92rem',
                      fontWeight: '600',
                      color: '#172B4D',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: isAnomaly ? '#DC2626' : isAuthentic ? '#16A34A' : '#D97706'
                      }} />
                      <span>{ano.name || ano.title}</span>
                    </div>

                    <span style={{
                      fontSize: '0.66rem',
                      fontFamily: 'var(--font-mono)',
                      padding: '3px 10px',
                      borderRadius: '9999px',
                      background: isAnomaly ? '#FEF2F2' : isAuthentic ? '#F0FDF4' : '#FFFBEB',
                      color: isAnomaly ? '#DC2626' : isAuthentic ? '#16A34A' : '#D97706',
                      fontWeight: '500'
                    }}>
                      {isAnomaly ? 'ANOMALY MARKER' : isAuthentic ? 'AUTHENTIC SIGNAL' : 'NEUTRAL NOTE'}
                    </span>
                  </div>

                  <p style={{
                    fontSize: '0.86rem',
                    fontFamily: 'var(--font-body)',
                    fontWeight: '400',
                    color: '#475569',
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
        <div style={{
          padding: '24px 28px',
          marginBottom: '24px',
          background: '#FFFBEB',
          borderRadius: '18px',
          borderLeft: '4px solid #D97706',
          boxShadow: '0 4px 16px rgba(217, 119, 6, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <AlertCircle size={18} color="#D97706" />
            <span style={{ fontSize: '0.88rem', fontWeight: '600', color: '#92400E', fontFamily: 'var(--font-heading)' }}>
              LIMITATIONS OF THIS ANALYSIS
            </span>
          </div>
          <ul style={{ paddingLeft: '22px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {result.limitations.map((lim, idx) => (
              <li key={idx} style={{ fontSize: '0.84rem', fontFamily: 'var(--font-body)', fontWeight: '400', color: '#78350F', lineHeight: 1.55 }}>
                {lim}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons Toolbar (Pills, pure white text & icons on primary button) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        marginBottom: '28px'
      }}>
        <button
          onClick={onReset}
          className="btn-secondary"
          style={{ padding: '13px 24px', fontSize: '0.92rem', fontFamily: 'var(--font-body)', fontWeight: '500' }}
        >
          <RefreshCw size={15} color="#2563EB" />
          <span>Try Another Image</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleExportJson}
            className="btn-secondary"
            title="Export raw forensic schema"
            style={{ padding: '13px 20px', fontSize: '0.92rem', fontFamily: 'var(--font-body)', fontWeight: '500' }}
          >
            <FileText size={15} color="#2563EB" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="btn-primary"
            style={{ padding: '13px 28px', fontSize: '0.95rem', fontFamily: 'var(--font-body)', fontWeight: '600' }}
          >
            <Download size={17} color="#FFFFFF" strokeWidth={2.2} />
            <span style={{ color: '#FFFFFF' }}>{downloading ? 'Compiling PDF...' : 'Download Analysis Report'}</span>
          </button>
        </div>
      </div>

      {/* Reliability & Privacy Standards Guarantee (Smooth 20px, borderless) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
        marginTop: '18px'
      }}>
        {/* Scientific Reliability Notice */}
        <div style={{
          padding: '22px 24px',
          borderRadius: '20px',
          background: '#FFFFFF',
          border: 'none',
          display: 'flex',
          gap: '14px',
          alignItems: 'flex-start',
          boxShadow: '0 6px 20px -2px rgba(0,0,0,0.04)'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: '#EFF6FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Activity size={18} color="#2563EB" />
          </div>
          <div>
            <div style={{ fontSize: '0.84rem', fontFamily: 'var(--font-heading)', fontWeight: '600', color: '#172B4D', marginBottom: '4px' }}>
              RELIABILITY &amp; INTEGRITY INFORMATION
            </div>
            <p style={{ fontSize: '0.82rem', fontFamily: 'var(--font-body)', fontWeight: '400', color: '#64748B', lineHeight: 1.55 }}>
              No AI detector is 100% accurate. Advanced generative models evolve continuously, and aggressive compression can mask signatures. Findings are probabilistic indicators.
            </p>
          </div>
        </div>

        {/* Privacy Safeguard Notice */}
        <div style={{
          padding: '22px 24px',
          borderRadius: '20px',
          background: '#FFFFFF',
          border: 'none',
          display: 'flex',
          gap: '14px',
          alignItems: 'flex-start',
          boxShadow: '0 6px 20px -2px rgba(0,0,0,0.04)'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: '#EFF6FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Lock size={18} color="#2563EB" />
          </div>
          <div>
            <div style={{ fontSize: '0.84rem', fontFamily: 'var(--font-heading)', fontWeight: '600', color: '#172B4D', marginBottom: '4px' }}>
              ZERO DISK RETENTION POLICY
            </div>
            <p style={{ fontSize: '0.82rem', fontFamily: 'var(--font-body)', fontWeight: '400', color: '#64748B', lineHeight: 1.55 }}>
              Uploaded images are processed in ephemeral memory buffers to extract mathematical frequency and noise residuals, and are immediately discarded without permanent disk storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
