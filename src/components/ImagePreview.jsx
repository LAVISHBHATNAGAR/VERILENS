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
      <div className="glass-panel" style={{ padding: '28px', borderRadius: '24px', border: 'none', boxShadow: '0 12px 35px -4px rgba(37, 99, 235, 0.07)' }}>
        {/* Top bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '12px', marginBottom: '20px',
          paddingBottom: '16px', borderBottom: 'none'
        }}>
          {/* File info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: '#EFF6FF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(37,99,235,0.08)'
            }}>
              <FileCheck size={20} color="#2563EB" />
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.98rem',
                fontWeight: '600',
                color: '#172B4D',
                maxWidth: '300px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {imageItem.name}
              </div>
              <div style={{
                fontSize: '0.74rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: '400',
                color: '#64748B'
              }}>
                {imageItem.dimensions.width} × {imageItem.dimensions.height} px · {formatBytes(imageItem.size)}
              </div>
            </div>
          </div>

          {/* Filter pills (Rounded pills, borderless) */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            background: '#F1F5F9', padding: '4px', borderRadius: '9999px'
          }}>
            {filters.map((f) => {
              const isActive = activeFilter === f.id;
              return (
                <button key={f.id} onClick={() => setActiveFilter(f.id)} style={{
                  background: isActive ? '#FFFFFF' : 'transparent',
                  border: 'none',
                  color: isActive ? '#2563EB' : '#64748B',
                  padding: '7px 14px', borderRadius: '9999px', fontSize: '0.76rem',
                  fontFamily: 'var(--font-body)', fontWeight: isActive ? '600' : '500',
                  cursor: 'pointer', transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
                }}>
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Zoom controls (Pills) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button onClick={() => setZoomLevel(p => Math.min(p + 0.25, 2.5))} title="Zoom In" className="btn-secondary" style={{ padding: '8px 12px', borderRadius: '9999px' }}>
              <ZoomIn size={14} color="#172B4D" />
            </button>
            <button onClick={() => setZoomLevel(p => Math.max(p - 0.25, 0.75))} title="Zoom Out" className="btn-secondary" style={{ padding: '8px 12px', borderRadius: '9999px' }}>
              <ZoomOut size={14} color="#172B4D" />
            </button>
            <button onClick={() => setZoomLevel(1)} title="Reset Zoom" className="btn-secondary" style={{ padding: '8px 12px', borderRadius: '9999px' }}>
              <RotateCcw size={14} color="#172B4D" />
            </button>
          </div>
        </div>

        {/* Canvas viewport (Smooth 20px rounded, borderless) */}
        <div style={{
          position: 'relative', minHeight: '360px', maxHeight: '520px',
          background: '#F8FAFC', borderRadius: '20px', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.03)'
        }}>
          {isAnalyzing && <div className="scan-laser-line" />}
          <div style={{
            transform: `scale(${zoomLevel})`,
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            maxWidth: '100%', maxHeight: '100%'
          }}>
            <canvas ref={canvasRef} style={{ maxWidth: '100%', maxHeight: '480px', objectFit: 'contain', borderRadius: '8px', display: 'block' }} />
          </div>
          {/* Filter + zoom watermark (Pill, borderless) */}
          <div style={{
            position: 'absolute', bottom: '12px', left: '12px',
            background: 'rgba(23, 43, 77, 0.88)',
            padding: '5px 14px', borderRadius: '9999px', fontFamily: 'var(--font-mono)',
            fontWeight: '400', fontSize: '0.68rem', color: '#60A5FA',
            display: 'flex', alignItems: 'center', gap: '8px', backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.12)'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2563EB' }} />
            <span>FILTER: {activeFilter.toUpperCase()}</span>
            <span>|</span>
            <span>ZOOM: {Math.round(zoomLevel * 100)}%</span>
          </div>
        </div>

        {/* Action bar (Pill buttons, white text & icon on primary) */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '14px', marginTop: '24px'
        }}>
          <button type="button" onClick={onRemove} disabled={isAnalyzing} className="btn-danger-outline" style={{ fontFamily: 'var(--font-body)', fontWeight: '500', padding: '10px 20px', borderRadius: '9999px' }}>
            <Trash2 size={16} />
            <span>Remove Image</span>
          </button>
          <button type="button" onClick={onAnalyze} disabled={isAnalyzing} className="btn-primary" style={{ padding: '14px 34px', fontSize: '1rem', fontFamily: 'var(--font-body)', fontWeight: '600' }}>
            <Scan size={18} color="#FFFFFF" strokeWidth={2.2} />
            <span style={{ color: '#FFFFFF' }}>{isAnalyzing ? 'Analyzing Visual Patterns...' : 'Analyze Image'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
