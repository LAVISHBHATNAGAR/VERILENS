import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  X,
  Trash2,
  History,
  Clock,
  FileImage,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export default function AnalysisHistory({
  isOpen,
  onClose,
  history = [],
  onSelectHistoryItem,
  onReanalyzeItem,
  onClearHistory
}) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Session Forensic History"
          className="fixed inset-0 z-50 flex justify-end"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
          />

          {/* Slide-over Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 360, damping: 34 }}
            className="relative z-10 w-full max-w-md h-full bg-[var(--bg-secondary)] border-l border-[var(--border-hairline)] shadow-[var(--shadow-lg)] flex flex-col"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-[var(--border-hairline)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--badge-blue-bg)] border border-[var(--border-specular)] flex items-center justify-center">
                  <History className="w-4.5 h-4.5 text-[var(--badge-blue-text)]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    Session Chain of Custody
                  </h3>
                  <p className="font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
                    {history.length} {history.length === 1 ? 'specimen' : 'specimens'} audited
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close session history"
                className="p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--sub-block-bg)] transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {history.length === 0 ? (
                <div className="text-center py-16 px-6">
                  <FileImage className="w-11 h-11 text-[var(--text-placeholder)] mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1">
                    No Specimens Audited Yet
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] max-w-xs mx-auto leading-relaxed">
                    Upload an image or run a calibrated specimen to inspect your ephemeral session trail.
                  </p>
                </div>
              ) : (
                history.map((item) => {
                  const isAi = item.result.verdictLevel === 'ai';
                  const isReal = item.result.verdictLevel === 'real';

                  return (
                    <div
                      key={item.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        onSelectHistoryItem(item);
                        onClose();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectHistoryItem(item);
                          onClose();
                        }
                      }}
                      className="rounded-2xl bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] hover:border-[var(--border-specular)] p-3 flex items-center gap-3 transition-all cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[var(--bg-surface)] shrink-0 border border-[var(--border-hairline)]">
                        <img
                          src={item.previewUrl}
                          alt={item.imageData?.name || 'History preview'}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-[var(--text-primary)] truncate">
                          {item.imageData?.name || item.result.metadata?.fileName || 'Inspected Image'}
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`mono-badge text-[10px] py-0.5 px-2 ${
                              isAi
                                ? 'mono-badge-ai'
                                : isReal
                                  ? 'mono-badge-real'
                                  : 'mono-badge-warn'
                            }`}
                          >
                            {isAi ? 'AI-GENERATED' : isReal ? 'AUTHENTIC' : 'INCONCLUSIVE'}
                          </span>
                          <span className="font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
                            {item.result.confidence}% conf
                          </span>
                        </div>

                        <div className="font-mono text-[10px] text-[var(--text-muted)] mt-1 flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                          {item.result.isFallback && (
                            <span className="text-[var(--warning)]">· Local</span>
                          )}
                        </div>
                      </div>

                      {onReanalyzeItem && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onReanalyzeItem(item);
                          }}
                          title="Re-analyze image"
                          aria-label="Re-analyze image"
                          className="p-2 rounded-full text-[var(--blue-light)] hover:bg-[var(--badge-blue-bg)] transition-transform hover:rotate-45"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {history.length > 0 && (
              <div className="px-5 py-3.5 border-t border-[var(--border-hairline)] bg-[var(--sub-block-bg)] flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClearHistory}
                  className="btn-danger-outline text-xs py-1.5 px-3"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Session</span>
                </button>
                <span className="font-mono text-[11px] text-[var(--text-muted)]">
                  sessionStorage only
                </span>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
