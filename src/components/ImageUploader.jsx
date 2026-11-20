import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileImage, 
  AlertCircle, 
  Sparkles, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2
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
    <div id="image-uploader-section" style={{ maxWidth: '920px', margin: '0 auto' }}>
      {/* Drag & Drop Upload Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="glass-panel"
        style={{
          padding: '52px 28px',
          textAlign: 'center',
          cursor: 'pointer',
          borderWidth: '2px',
          borderStyle: isDragOver ? 'solid' : 'dashed',
          borderColor: isDragOver ? 'var(--acid-green)' : 'rgba(248, 248, 255, 0.16)',
          backgroundColor: isDragOver ? 'rgba(210, 245, 0, 0.06)' : 'rgba(12, 51, 85, 0.7)',
          boxShadow: isDragOver ? '0 0 40px rgba(210, 245, 0, 0.3)' : '0 14px 40px rgba(5, 24, 41, 0.7)',
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

        {/* Center Cyber Icon with glowing ring */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          margin: '0 auto 22px auto',
          background: 'linear-gradient(135deg, #092742 0%, #134673 100%)',
          border: '1px solid rgba(210, 245, 0, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 26px rgba(210, 245, 0, 0.2)',
          transition: 'transform 0.2s ease',
          transform: isDragOver ? 'scale(1.1)' : 'scale(1)'
        }}>
          <UploadCloud size={40} color="#D2F500" />
        </div>

        <h3 style={{
          fontSize: '1.45rem',
          fontWeight: '700',
          marginBottom: '10px',
          color: 'var(--ghost-white)'
        }}>
          {isDragOver ? 'Release to Inspect Visual Residuals' : 'Drag & Drop Your Image Here'}
        </h3>

        <p style={{
          color: 'var(--ghost-white-subtle)',
          fontSize: '0.94rem',
          maxWidth: '540px',
          margin: '0 auto 26px auto',
          lineHeight: 1.55
        }}>
          Drop any suspicious photograph, portrait, or graphic to analyze synthetic visual patterns, compression discrepancies, and deep learning artifacts.
        </p>

        {/* Browse Button (Acid Green CTA) */}
        <div style={{ marginBottom: '26px' }}>
          <button 
            type="button"
            className="btn-primary"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            style={{
              padding: '13px 28px',
              fontSize: '0.96rem'
            }}
          >
            <FileImage size={18} color="#092742" />
            <span>Browse Image</span>
          </button>
        </div>

        {/* Accepted Formats Info */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.78rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--ghost-white-muted)',
          padding: '7px 16px',
          borderRadius: '24px',
          background: 'rgba(5, 24, 41, 0.75)',
          border: '1px solid rgba(248, 248, 255, 0.1)'
        }}>
          <span>FORMATS:</span>
          <span style={{ color: '#D2F500', fontWeight: '700' }}>JPG, JPEG, PNG, WEBP</span>
          <span>•</span>
          <span>MAX SIZE:</span>
          <span style={{ color: 'var(--ghost-white)', fontWeight: '700' }}>15 MB</span>
        </div>
      </div>

      {/* Error Message Alert */}
      {errorMessage && (
        <div style={{
          marginTop: '16px',
          padding: '14px 18px',
          borderRadius: '10px',
          background: 'rgba(255, 71, 87, 0.12)',
          border: '1px solid rgba(255, 71, 87, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#FFA8A8',
          fontSize: '0.9rem'
        }}>
          <AlertCircle size={18} color="#FF4757" style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Benchmark Reference Samples Bar */}
      <div style={{ marginTop: '32px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.88rem',
            fontWeight: '700',
            color: 'var(--ghost-white)'
          }}>
            <Sparkles size={16} color="#D2F500" />
            <span>Or test instantly with reference benchmark images:</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--ghost-white-muted)' }}>
            One-click instant forensic audit
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
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
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  background: 'rgba(12, 51, 85, 0.65)',
                  border: '1px solid rgba(248, 248, 255, 0.1)',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Thumbnail Preview */}
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: '#051829',
                  border: '1px solid rgba(248, 248, 255, 0.12)',
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
                    fontSize: '0.84rem',
                    fontWeight: '700',
                    color: 'var(--ghost-white)',
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
                      fontSize: '0.67rem',
                      fontFamily: 'var(--font-mono)',
                      color: isAi ? '#FF6B6B' : '#D2F500',
                      fontWeight: '800'
                    }}>
                      {isAi ? 'SYNTHETIC' : 'AUTHENTIC'}
                    </span>
                    <span style={{ fontSize: '0.67rem', color: 'var(--ghost-white-muted)' }}>
                      • {sample.dimensions.width}x{sample.dimensions.height}
                    </span>
                  </div>
                </div>

                <ChevronRight size={15} color="var(--ghost-white-muted)" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
