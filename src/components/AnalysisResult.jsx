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
  AlertCircle,
  Eye,
  Sun,
  Cpu,
  Sliders
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
        borderRadius: '24px',
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
              color: 'var(--text-muted)'
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
            color: 'var(--text-muted)'
          }}>
            <span>ENGINE:</span>
            <span style={{ color: 'var(--blue-light)', fontWeight: '500' }}>
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
                color: 'var(--text-primary)',
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
              color: 'var(--text-secondary)',
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
          background: 'var(--sub-block-bg)',
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
              <div style={{ fontSize: '1.95rem', fontWeight: '500', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
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
              <div style={{ fontSize: '1.95rem', fontWeight: '500', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                {result.realScore}%
              </div>
            </div>
          </div>

          {/* Split Visual Progress Bar (Pill rounded) */}
          <div style={{
            width: '100%',
            height: '14px',
            borderRadius: '9999px',
            background: 'rgba(148, 163, 184, 0.2)',
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
            color: 'var(--text-muted)',
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
          background: 'var(--sub-block-bg)',
          borderLeft: `4px solid ${currentTheme.primary}`,
          marginBottom: '26px'
        }}>
          <div style={{
            fontSize: '0.82rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: '500',
            color: 'var(--text-primary)',
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Info size={15} color="var(--blue-light)" />
            <span>MODEL ASSESSMENT &amp; EXPLANATION</span>
          </div>
          <p style={{
            fontSize: '0.94rem',
            fontFamily: 'var(--font-body)',
            fontWeight: '400',
            color: 'var(--text-secondary)',
            lineHeight: 1.65
          }}>
            {result.summary}
          </p>
        </div>

        {/* Deep Learning Vision Model Telemetry Banner */}
        {result.modelStatus === 'UNCONFIGURED' ? (
          <div style={{
            padding: '14px 18px',
            borderRadius: '16px',
            background: 'var(--sub-block-bg)',
            border: '1px solid rgba(217, 119, 6, 0.25)',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Cpu size={18} color="#D97706" />
              <div>
                <div style={{ fontSize: '0.84rem', fontFamily: 'var(--font-heading)', fontWeight: '600', color: 'var(--text-primary)' }}>
                  Deep Learning Vision Model — Unconfigured (.env)
                </div>
                <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>
                  Forensic evaluation is operating strictly on measured 2D Fourier harmonics, CMOS sensor noise, and visual content analysis.
                </div>
              </div>
            </div>
            {onOpenApiConfig && (
              <button
                onClick={onOpenApiConfig}
                className="btn-secondary"
                style={{ fontSize: '0.76rem', padding: '6px 14px', borderRadius: '9999px', whiteSpace: 'nowrap' }}
              >
                <Sliders size={13} />
                <span>Configure Model API Key</span>
              </button>
            )}
          </div>
        ) : result.modelStatus === 'CONNECTED' ? (
          <div style={{
            padding: '12px 18px',
            borderRadius: '16px',
            background: 'var(--success-bg)',
            border: '1px solid rgba(22, 163, 74, 0.25)',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="var(--success)" />
              <span style={{ fontSize: '0.84rem', fontFamily: 'var(--font-heading)', fontWeight: '600', color: 'var(--text-primary)' }}>
                Deep Learning Vision Model: Active ({result.modelName})
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--success)', fontWeight: '500' }}>
              REAL-TIME INFERENCE VERIFIED
            </span>
          </div>
        ) : null}

        {/* 4-Pillar Multi-Signal Breakdown Matrix */}
        {result.pillars && (
          <div style={{ marginTop: '28px' }}>
            <div style={{
              fontSize: '0.86rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Layers size={15} color="var(--blue-light)" />
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
                    background: 'var(--sub-block-bg)',
                    padding: '18px',
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.84rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
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
                    background: 'rgba(148, 163, 184, 0.2)',
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

      {/* Visual Content Analysis: Composition, Lighting, Surface Textures */}
      <div className="glass-panel" style={{
        padding: '28px',
        marginBottom: '24px',
        borderRadius: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'var(--badge-blue-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <Eye size={20} color="var(--badge-blue-text)" />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.08rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Observed Visual Content &amp; Scene Analysis
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '400' }}>
                Subject classification, illumination vectors, and physical texture dynamics
              </p>
            </div>
          </div>

          <span style={{
            fontSize: '0.74rem',
            fontFamily: 'var(--font-mono)',
            padding: '4px 14px',
            borderRadius: '9999px',
            background: 'var(--badge-blue-bg)',
            color: 'var(--blue-light)',
            fontWeight: '600'
          }}>
            {result.sceneTitle || 'Photographic Scene'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {/* Composition */}
          <div style={{ background: 'var(--sub-block-bg)', padding: '16px 18px', borderRadius: '16px' }}>
            <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={13} color="var(--blue-light)" />
              <span>COMPOSITION &amp; SUBJECT CLASSIFICATION</span>
            </div>
            <p style={{ fontSize: '0.86rem', fontFamily: 'var(--font-body)', color: 'var(--text-primary)', lineHeight: 1.55, margin: 0 }}>
              {result.visualContent?.compositionDescription || result.sceneTitle}
            </p>
          </div>

          {/* Lighting */}
          <div style={{ background: 'var(--sub-block-bg)', padding: '16px 18px', borderRadius: '16px' }}>
            <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sun size={13} color="var(--blue-light)" />
              <span>ILLUMINATION &amp; SHADOW PHYSICS</span>
            </div>
            <p style={{ fontSize: '0.86rem', fontFamily: 'var(--font-body)', color: 'var(--text-primary)', lineHeight: 1.55, margin: 0 }}>
              {result.visualContent?.lighting?.description || 'Uniform illumination distribution with balanced shadow fall-off.'}
            </p>
          </div>
        </div>

        {/* Individual Visual Observations list */}
        {result.visualObservations && result.visualObservations.length > 2 && (
          <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {result.visualObservations.slice(2).map((obs, idx) => (
              <div key={idx} style={{
                padding: '10px 14px',
                background: 'var(--sub-block-bg)',
                borderRadius: '12px',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-body)',
                color: 'var(--text-secondary)',
                lineHeight: 1.45,
                display: 'flex',
                alignItems: 'baseline',
                gap: '8px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--blue-light)', flexShrink: 0 }} />
                <span>{obs}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detected Irregularities & Indicators Accordion */}
      <div className="glass-panel" style={{
        padding: '28px',
        marginBottom: '24px',
        borderRadius: '24px'
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
              background: 'var(--badge-blue-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <ShieldAlert size={20} color="var(--badge-blue-text)" />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.08rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Detected Indicators &amp; Anomaly Signals ({result.anomalies?.length || 0})
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '400' }}>
                Frequency spectrum peaks, sensor grain floor, and container provenance logs
              </p>
            </div>
          </div>

          <button style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '6px'
          }}>
            {expandedAnomalies ? <ChevronUp size={22} color="var(--blue-light)" /> : <ChevronDown size={22} />}
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
                    background: 'var(--sub-block-bg)',
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
                      color: 'var(--text-primary)',
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
                      background: isAnomaly ? 'var(--error-bg)' : isAuthentic ? 'var(--success-bg)' : 'var(--warning-bg)',
                      color: isAnomaly ? 'var(--error)' : isAuthentic ? 'var(--success)' : 'var(--warning)',
                      fontWeight: '500'
                    }}>
                      {isAnomaly ? 'ANOMALY MARKER' : isAuthentic ? 'AUTHENTIC SIGNAL' : 'NEUTRAL NOTE'}
                    </span>
                  </div>

                  <p style={{
                    fontSize: '0.86rem',
                    fontFamily: 'var(--font-body)',
                    fontWeight: '400',
                    color: 'var(--text-secondary)',
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
          <RefreshCw size={15} color="var(--blue-light)" />
          <span>Try Another Image</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleExportJson}
            className="btn-secondary"
            title="Export raw forensic schema"
            style={{ padding: '13px 20px', fontSize: '0.92rem', fontFamily: 'var(--font-body)', fontWeight: '500' }}
          >
            <FileText size={15} color="var(--blue-light)" />
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
        <div className="glass-panel" style={{
          padding: '22px 24px',
          borderRadius: '20px',
          display: 'flex',
          gap: '14px',
          alignItems: 'flex-start'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'var(--badge-blue-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Activity size={18} color="var(--badge-blue-text)" />
          </div>
          <div>
            <div style={{ fontSize: '0.84rem', fontFamily: 'var(--font-heading)', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
              RELIABILITY &amp; INTEGRITY INFORMATION
            </div>
            <p style={{ fontSize: '0.82rem', fontFamily: 'var(--font-body)', fontWeight: '400', color: 'var(--text-muted)', lineHeight: 1.55 }}>
              No AI detector is 100% accurate. Advanced generative models evolve continuously, and aggressive compression can mask signatures. Findings are probabilistic indicators.
            </p>
          </div>
        </div>

        {/* Privacy Safeguard Notice */}
        <div className="glass-panel" style={{
          padding: '22px 24px',
          borderRadius: '20px',
          display: 'flex',
          gap: '14px',
          alignItems: 'flex-start'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'var(--badge-blue-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Lock size={18} color="var(--badge-blue-text)" />
          </div>
          <div>
            <div style={{ fontSize: '0.84rem', fontFamily: 'var(--font-heading)', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
              ZERO DISK RETENTION POLICY
            </div>
            <p style={{ fontSize: '0.82rem', fontFamily: 'var(--font-body)', fontWeight: '400', color: 'var(--text-muted)', lineHeight: 1.55 }}>
              Uploaded images are processed in ephemeral memory buffers to extract mathematical frequency and noise residuals, and are immediately discarded without permanent disk storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
