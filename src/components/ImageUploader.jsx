import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileImage, 
  AlertCircle, 
  Sparkles, 
  Check, 
  Camera, 
  Cpu, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { SAMPLE_IMAGES } from '../data/sampleImages';

const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB

export default function ImageUploader({ onImageSelected }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const validateAndProcessFile = (file) => {
    setErrorMessage('');

    if (!file) return;

    // Check MIME type or extension
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

    // Read file as Data URL
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
          dimensions: {
            width: img.naturalWidth || img.width,
            height: img.naturalHeight || img.height
          }
        });
      };
      img.onerror = () => {
        setErrorMessage('Unable to decode image pixels. Please try another file.');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleSelectSample = (sample) => {
    setErrorMessage('');
    const img = new Image();
    img.onload = () => {
      onImageSelected({
        file: null,
        name: sample.name,
        size: sample.size,
        type: sample.type,
        dataUrl: sample.dataUrl,
        element: img,
        dimensions: sample.dimensions,
        expectedScore: sample.expectedScore,
        category: sample.category
      });
    };
    img.src = sample.dataUrl;
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto' }}>
      {/* Drag & Drop Upload Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="glass-panel"
        style={{
          padding: '48px 24px',
          textAlign: 'center',
          cursor: 'pointer',
          borderWidth: '2px',
          borderStyle: isDragOver ? 'solid' : 'dashed',
          borderColor: isDragOver ? 'var(--cyan-core)' : 'rgba(56, 189, 248, 0.28)',
          backgroundColor: isDragOver ? 'rgba(0, 240, 255, 0.05)' : 'rgba(15, 23, 42, 0.65)',
          boxShadow: isDragOver ? '0 0 35px rgba(0, 240, 255, 0.35)' : '0 10px 30px rgba(0, 0, 0, 0.5)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.25s ease'
        }}
      >
        {/* Hidden File Input */}
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
        />

        {/* Cyber Center Icon with glowing rings */}
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          margin: '0 auto 20px auto',
          background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.15) 0%, rgba(168, 85, 247, 0.2) 100%)',
          border: '1px solid rgba(0, 240, 255, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 25px rgba(0, 240, 255, 0.2)',
          transition: 'transform 0.2s ease',
          transform: isDragOver ? 'scale(1.1)' : 'scale(1)'
        }}>
          <UploadCloud size={38} color="#00f0ff" />
        </div>

        <h3 style={{
          fontSize: '1.35rem',
          fontWeight: '700',
          marginBottom: '8px',
          color: '#ffffff'
        }}>
          {isDragOver ? 'Drop Image to Inspect' : 'Drag & Drop Your Image Here'}
        </h3>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.92rem',
          maxWidth: '520px',
          margin: '0 auto 24px auto',
          lineHeight: 1.5
        }}>
          Drop any suspicious photo or graphic to analyze synthetic visual patterns, compression discrepancies, and pixel anomalies.
        </p>

        {/* Browse Button */}
        <div style={{ marginBottom: '24px' }}>
          <button 
            type="button"
            className="btn-primary"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            <FileImage size={17} />
            <span>Browse Image</span>
          </button>
        </div>

        {/* Accepted Formats Info */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.78rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          padding: '6px 14px',
          borderRadius: '20px',
          background: 'rgba(30, 41, 59, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <span>ACCEPTED FORMATS:</span>
          <span style={{ color: '#38bdf8' }}>JPG, JPEG, PNG, WEBP</span>
          <span>•</span>
          <span>MAX SIZE:</span>
          <span style={{ color: '#c084fc' }}>15 MB</span>
        </div>
      </div>

      {/* Error Message Alert */}
      {errorMessage && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          borderRadius: '10px',
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#fca5a5',
          fontSize: '0.88rem'
        }}>
          <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Quick Test Reference Samples Bar */}
      <div style={{ marginTop: '28px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            fontWeight: '600',
            color: '#cbd5e1'
          }}>
            <Sparkles size={15} color="#00f0ff" />
            <span>Or test with benchmark sample images:</span>
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
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
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(56, 189, 248, 0.15)',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Thumbnail Preview */}
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  flexShrink: 0
                }}>
                  <img 
                    src={sample.dataUrl} 
                    alt={sample.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>

                <div style={{ overflow: 'hidden', flex: 1 }}>
                  <div style={{
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    color: '#f8fafc',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {sample.title}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '2px'
                  }}>
                    <span style={{
                      fontSize: '0.66rem',
                      fontFamily: 'var(--font-mono)',
                      color: isAi ? '#f87171' : '#34d399',
                      fontWeight: '700'
                    }}>
                      {isAi ? 'SYNTHETIC' : 'AUTHENTIC'}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                      • {sample.dimensions.width}x{sample.dimensions.height}
                    </span>
                  </div>
                </div>

                <ChevronRight size={14} color="#64748b" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
