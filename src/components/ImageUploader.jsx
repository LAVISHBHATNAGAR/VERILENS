import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileImage,
  AlertCircle,
  ChevronRight,
  Layers
} from 'lucide-react';
import { SAMPLE_IMAGES } from '../data/sampleImages';

const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;

/**
 * Procedural 4:3 darkroom film-frame specimen plate artwork tailored to each calibration test case.
 * Replaces cartoonish circular vector icons with crisp optical / spectral telemetry thumbnails.
 */
function SpecimenFilmPlate({ sampleId, frameIndex, isAi }) {
  const frameTag = `F0${frameIndex + 1}`;

  return (
    <div className="relative w-16 aspect-[4/3] rounded-md overflow-hidden bg-[#0a0b0f] border border-[#27272a] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] shrink-0">
      <svg viewBox="0 0 80 60" className="w-full h-full block" aria-hidden="true">
        <defs>
          <radialGradient id={`plateGlow-${sampleId}`} cx="50%" cy="45%" r="58%">
            <stop offset="0%" stopColor={isAi ? '#ff2e2e' : '#34d399'} stopOpacity="0.45" />
            <stop offset="65%" stopColor={isAi ? '#3a0e19' : '#132434'} stopOpacity="0.7" />
            <stop offset="100%" stopColor="#08090d" stopOpacity="1" />
          </radialGradient>
          <pattern id={`plateGrid-${sampleId}`} width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" stroke={isAi ? '#ff5e78' : '#93b0f5'} strokeWidth="0.4" strokeOpacity="0.24" />
          </pattern>
        </defs>

        <rect width="80" height="60" fill={`url(#plateGlow-${sampleId})`} />

        {sampleId === 'sample-ai-portrait' && (
          <>
            <rect width="80" height="60" fill={`url(#plateGrid-${sampleId})`} />
            <ellipse cx="40" cy="27" rx="14" ry="17" fill="none" stroke="#ff5e78" strokeWidth="1" strokeOpacity="0.85" />
            <circle cx="34" cy="25" r="2" fill="#ff2e2e" />
            <circle cx="46" cy="25" r="2" fill="#ff2e2e" />
            <path d="M22 44 Q40 35 58 44" fill="none" stroke="#ffafbd" strokeWidth="0.9" strokeOpacity="0.65" />
            <line x1="10" y1="18" x2="70" y2="18" stroke="#ff2e2e" strokeWidth="0.6" strokeOpacity="0.45" />
          </>
        )}

        {sampleId === 'sample-real-nature' && (
          <>
            <circle cx="24" cy="20" r="10" fill="#34d399" fillOpacity="0.18" stroke="#34d399" strokeOpacity="0.4" strokeWidth="0.7" />
            <circle cx="52" cy="36" r="14" fill="#30447a" fillOpacity="0.3" stroke="#93b0f5" strokeOpacity="0.45" strokeWidth="0.7" />
            <path d="M6 48 Q26 32 48 41 T74 36" fill="none" stroke="#34d399" strokeWidth="1.2" strokeOpacity="0.8" />
            <circle cx="40" cy="28" r="18" fill="none" stroke="#fcfcfc" strokeOpacity="0.2" strokeWidth="0.6" strokeDasharray="2 2" />
          </>
        )}

        {sampleId === 'sample-ai-landscape' && (
          <>
            <rect width="80" height="60" fill={`url(#plateGrid-${sampleId})`} />
            <rect x="14" y="20" width="12" height="32" fill="#ff2e2e" fillOpacity="0.16" stroke="#ff5e78" strokeWidth="0.7" />
            <rect x="33" y="13" width="16" height="39" fill="#ff5e78" fillOpacity="0.18" stroke="#ff2e2e" strokeWidth="0.8" />
            <rect x="55" y="23" width="11" height="29" fill="#ff2e2e" fillOpacity="0.14" stroke="#ff5e78" strokeWidth="0.7" />
            <line x1="0" y1="52" x2="80" y2="52" stroke="#ff5e78" strokeWidth="0.9" strokeOpacity="0.75" />
          </>
        )}

        {sampleId === 'sample-street-photo' && (
          <>
            <polygon points="8,12 44,20 44,50 8,54" fill="#1a233b" fillOpacity="0.75" stroke="#6b85c9" strokeWidth="0.8" />
            <polygon points="44,20 72,12 72,54 44,50" fill="#0d1526" fillOpacity="0.85" stroke="#34d399" strokeWidth="0.7" strokeOpacity="0.65" />
            <line x1="26" y1="16" x2="26" y2="52" stroke="#93b0f5" strokeWidth="0.7" strokeOpacity="0.45" />
            <circle cx="58" cy="32" r="4" fill="none" stroke="#34d399" strokeWidth="0.9" />
          </>
        )}

        {/* Delicate Film-Frame Registration Ticks */}
        <path d="M2 7V2H7M73 2H78V7M2 53V58H7M73 58H78V53" fill="none" stroke="#fcfcfc" strokeOpacity="0.35" strokeWidth="0.8" />
      </svg>

      {/* Recessed Micro Frame Index */}
      <span className="absolute bottom-0.5 right-1 font-mono text-[7.5px] tracking-wider text-white/70 bg-black/65 px-1 rounded-[2px] tabular-nums">
        {frameTag}
      </span>
    </div>
  );
}

/**
 * Tiny inline SVG telemetry sparkline next to AI-GEN / REAL tags:
 * - REAL: smooth logarithmic 1/f optical decay curve (emerald)
 * - AI-GEN: jagged high-frequency FFT harmonic interference spike (crimson)
 */
function SignalSparkline({ isAi }) {
  return (
    <svg viewBox="0 0 36 12" className="w-9 h-3 shrink-0" fill="none" aria-hidden="true">
      {isAi ? (
        <polyline
          points="1,10 6,8 10,9 15,2 19,10 24,3 28,9 35,4"
          stroke="#ff5e78"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M 1 2 C 8 2.5, 16 7, 35 10"
          stroke="#34d399"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export default function ImageUploader({ onImageSelected }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, active: false });
  const [hoveredSampleId, setHoveredSampleId] = useState(SAMPLE_IMAGES[0]?.id || null);
  const fileInputRef = useRef(null);

  const validateAndProcessFile = (file) => {
    setErrorMessage('');
    if (!file) return;

    const extension = '.' + (file.name.split('.').pop() || '').toLowerCase();
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

  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    setSpotlight({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      active: true
    });
  };

  const activeSampleNote =
    SAMPLE_IMAGES.find((s) => s.id === hoveredSampleId)?.description ||
    'Click any reference specimen to inspect FFT harmonics, CMOS noise variance, and EXIF provenance.';

  return (
    <section id="image-uploader-section" className="mx-auto py-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* LEFT (7 cols): Precision Optical Viewfinder Dropzone */}
        <div className="lg:col-span-7 flex flex-col">
          <div
            role="button"
            tabIndex={0}
            aria-label="Upload an image for multi-signal forensic inspection"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setSpotlight((prev) => ({ ...prev, active: false }))}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            className={`group relative flex-1 rounded-[20px] p-8 sm:p-10 lg:p-12 text-center cursor-pointer overflow-hidden border transition-all duration-300 flex flex-col items-center justify-center min-h-[340px] ${
              isDragOver
                ? 'border-[#ff2e2e] bg-[var(--bg-blue-light)] shadow-[0_18px_45px_-8px_rgba(255,46,46,0.35)] scale-[1.005]'
                : 'border-[var(--border-hairline)] bg-[var(--glass-bg)] shadow-[var(--glass-shadow)] hover:border-[#ff5e78]/50'
            }`}
            style={{
              backdropFilter: 'var(--glass-blur)',
              WebkitBackdropFilter: 'var(--glass-blur)'
            }}
          >
            {/* Corner Precision Optical Reticles */}
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute top-3.5 left-3.5 w-4 h-4 border-t-2 border-l-2 rounded-tl transition-all duration-300 ${
                spotlight.active || isDragOver
                  ? 'border-[#ff2e2e] translate-x-0.5 translate-y-0.5'
                  : 'border-[#ff5e78]/40'
              }`}
            />
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute top-3.5 right-3.5 w-4 h-4 border-t-2 border-r-2 rounded-tr transition-all duration-300 ${
                spotlight.active || isDragOver
                  ? 'border-[#ff2e2e] -translate-x-0.5 translate-y-0.5'
                  : 'border-[#ff5e78]/40'
              }`}
            />
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute bottom-3.5 left-3.5 w-4 h-4 border-b-2 border-l-2 rounded-bl transition-all duration-300 ${
                spotlight.active || isDragOver
                  ? 'border-[#ff2e2e] translate-x-0.5 -translate-y-0.5'
                  : 'border-[#ff5e78]/40'
              }`}
            />
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute bottom-3.5 right-3.5 w-4 h-4 border-b-2 border-r-2 rounded-br transition-all duration-300 ${
                spotlight.active || isDragOver
                  ? 'border-[#ff2e2e] -translate-x-0.5 -translate-y-0.5'
                  : 'border-[#ff5e78]/40'
              }`}
            />

            {/* Cursor-reactive Crimson spotlight */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 transition-opacity duration-300"
              style={{
                opacity: spotlight.active || isDragOver ? 1 : 0,
                background: `radial-gradient(380px circle at ${spotlight.x}% ${spotlight.y}%, rgba(255, 46, 46, 0.17), transparent 65%)`
              }}
            />

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              className="hidden"
              aria-hidden="true"
              tabIndex={-1}
            />

            <div className="relative z-10 flex flex-col items-center max-w-md">
              <div className="w-14 h-14 rounded-2xl bg-[#ff2e2e]/12 border border-[#ff2e2e]/35 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105">
                <UploadCloud className="w-7 h-7 text-[#ff5e78]" />
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-1.5">
                {isDragOver ? 'Release Image Into Forensic Sandbox' : 'Optical Intake & Provenance Dropzone'}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mb-5 leading-relaxed">
                Drop any suspect frame or browse locally to run ELA, Sobel edges, 2D FFT harmonics, and the 8× Pixel Loupe.
              </p>

              <span className="btn-primary px-6 py-2.5 text-sm pointer-events-none">
                <FileImage className="w-4 h-4" />
                <span>Select Image File</span>
              </span>

              <div className="mt-5 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                JPG · PNG · WEBP · MAX 15 MB · 0 KB DISK RETENTION
              </div>
            </div>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="mt-3 rounded-xl bg-[var(--error-bg)] border border-red-500/35 px-4 py-3 flex items-center gap-2.5 text-sm text-[var(--error)]"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* RIGHT (5 cols): Calibrated Reference Specimens Plates */}
        <div className="lg:col-span-5 glass-panel rounded-[20px] flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border-hairline)] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#ff5e78]" />
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Calibrated Reference Specimens
              </h3>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              1-Click Load
            </span>
          </div>

          <div className="flex-1 divide-y divide-[var(--border-hairline)]">
            {SAMPLE_IMAGES.map((sample, idx) => {
              const isAi = sample.category === 'ai';
              const isHovered = hoveredSampleId === sample.id;
              return (
                <button
                  key={sample.id}
                  type="button"
                  onMouseEnter={() => setHoveredSampleId(sample.id)}
                  onFocus={() => setHoveredSampleId(sample.id)}
                  onClick={() => handleSelectSample(sample)}
                  className={`relative w-full px-6 py-4 text-left flex items-center gap-4 transition-all duration-200 group hover:-translate-y-[1px] border-l-2 ${
                    isHovered
                      ? isAi
                        ? 'bg-[var(--bg-hover)]/45 border-l-[#ff2e2e]'
                        : 'bg-[var(--bg-hover)]/45 border-l-emerald-400'
                      : 'border-l-transparent'
                  }`}
                >
                  <SpecimenFilmPlate sampleId={sample.id} frameIndex={idx} isAi={isAi} />

                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold text-[var(--text-primary)] leading-snug">
                      {sample.title}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span
                        className={`font-mono text-[9.5px] font-semibold px-1.5 py-0.5 rounded-[4px] border ${
                          isAi
                            ? 'bg-[var(--error-bg)] text-[var(--error)] border-[#ff2e2e]/35'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {isAi ? 'AI-GEN' : 'REAL'}
                      </span>

                      <SignalSparkline isAi={isAi} />

                      <span className="font-mono text-[10px] text-[var(--text-muted)] tabular-nums">
                        {sample.dimensions.width}×{sample.dimensions.height}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--text-muted)] shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:text-[#ff5e78]" />
                </button>
              );
            })}
          </div>

          <div className="px-6 py-3.5 border-t border-[var(--border-hairline)] bg-[var(--bg-main)]/55 text-[11.5px] text-[var(--text-muted)] leading-relaxed min-h-[48px] flex items-center">
            {activeSampleNote}
          </div>
        </div>
      </div>
    </section>
  );
}
