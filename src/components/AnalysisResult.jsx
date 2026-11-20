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
  Share2,
  ExternalLink,
  Lock,
  ChevronDown,
  ChevronUp
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
      // Trigger a light celebratory confetti burst if authentic, or cyber sparkle
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: isReal ? ['#10b981', '#34d399', '#059669'] : ['#00f0ff', '#a855f7', '#38bdf8']
      });
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleExportJson = () => {
    downloadJsonData(result);
  };

  // Color theme definitions
  const themeColors = {
    ai: {
      primary: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.1)',
      border: 'rgba(239, 68, 68, 0.35)',
      glow: 'rgba(239, 68, 68, 0.25)',
      badge: 'mono-badge-ai',
      icon: AlertTriangle
    },
    real: {
      primary: '#10b981',
      bg: 'rgba(16, 185, 129, 0.1)',
      border: 'rgba(16, 185, 129, 0.35)',
      glow: 'rgba(16, 185, 129, 0.25)',
      badge: 'mono-badge-real',
      icon: CheckCircle2
    },
    inconclusive: {
      primary: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.35)',
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
        background: 'rgba(15, 23, 42, 0.82)',
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
          width: '160px',
          height: '160px',
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
              <span>FORENSIC VERDICT</span>
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
            <span>MODE:</span>
            <span style={{ color: '#00f0ff' }}>{result.modeLabel}</span>
          </div>
        </div>

        {/* Main Verdict Display */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: currentTheme.bg,
            border: `1px solid ${currentTheme.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 25px ${currentTheme.glow}`,
            flexShrink: 0
          }}>
            <VerdictIcon size={36} color={currentTheme.primary} />
          </div>

          <div>
            <h2 style={{
              fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
              fontWeight: '800',
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}>
              {result.verdict}
            </h2>
            <div style={{
              fontSize: '0.88rem',
              color: 'var(--text-secondary)',
              marginTop: '4px'
            }}>
              Confidence Assessment: <strong style={{ color: currentTheme.primary }}>
                {isAi ? `${result.aiScore}% Synthetic Markers` : isReal ? `${result.realScore}% Authentic Markers` : 'Borderline Metrics'}
              </strong>
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
                AI-GENERATED LIKELIHOOD
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                {result.aiScore}%
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#34d399', fontWeight: '600' }}>
                REAL-IMAGE LIKELIHOOD
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
            <span>SYNTHETIC SPECTRUM</span>
            <span>PHYSICAL CAPTURE SPECTRUM</span>
          </div>
        </div>

        {/* Short Explanation of the Result */}
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
            <span>ANALYSIS SUMMARY &amp; EXPLANATION</span>
          </div>
          <p style={{
            fontSize: '0.94rem',
            color: '#f1f5f9',
            lineHeight: 1.6
          }}>
            {result.explanation}
          </p>
        </div>

        {/* 4-Pillar Evaluation Matrix */}
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
            <span>FORENSIC PILLAR BREAKDOWN</span>
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
      </div>

      {/* Irregularities Detected Accordion */}
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
                Possible Irregularities Detected ({result.anomalies.length})
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Structural frequency, texture, and container inspection logs
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
            {result.anomalies.map((ano) => (
              <div 
                key={ano.id}
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
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: ano.severity === 'HIGH' ? '#ef4444' : ano.severity === 'MEDIUM' ? '#f59e0b' : '#10b981'
                    }} />
                    <span>{ano.title}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      fontSize: '0.65rem',
                      fontFamily: 'var(--font-mono)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: 'rgba(30, 41, 59, 0.7)',
                      color: '#94a3b8'
                    }}>
                      {ano.category}
                    </span>
                    <span style={{
                      fontSize: '0.65rem',
                      fontFamily: 'var(--font-mono)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: ano.severity === 'HIGH' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: ano.severity === 'HIGH' ? '#f87171' : '#fbbf24',
                      fontWeight: '700'
                    }}>
                      {ano.severity} PRIORITY
                    </span>
                  </div>
                </div>

                <p style={{
                  fontSize: '0.84rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  paddingLeft: '14px'
                }}>
                  {ano.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '24px'
      }}>
        {/* Try Another Image Button */}
        <button
          onClick={onReset}
          className="btn-secondary"
          style={{ padding: '12px 22px' }}
        >
          <RefreshCw size={16} />
          <span>Try Another Image</span>
        </button>

        {/* Download & Export Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleExportJson}
            className="btn-secondary"
            title="Export raw JSON forensic schema"
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

      {/* Scientific Transparency Notice & Privacy Notice */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
        marginTop: '16px'
      }}>
        {/* Transparency Mode Disclaimer */}
        <div style={{
          padding: '16px 20px',
          borderRadius: '12px',
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start'
        }}>
          <Sparkles size={18} color="#c084fc" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#c084fc', marginBottom: '4px' }}>
              TRANSPARENCY &amp; METHODOLOGY NOTICE
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Running in <strong>Demo Heuristic Mode</strong>. These percentages reflect deterministic visual signal processing (sensor grain floor, frequency DCT, and micro-texture gradients). Real-world production APIs can be attached in the API settings panel.
            </p>
          </div>
        </div>

        {/* Privacy Notice Requirement */}
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
              PRIVACY SAFEGUARD GUARANTEE
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Uploaded images are rendered client-side in your local browser memory and are <strong>not stored permanently</strong> or transferred to remote training servers during this demo inspection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
