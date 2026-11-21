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
      border: '#FECACA',
      glow: 'rgba(220, 38, 38, 0.08)',
      badge: 'mono-badge-ai',
      icon: AlertTriangle
    },
    real: {
      primary: '#16A34A',
      bg: '#F0FDF4',
      border: '#BBF7D0',
      glow: 'rgba(22, 163, 74, 0.08)',
      badge: 'mono-badge-real',
      icon: CheckCircle2
    },
    inconclusive: {
      primary: '#D97706',
      bg: '#FFFBEB',
      border: '#FDE68A',
      glow: 'rgba(217, 119, 6, 0.08)',
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
        background: '#FFFFFF',
        borderColor: currentTheme.border,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
        position: 'relative',
        overflow: 'hidden'
      }}>
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
            color: '#64748B'
          }}>
            <span>ENGINE:</span>
            <span style={{ color: '#2563EB', fontWeight: '700' }}>
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
            width: '70px',
            height: '70px',
            borderRadius: '16px',
            background: currentTheme.bg,
            border: `1px solid ${currentTheme.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <VerdictIcon size={38} color={currentTheme.primary} />
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
                color: '#172B4D',
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
                background: currentTheme.bg,
                border: `1px solid ${currentTheme.border}`,
                color: currentTheme.primary,
                fontWeight: '800'
              }}>
                CONFIDENCE: {result.confidenceLevel || 'Calibrated'} ({result.confidence || 0}%)
              </span>
            </div>

            <div style={{
              fontSize: '0.92rem',
              color: '#475569',
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
          background: '#F8FAFC',
          padding: '22px',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
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
              <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#DC2626', fontWeight: '700' }}>
                AI SYNTHESIS LIKELIHOOD
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: '800', color: '#172B4D', fontFamily: 'var(--font-mono)' }}>
                {result.aiScore}%
              </div>
            </div>

            {isInconclusive && (
              <div style={{
                textAlign: 'center',
                padding: '4px 14px',
                borderRadius: '6px',
                background: '#FFFBEB',
                border: '1px solid #FDE68A',
                color: '#D97706',
                fontSize: '0.74rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: '700'
              }}>
                UNCERTAINTY SYSTEM TRIGGERED (AMBIGUOUS ZONE)
              </div>
            )}

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#16A34A', fontWeight: '700' }}>
                AUTHENTIC CAPTURE LIKELIHOOD
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: '800', color: '#172B4D', fontFamily: 'var(--font-mono)' }}>
                {result.realScore}%
              </div>
            </div>
          </div>

          {/* Split Visual Progress Bar */}
          <div style={{
            width: '100%',
            height: '14px',
            borderRadius: '7px',
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
            color: '#64748B',
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
          background: '#F8FAFC',
          borderLeft: `4px solid ${currentTheme.primary}`,
          borderTop: '1px solid #E2E8F0',
          borderRight: '1px solid #E2E8F0',
          borderBottom: '1px solid #E2E8F0',
          marginBottom: '24px'
        }}>
          <div style={{
            fontSize: '0.82rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: '700',
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
            color: '#475569',
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
              color: '#172B4D',
              marginBottom: '14px',
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
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0'
                  }}
                >
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#172B4D', marginBottom: '4px' }}>
                    {pillar.name}
                  </div>
                  <div style={{
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-mono)',
                    color: pillar.color === 'red' ? '#DC2626' : pillar.color === 'emerald' ? '#16A34A' : '#D97706',
                    fontWeight: '700'
                  }}>
                    {pillar.status}
                  </div>
                  <div style={{
                    width: '100%',
                    height: '5px',
                    background: '#E2E8F0',
                    borderRadius: '3px',
                    marginTop: '10px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${pillar.score}%`,
                      height: '100%',
                      background: pillar.color === 'red' ? '#DC2626' : pillar.color === 'emerald' ? '#16A34A' : '#D97706'
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
        background: '#FFFFFF'
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
              background: '#EFF6FF',
              border: '1px solid rgba(37,99,235,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldAlert size={19} color="#2563EB" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#172B4D' }}>
                Detected Indicators &amp; Anomaly Signals ({result.anomalies?.length || 0})
              </h3>
              <p style={{ fontSize: '0.76rem', color: '#64748B' }}>
                Frequency spectrum peaks, sensor grain floor, and container provenance logs
              </p>
            </div>
          </div>

          <button style={{
            background: 'transparent',
            border: 'none',
            color: '#64748B',
            cursor: 'pointer',
            padding: '4px'
          }}>
            {expandedAnomalies ? <ChevronUp size={20} color="#2563EB" /> : <ChevronDown size={20} />}
          </button>
        </div>

        {expandedAnomalies && (
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {result.anomalies?.map((ano, idx) => {
              const isAnomaly = ano.type === 'ANOMALY' || ano.type === 'DEFINITIVE_ANOMALY';
              const isAuthentic = ano.type === 'AUTHENTIC';

              return (
                <div 
                  key={idx}
                  style={{
                    background: '#F8FAFC',
                    padding: '16px 18px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0'
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
                      fontWeight: '700',
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
                      padding: '3px 8px',
                      borderRadius: '5px',
                      background: isAnomaly ? '#FEF2F2' : isAuthentic ? '#F0FDF4' : '#FFFBEB',
                      color: isAnomaly ? '#DC2626' : isAuthentic ? '#16A34A' : '#D97706',
                      border: `1px solid ${isAnomaly ? '#FECACA' : isAuthentic ? '#BBF7D0' : '#FDE68A'}`,
                      fontWeight: '800'
                    }}>
                      {isAnomaly ? 'ANOMALY MARKER' : isAuthentic ? 'AUTHENTIC SIGNAL' : 'NEUTRAL NOTE'}
                    </span>
                  </div>

                  <p style={{
                    fontSize: '0.86rem',
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
        <div className="glass-panel" style={{
          padding: '22px 26px',
          marginBottom: '24px',
          background: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderLeft: '4px solid #D97706'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <AlertCircle size={17} color="#D97706" />
            <span style={{ fontSize: '0.86rem', fontWeight: '800', color: '#92400E', fontFamily: 'var(--font-mono)' }}>
              LIMITATIONS OF THIS ANALYSIS
            </span>
          </div>
          <ul style={{ paddingLeft: '22px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {result.limitations.map((lim, idx) => (
              <li key={idx} style={{ fontSize: '0.84rem', color: '#78350F', lineHeight: 1.55 }}>
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
          style={{ padding: '12px 22px', fontSize: '0.92rem' }}
        >
          <RefreshCw size={15} />
          <span>Try Another Image</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleExportJson}
            className="btn-secondary"
            title="Export raw forensic schema"
            style={{ padding: '12px 18px', fontSize: '0.92rem' }}
          >
            <FileText size={15} />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="btn-primary"
            style={{ padding: '12px 26px', fontSize: '0.94rem' }}
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
        marginTop: '18px'
      }}>
        {/* Scientific Reliability Notice */}
        <div style={{
          padding: '20px 22px',
          borderRadius: '12px',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: '#EFF6FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Activity size={18} color="#2563EB" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#172B4D', marginBottom: '4px' }}>
              RELIABILITY &amp; INTEGRITY INFORMATION
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.55 }}>
              No AI detector is 100% accurate. Advanced generative models evolve continuously, and aggressive compression can mask signatures. Findings are probabilistic indicators.
            </p>
          </div>
        </div>

        {/* Privacy Safeguard Notice */}
        <div style={{
          padding: '20px 22px',
          borderRadius: '12px',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: '#EFF6FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Lock size={18} color="#2563EB" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#172B4D', marginBottom: '4px' }}>
              ZERO DISK RETENTION POLICY
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.55 }}>
              Uploaded images are processed in ephemeral memory buffers to extract mathematical frequency and noise residuals, and are immediately discarded without permanent disk storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
