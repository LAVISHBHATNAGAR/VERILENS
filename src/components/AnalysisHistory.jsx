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
      background: 'rgba(23, 43, 77, 0.45)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'flex-end',
      animation: 'fadeIn 0.2s ease'
    }}>
      {/* Slide-in Drawer Container */}
      <div style={{
        width: '100%',
        maxWidth: '440px',
        height: '100%',
        background: 'var(--bg-secondary)',
        boxShadow: '-12px 0 40px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '20px 22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-secondary)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              background: 'var(--badge-blue-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <History size={18} color="var(--badge-blue-text)" />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Session History
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.74rem', fontWeight: '400', color: 'var(--text-muted)' }}>
                {history.length} {history.length === 1 ? 'image' : 'images'} audited in this session
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Content List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {history.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#64748B'
            }}>
              <FileImage size={42} color="#CBD5E1" style={{ margin: '0 auto 12px auto' }} />
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', color: '#172B4D', marginBottom: '6px', fontWeight: '700' }}>
                No Scans Conducted Yet
              </h4>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: '400', lineHeight: 1.5, maxWidth: '260px', margin: '0 auto', color: '#64748B' }}>
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
                    padding: '12px 14px',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    background: 'var(--sub-block-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-hover)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--sub-block-bg)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: 'var(--bg-surface)',
                    flexShrink: 0
                  }}>
                    <img 
                      src={item.previewUrl} 
                      alt="History Preview" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>

                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.86rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {item.imageData?.name || item.result.metadata?.fileName || 'Inspected Image'}
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginTop: '3px'
                    }}>
                      <span style={{
                        fontSize: '0.66rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: '500',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        background: isAi ? 'var(--error-bg)' : isReal ? 'var(--success-bg)' : 'var(--warning-bg)',
                        color: isAi ? 'var(--error)' : isReal ? 'var(--success)' : 'var(--warning)'
                      }}>
                        {isAi ? 'AI-GENERATED' : isReal ? 'AUTHENTIC' : 'INCONCLUSIVE'}
                      </span>
                      <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', fontWeight: '400', color: 'var(--text-muted)' }}>
                        {item.result.confidence}% conf
                      </span>
                    </div>

                    <div style={{
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-muted)',
                      marginTop: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Clock size={11} />
                      <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <ArrowRight size={14} color="var(--text-muted)" />
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {history.length > 0 && (
          <div style={{
            padding: '16px 20px',
            background: 'var(--sub-block-bg)',
            boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <button
              onClick={onClearHistory}
              className="btn-danger-outline"
              style={{ fontSize: '0.82rem', padding: '6px 12px', fontFamily: 'var(--font-body)', fontWeight: '500' }}
            >
              <Trash2 size={13} />
              <span>Clear History</span>
            </button>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>
              Ephemeral Session Storage
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
