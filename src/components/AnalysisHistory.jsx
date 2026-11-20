import React from 'react';
import { 
  X, 
  Trash2, 
  History, 
  Clock, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  FileImage,
  ArrowRight
} from 'lucide-react';

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
      background: 'rgba(3, 7, 18, 0.75)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      justifyContent: 'flex-end',
      animation: 'fadeIn 0.2s ease'
    }}>
      {/* Slide-in Drawer Container */}
      <div style={{
        width: '100%',
        maxWidth: '460px',
        height: '100%',
        background: '#090d19',
        borderLeft: '1px solid rgba(56, 189, 248, 0.2)',
        boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.8)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(56, 189, 248, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(0, 240, 255, 0.12)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <History size={18} color="#00f0ff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff' }}>
                Session History
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {history.length} {history.length === 1 ? 'image' : 'images'} audited in this session
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px'
            }}
          >
            <X size={20} />
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
              padding: '60px 20px',
              color: 'var(--text-muted)'
            }}>
              <FileImage size={44} color="#334155" style={{ margin: '0 auto 12px auto' }} />
              <h4 style={{ fontSize: '0.95rem', color: '#94a3b8', marginBottom: '6px' }}>
                No Scans Conducted Yet
              </h4>
              <p style={{ fontSize: '0.8rem', lineHeight: 1.5, maxWidth: '280px', margin: '0 auto' }}>
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
                    background: 'rgba(15, 23, 42, 0.65)',
                    border: '1px solid rgba(56, 189, 248, 0.15)',
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
                    background: '#040711',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    flexShrink: 0
                  }}>
                    {item.previewUrl ? (
                      <img 
                        src={item.previewUrl} 
                        alt="Thumbnail" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileImage size={20} color="#64748b" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: '#f8fafc',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {item.result.metadata.fileName}
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginTop: '4px'
                    }}>
                      <span style={{
                        fontSize: '0.68rem',
                        fontFamily: 'var(--font-mono)',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontWeight: '700',
                        background: isAi ? 'rgba(239, 68, 68, 0.15)' : isReal ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: isAi ? '#f87171' : isReal ? '#34d399' : '#fbbf24'
                      }}>
                        {item.result.verdict}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {item.result.aiScore}% AI
                      </span>
                    </div>

                    <div style={{
                      fontSize: '0.68rem',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginTop: '4px'
                    }}>
                      <Clock size={11} />
                      <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  <ArrowRight size={15} color="#64748b" />
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer with Clear Button */}
        {history.length > 0 && (
          <div style={{
            padding: '18px 24px',
            borderTop: '1px solid rgba(56, 189, 248, 0.12)',
            background: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <button
              onClick={() => {
                if (window.confirm('Clear all audit logs from this session?')) {
                  onClearHistory();
                }
              }}
              className="btn-danger-outline"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Trash2 size={15} />
              <span>Clear History ({history.length})</span>
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
