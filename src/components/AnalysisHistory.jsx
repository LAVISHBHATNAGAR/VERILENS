import React from 'react';
import { 
  X, 
  Trash2, 
  History, 
  Clock, 
  FileImage,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import { formatBytes } from '../services/detectionService';

export default function AnalysisHistory({ 
  isOpen, 
  onClose, 
  history = [], 
  onSelectHistoryItem, 
  onClearHistory 
}) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      background: 'rgba(5, 24, 41, 0.8)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      display: 'flex',
      justifyContent: 'flex-end',
      animation: 'fadeIn 0.2s ease'
    }}>
      {/* Slide-in Drawer Container */}
      <div style={{
        width: '100%',
        maxWidth: '460px',
        height: '100%',
        background: '#051829',
        borderLeft: '1px solid rgba(248, 248, 255, 0.12)',
        boxShadow: '-12px 0 50px rgba(0, 0, 0, 0.85)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '22px 24px',
          borderBottom: '1px solid rgba(248, 248, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(9, 39, 66, 0.95)'
        }}>
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
              <History size={19} color="#D2F500" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--ghost-white)' }}>
                Session History
              </h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--ghost-white-muted)' }}>
                {history.length} {history.length === 1 ? 'image' : 'images'} audited in this session
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--ghost-white-subtle)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px'
            }}
          >
            <X size={20} color="#D2F500" />
          </button>
        </div>

        {/* Drawer Content List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {history.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '70px 20px',
              color: 'var(--ghost-white-muted)'
            }}>
              <FileImage size={46} color="#0c3355" style={{ margin: '0 auto 14px auto' }} />
              <h4 style={{ fontSize: '1rem', color: 'var(--ghost-white-subtle)', marginBottom: '8px', fontWeight: '700' }}>
                No Scans Conducted Yet
              </h4>
              <p style={{ fontSize: '0.84rem', lineHeight: 1.55, maxWidth: '280px', margin: '0 auto', color: 'var(--ghost-white-muted)' }}>
                Upload and analyze an image to track your inspection chain-of-custody in this session.
              </p>
            </div>
          ) : (
            history.map((item) => {
              const isAi = item.result.verdictLevel === 'ai';
              const isReal = item.result.verdictLevel === 'real';

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectHistoryItem(item);
                    onClose();
                  }}
                  className="glass-panel"
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background: 'rgba(12, 51, 85, 0.7)',
                    border: '1px solid rgba(248, 248, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#051829',
                    border: '1px solid rgba(248, 248, 255, 0.1)',
                    flexShrink: 0
                  }}>
                    <img 
                      src={item.previewUrl} 
                      alt="Thumbnail" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>

                  {/* Information Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '4px'
                    }}>
                      <span style={{
                        fontSize: '0.66rem',
                        fontFamily: 'var(--font-mono)',
                        padding: '2px 7px',
                        borderRadius: '4px',
                        fontWeight: '800',
                        background: isAi ? 'rgba(255, 71, 87, 0.15)' : isReal ? 'rgba(210, 245, 0, 0.15)' : 'rgba(255, 184, 0, 0.15)',
                        color: isAi ? '#FF6B6B' : isReal ? '#D2F500' : '#FFB800'
                      }}>
                        {isAi ? 'LIKELY AI' : isReal ? 'LIKELY AUTHENTIC' : 'INCONCLUSIVE'}
                      </span>

                      <span style={{ fontSize: '0.68rem', color: 'var(--ghost-white-muted)' }}>
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div style={{
                      fontSize: '0.86rem',
                      fontWeight: '700',
                      color: 'var(--ghost-white)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {item.imageData?.name || 'Inspected Image'}
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--ghost-white-muted)',
                      marginTop: '3px'
                    }}>
                      <span>AI: {item.result.aiScore}%</span>
                      <span>•</span>
                      <span>Real: {item.result.realScore}%</span>
                    </div>
                  </div>

                  <ArrowRight size={16} color="#D2F500" style={{ flexShrink: 0 }} />
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer Actions */}
        {history.length > 0 && (
          <div style={{
            padding: '18px 24px',
            borderTop: '1px solid rgba(248, 248, 255, 0.1)',
            background: 'rgba(9, 39, 66, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <button
              onClick={onClearHistory}
              className="btn-danger-outline"
              style={{ fontSize: '0.8rem', padding: '8px 14px' }}
            >
              <Trash2 size={14} />
              <span>Clear History</span>
            </button>

            <span style={{ fontSize: '0.72rem', color: 'var(--ghost-white-muted)' }}>
              Ephemeral session storage
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
