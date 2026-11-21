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
        background: '#FFFFFF',
        boxShadow: '-12px 0 40px rgba(15, 23, 42, 0.1)',
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
          background: '#FFFFFF',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              background: '#EFF6FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(37,99,235,0.06)'
            }}>
              <History size={18} color="#2563EB" />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: '700', color: '#172B4D' }}>
                Session History
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.74rem', fontWeight: '400', color: '#64748B' }}>
                {history.length} {history.length === 1 ? 'image' : 'images'} audited in this session
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748B',
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
                    background: '#F8FAFC',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#FFFFFF';
                    e.currentTarget.style.boxShadow = '0 6px 18px rgba(37,99,235,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#F8FAFC';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(15, 23, 42, 0.03)';
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: '#F1F5F9',
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
                      color: '#172B4D',
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
                        background: isAi ? '#FEF2F2' : isReal ? '#F0FDF4' : '#FFFBEB',
                        color: isAi ? '#DC2626' : isReal ? '#16A34A' : '#D97706'
                      }}>
                        {isAi ? 'AI-GENERATED' : isReal ? 'AUTHENTIC' : 'INCONCLUSIVE'}
                      </span>
                      <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', fontWeight: '400', color: '#64748B' }}>
                        {item.result.confidence}% conf
                      </span>
                    </div>

                    <div style={{
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-mono)',
                      color: '#94A3B8',
                      marginTop: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Clock size={11} />
                      <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <ArrowRight size={14} color="#94A3B8" />
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {history.length > 0 && (
          <div style={{
            padding: '16px 20px',
            background: '#F8FAFC',
            boxShadow: '0 -2px 10px rgba(15, 23, 42, 0.03)',
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
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-body)', color: '#64748B' }}>
              Ephemeral Session Storage
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
