import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileImage,
  AlertCircle,
  ChevronRight,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { SAMPLE_IMAGES } from '../data/sampleImages';

const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;

export default function ImageUploader({ onImageSelected }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const validateAndProcessFile = (file) => {
    setErrorMessage('');
    if (!file) return;
    const extension = '.' + file.name.split('.').pop().toLowerCase();
    const isValidExtension = ACCEPTED_EXTENSIONS.includes(extension);
    const isValidMime = ACCEPTED_MIME_TYPES.includes(file.type) || file.type.startsWith('image/');
    if (!isValidExtension && !isValidMime) {
      setErrorMessage(`Unsupported format "${extension || file.type}". Please upload JPG, JPEG, PNG, or WEBP images.`);
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 15 MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        onImageSelected({
          file,
          name: file.name,
          size: file.size,
          type: file.type || 'image/jpeg',
          dataUrl: e.target.result,
          element: img,
          dimensions: { width: img.naturalWidth || img.width, height: img.naturalHeight || img.height }
        });
      };
      img.onerror = () => setErrorMessage('Unable to decode image pixels. Please try another file.');
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(false); };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) validateAndProcessFile(e.dataTransfer.files[0]);
  };
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) validateAndProcessFile(e.target.files[0]);
  };
  const handleSelectSample = (sample) => {
    setErrorMessage('');
    const img = new Image();
    img.onload = () => {
      onImageSelected({
        file: null, name: sample.name, size: sample.size, type: sample.type,
        dataUrl: sample.dataUrl, element: img, dimensions: sample.dimensions,
        expectedScore: sample.expectedScore, category: sample.category
      });
    };
    img.src = sample.dataUrl;
  };

  return (
    <div id="image-uploader-section" style={{ maxWidth: '920px', margin: '0 auto' }}>
      {/* Drag & Drop Zone (Soft, subtle dashed border, rounded 24px) */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          padding: '56px 28px',
          textAlign: 'center',
          cursor: 'pointer',
          borderWidth: '2px',
          borderStyle: 'dashed',
          borderColor: isDragOver ? 'var(--blue)' : 'rgba(96, 165, 250, 0.28)',
          borderRadius: '24px',
          backgroundColor: isDragOver ? 'var(--bg-blue-light)' : 'var(--glass-bg)',
          boxShadow: isDragOver ? '0 12px 35px -4px rgba(37, 99, 235, 0.25)' : 'var(--glass-shadow)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
        />

        {/* Upload Icon (Soft circular glow, borderless) */}
        <div style={{
          width: '74px',
          height: '74px',
          borderRadius: '50%',
          margin: '0 auto 20px auto',
          background: isDragOver ? 'var(--bg-hover)' : 'var(--badge-blue-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <UploadCloud size={34} color="var(--badge-blue-text)" />
        </div>

        <h3 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.2rem',
          fontWeight: '700',
          color: 'var(--text-primary)',
          marginBottom: '8px'
        }}>
          {isDragOver ? 'Drop your image here' : 'Drag & drop an image to verify'}
        </h3>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.88rem',
          color: 'var(--text-muted)',
          marginBottom: '24px',
          fontWeight: '400'
        }}>
          Supported formats: JPG, JPEG, PNG, WEBP · Maximum size: 15 MB
        </p>

        {/* Browse Button (Pill, white text and white icon) */}
        <button
          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
          className="btn-primary"
          style={{ pointerEvents: 'none', fontFamily: 'var(--font-body)', fontWeight: '600', padding: '13px 30px' }}
        >
          <FileImage size={17} color="#FFFFFF" strokeWidth={2.2} />
          <span style={{ color: '#FFFFFF' }}>Browse Image</span>
        </button>

        {/* Privacy note (Borderless soft pill) */}
        <div style={{
          marginTop: '22px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.78rem',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-body)',
          fontWeight: '400',
          padding: '6px 16px',
          borderRadius: '9999px',
          background: 'var(--sub-block-bg)',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)'
        }}>
          <CheckCircle2 size={13} color="var(--success)" />
          <span>Images are not stored. Analyzed locally or discarded after processing.</span>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div style={{
          marginTop: '14px',
          padding: '14px 18px',
          borderRadius: '16px',
          background: '#FEF2F2',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#DC2626',
          fontSize: '0.88rem',
          fontFamily: 'var(--font-body)',
          boxShadow: '0 4px 14px rgba(220, 38, 38, 0.08)'
        }}>
          <AlertCircle size={18} color="#DC2626" style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Sample Images (Borderless floating cards) */}
      <div style={{ marginTop: '38px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={16} color="var(--blue-light)" />
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.94rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              Or test with benchmark reference images:
            </span>
          </div>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            One-click instant analysis
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}>
          {SAMPLE_IMAGES.map((sample) => {
            const isAi = sample.category === 'ai';
            return (
              <div
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className="glass-panel"
                style={{
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  borderRadius: '18px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: 'var(--sub-block-bg)',
                  border: 'none',
                  flexShrink: 0,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                }}>
                  <img src={sample.dataUrl} alt={sample.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ overflow: 'hidden', flex: 1 }}>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.86rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {sample.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                    <span style={{
                      fontSize: '0.66rem',
                      fontFamily: 'var(--font-mono)',
                      color: isAi ? 'var(--error)' : 'var(--success)',
                      fontWeight: '600',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      background: isAi ? 'var(--error-bg)' : 'var(--success-bg)'
                    }}>
                      {isAi ? 'AI-GEN' : 'REAL'}
                    </span>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: '400' }}>
                      {sample.dimensions.width}×{sample.dimensions.height}
                    </span>
                  </div>
                </div>
                <ChevronRight size={14} color="var(--text-muted)" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
