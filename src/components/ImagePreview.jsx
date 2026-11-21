import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Scan, ZoomIn, ZoomOut, RotateCcw, FileCheck, Layers } from 'lucide-react';
import { drawFilterToCanvas } from '../utils/canvasFilters';
import { formatBytes } from '../services/detectionService';

export default function ImagePreview({ imageItem, onRemove, onAnalyze, isAnalyzing = false }) {
  const [activeFilter, setActiveFilter] = useState('original');
  const [zoomLevel, setZoomLevel] = useState(1);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !imageItem?.element) return;
    const img = imageItem.element;
    const canvas = canvasRef.current;
    const maxPreviewWidth = 840;
    const maxPreviewHeight = 500;
    let w = img.naturalWidth || img.width || 800;
    let h = img.naturalHeight || img.height || 600;
    const scale = Math.min(maxPreviewWidth / w, maxPreviewHeight / h, 1);
    canvas.width = Math.floor(w * scale);
    canvas.height = Math.floor(h * scale);
    drawFilterToCanvas(canvas, img, activeFilter);
  }, [imageItem, activeFilter]);

  const filters = [
    { id: 'original', label: 'Normal View' },
    { id: 'ela', label: 'ELA Heatmap' },
    { id: 'edges', label: 'Sobel Edges' },
    { id: 'noise', label: 'Noise Floor' }
  ];

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '24px' }}>
        {/* Top bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '12px', marginBottom: '18px',
          paddingBottom: '14px', borderBottom: '1px solid #E2E8F0'
        }}>
          {/* File info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '9px',
              background: '#EFF6FF', border: '1px solid rgba(37,99,235,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <FileCheck size={19} color="#2563EB" />
            </div>
            <div>
              <div style={{
                fontSize: '0.95rem', fontWeight: '700', color: '#172B4D',
                maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
              }}>
                {imageItem.name}
              </div>
              <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#64748B' }}>
                {imageItem.dimensions.width} × {imageItem.dimensions.height} px · {formatBytes(imageItem.size)}
              </div>
            </div>
          </div>

          {/* Filter pills */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            background: '#F1F5F9', padding: '4px', borderRadius: '10px', border: '1px solid #E2E8F0'
          }}>
            {filters.map((f) => {
              const isActive = activeFilter === f.id;
              return (
                <button key={f.id} onClick={() => setActiveFilter(f.id)} style={{
                  background: isActive ? '#FFFFFF' : 'transparent',
                  border: isActive ? '1px solid #E2E8F0' : '1px solid transparent',
                  color: isActive ? '#2563EB' : '#64748B',
                  padding: '6px 11px', borderRadius: '7px', fontSize: '0.74rem',
                  fontFamily: 'var(--font-mono)', fontWeight: isActive ? '700' : '500',
                  cursor: 'pointer', transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                }}>
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Zoom controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button onClick={() => setZoomLevel(p => Math.min(p + 0.25, 2.5))} title="Zoom In" className="btn-secondary" style={{ padding: '6px 10px' }}>
              <ZoomIn size={14} />
            </button>
            <button onClick={() => setZoomLevel(p => Math.max(p - 0.25, 0.75))} title="Zoom Out" className="btn-secondary" style={{ padding: '6px 10px' }}>
              <ZoomOut size={14} />
            </button>
            <button onClick={() => setZoomLevel(1)} title="Reset Zoom" className="btn-secondary" style={{ padding: '6px 10px' }}>
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Canvas viewport */}
        <div style={{
          position: 'relative', minHeight: '360px', maxHeight: '520px',
          background: '#F8FAFC', borderRadius: '10px', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid #E2E8F0'
        }}>
          {isAnalyzing && <div className="scan-laser-line" />}
          <div style={{
            transform: `scale(${zoomLevel})`,
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            maxWidth: '100%', maxHeight: '100%'
          }}>
            <canvas ref={canvasRef} style={{ maxWidth: '100%', maxHeight: '480px', objectFit: 'contain', borderRadius: '4px', display: 'block' }} />
          </div>
          {/* Filter + zoom watermark */}
          <div style={{
            position: 'absolute', bottom: '10px', left: '10px',
            background: 'rgba(23, 43, 77, 0.85)', border: '1px solid rgba(37,99,235,0.3)',
            padding: '4px 10px', borderRadius: '6px', fontFamily: 'var(--font-mono)',
            fontSize: '0.67rem', color: '#60A5FA',
            display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(8px)'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2563EB' }} />
            <span>FILTER: {activeFilter.toUpperCase()}</span>
            <span>|</span>
            <span>ZOOM: {Math.round(zoomLevel * 100)}%</span>
          </div>
        </div>

        {/* Action bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '12px', marginTop: '20px'
        }}>
          <button type="button" onClick={onRemove} disabled={isAnalyzing} className="btn-danger-outline">
            <Trash2 size={16} />
            <span>Remove Image</span>
          </button>
          <button type="button" onClick={onAnalyze} disabled={isAnalyzing} className="btn-primary" style={{ padding: '13px 32px', fontSize: '1rem' }}>
            <Scan size={18} />
            <span>{isAnalyzing ? 'Analyzing Visual Patterns...' : 'Analyze Image'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
