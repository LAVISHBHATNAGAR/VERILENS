import React, { useState, useEffect, useRef } from 'react';
import { 
  Trash2, 
  Scan, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  FileCheck,
  Layers
} from 'lucide-react';
import { drawFilterToCanvas } from '../utils/canvasFilters';
import { formatBytes } from '../services/detectionService';

export default function ImagePreview({ 
  imageItem, 
  onRemove, 
  onAnalyze, 
  isAnalyzing = false 
}) {
  const [activeFilter, setActiveFilter] = useState('original');
  const [zoomLevel, setZoomLevel] = useState(1);
  const canvasRef = useRef(null);

  // Re-draw canvas whenever filter or image changes
  useEffect(() => {
    if (!canvasRef.current || !imageItem?.element) return;

    const img = imageItem.element;
    const canvas = canvasRef.current;

    // Set canvas dimensions to match image aspect ratio bounded to viewport
    const maxPreviewWidth = 840;
    const maxPreviewHeight = 500;

    let w = img.naturalWidth || img.width || 800;
    let h = img.naturalHeight || img.height || 600;

    const scale = Math.min(maxPreviewWidth / w, maxPreviewHeight / h, 1);
    canvas.width = Math.floor(w * scale);
    canvas.height = Math.floor(h * scale);

    drawFilterToCanvas(canvas, img, activeFilter);
  }, [imageItem, activeFilter]);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  const filters = [
    { id: 'original', label: 'Normal View' },
    { id: 'ela', label: 'ELA Heatmap' },
    { id: 'edges', label: 'Sobel Edges' },
    { id: 'noise', label: 'Noise Floor' }
  ];

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto' }}>
      <div className="glass-panel" style={{
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(12, 51, 85, 0.75)'
      }}>
        {/* Top Control Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '18px',
          paddingBottom: '14px',
          borderBottom: '1px solid rgba(248, 248, 255, 0.08)'
        }}>
          {/* File Name & Format Chip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
              <FileCheck size={19} color="#D2F500" />
            </div>
            <div>
              <div style={{
                fontSize: '0.96rem',
                fontWeight: '700',
                color: 'var(--ghost-white)',
                maxWidth: '300px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {imageItem.name}
              </div>
              <div style={{
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--ghost-white-muted)'
              }}>
                {imageItem.dimensions.width} × {imageItem.dimensions.height} px • {formatBytes(imageItem.size)}
              </div>
            </div>
          </div>

          {/* Forensic Filter Switcher Pills */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(5, 24, 41, 0.7)',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid rgba(248, 248, 255, 0.08)'
          }}>
            {filters.map((f) => {
              const isActive = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  style={{
                    background: isActive ? 'rgba(210, 245, 0, 0.16)' : 'transparent',
                    border: isActive ? '1px solid rgba(210, 245, 0, 0.45)' : '1px solid transparent',
                    color: isActive ? '#D2F500' : 'var(--ghost-white-subtle)',
                    padding: '6px 12px',
                    borderRadius: '7px',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: isActive ? '700' : '500',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Zoom & View Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={handleZoomIn}
              title="Zoom In"
              className="btn-secondary"
              style={{ padding: '6px 10px' }}
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              className="btn-secondary"
              style={{ padding: '6px 10px' }}
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={handleResetZoom}
              title="Reset Zoom"
              className="btn-secondary"
              style={{ padding: '6px 10px' }}
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Viewport Canvas Display Area */}
        <div style={{
          position: 'relative',
          minHeight: '360px',
          maxHeight: '520px',
          background: '#04111d',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(248, 248, 255, 0.12)',
          boxShadow: 'inset 0 0 50px rgba(0, 0, 0, 0.85)'
        }}>
          {/* Laser scanline overlay when analyzing */}
          {isAnalyzing && <div className="scan-laser-line" />}

          {/* Reticle Grid Lines */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(to right, rgba(248, 248, 255, 0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(248, 248, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
            pointerEvents: 'none'
          }} />

          {/* Canvas Element with zoom transform */}
          <div style={{
            transform: `scale(${zoomLevel})`,
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '100%',
            maxHeight: '100%'
          }}>
            <canvas 
              ref={canvasRef} 
              style={{
                maxWidth: '100%',
                maxHeight: '480px',
                objectFit: 'contain',
                borderRadius: '4px',
                display: 'block'
              }}
            />
          </div>

          {/* Active Mode Watermark Tag */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            background: 'rgba(9, 39, 66, 0.88)',
            border: '1px solid rgba(210, 245, 0, 0.3)',
            padding: '4px 10px',
            borderRadius: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            color: '#D2F500',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backdropFilter: 'blur(8px)'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D2F500', boxShadow: '0 0 6px #D2F500' }} />
            <span>FILTER: {activeFilter.toUpperCase()}</span>
            <span>|</span>
            <span>ZOOM: {Math.round(zoomLevel * 100)}%</span>
          </div>
        </div>

        {/* Action Controls & Remove Option */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginTop: '22px'
        }}>
          {/* Remove Image Option */}
          <button
            type="button"
            onClick={onRemove}
            disabled={isAnalyzing}
            className="btn-danger-outline"
          >
            <Trash2 size={16} />
            <span>Remove Image</span>
          </button>

          {/* Analyze Image Button (Acid Green Primary CTA) */}
          <button
            type="button"
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="btn-primary"
            style={{
              padding: '14px 32px',
              fontSize: '1rem',
              boxShadow: '0 4px 24px rgba(210, 245, 0, 0.4)'
            }}
          >
            <Scan size={18} color="#092742" />
            <span>{isAnalyzing ? 'Analyzing Visual Patterns...' : 'Analyze Image'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
