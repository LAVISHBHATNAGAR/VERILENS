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
      {/* Drag & Drop Zone */}
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
          borderColor: isDragOver ? '#2563EB' : '#CBD5E1',
          borderRadius: '16px',
          backgroundColor: isDragOver ? '#EFF6FF' : '#FFFFFF',
          boxShadow: isDragOver ? '0 0 0 4px rgba(37,99,235,0.1)' : '0 1px 3px rgba(0,0,0,0.07)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.2s ease'
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
        />

        {/* Upload Icon */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          margin: '0 auto 20px auto',
          background: isDragOver ? '#EFF6FF' : '#F1F5F9',
          border: `2px solid ${isDragOver ? '#2563EB' : '#E2E8F0'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease'
        }}>
          <UploadCloud size={32} color={isDragOver ? '#2563EB' : '#94A3B8'} />
        </div>

        <h3 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.15rem',
          fontWeight: '700',
          color: '#172B4D',
          marginBottom: '8px'
        }}>
          {isDragOver ? 'Drop your image here' : 'Drag & drop an image to verify'}
        </h3>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.88rem',
          color: '#64748B',
          marginBottom: '22px',
          fontWeight: '400'
        }}>
          Supported formats: JPG, JPEG, PNG, WEBP · Maximum size: 15 MB
        </p>

        <button
          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
          className="btn-primary"
          style={{ pointerEvents: 'none', fontFamily: 'var(--font-body)', fontWeight: '600' }}
        >
          <FileImage size={16} />
          <span>Browse Image</span>
        </button>

        {/* Privacy note */}
        <div style={{
          marginTop: '20px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.78rem',
          color: '#64748B',
          fontFamily: 'var(--font-body)',
          fontWeight: '400',
          padding: '5px 14px',
          borderRadius: '20px',
          background: '#F8FAFC',
          border: '1px solid #E2E8F0'
        }}>
          <CheckCircle2 size={13} color="#16A34A" />
          <span>Images are not stored. Analyzed locally or discarded after processing.</span>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div style={{
          marginTop: '14px',
          padding: '13px 16px',
          borderRadius: '10px',
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#DC2626',
          fontSize: '0.88rem',
          fontFamily: 'var(--font-body)'
        }}>
          <AlertCircle size={17} color="#DC2626" style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Sample Images */}
      <div style={{ marginTop: '36px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={15} color="#2563EB" />
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.92rem', fontWeight: '600', color: '#172B4D' }}>
              Or test with benchmark reference images:
            </span>
          </div>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.76rem', color: '#64748B' }}>
            One-click instant analysis
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '10px'
        }}>
          {SAMPLE_IMAGES.map((sample) => {
            const isAi = sample.category === 'ai';
            return (
              <div
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className="glass-panel"
                style={{
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  borderRadius: '10px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#CBD5E1';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.07)';
                }}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  flexShrink: 0
                }}>
                  <img src={sample.dataUrl} alt={sample.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ overflow: 'hidden', flex: 1 }}>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: '#172B4D',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {sample.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                    <span style={{
                      fontSize: '0.66rem',
                      fontFamily: 'var(--font-mono)',
                      color: isAi ? '#DC2626' : '#16A34A',
                      fontWeight: '500',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      background: isAi ? '#FEF2F2' : '#F0FDF4',
                      border: `1px solid ${isAi ? '#FECACA' : '#BBF7D0'}`
                    }}>
                      {isAi ? 'AI-GEN' : 'REAL'}
                    </span>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#94A3B8', fontWeight: '400' }}>
                      {sample.dimensions.width}×{sample.dimensions.height}
                    </span>
                  </div>
                </div>
                <ChevronRight size={14} color="#94A3B8" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
