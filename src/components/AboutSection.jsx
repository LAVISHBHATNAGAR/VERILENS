import React from 'react';
import { 
  ShieldCheck, 
  Code, 
  GraduationCap, 
  Cpu, 
  Layers, 
  Sparkles
} from 'lucide-react';

export default function AboutSection() {
  const stackItems = [
    { label: 'Frontend Framework', val: 'React 19 + Vite 6' },
    { label: 'Multi-Signal Forensic Engine', val: 'Node.js Express + Sharp + Fast-PNG' },
    { label: 'Spectral Frequency Signal', val: '2D Discrete Fourier Transform (FFT) Power Falloff' },
    { label: 'Sensor Physics Signal', val: 'High-Pass Wavelet Residual & PRNU Noise Floor' },
    { label: 'Deep Learning Model', val: 'Pretrained ViT AI Image Detector' },
    { label: 'Optical Distortion Signal', val: 'Radial Chromatic Aberration & Lens Dispersion' },
    { label: 'Forensic PDF Engine', val: 'Client-side jsPDF with Embedded Spectral Data' },
    { label: 'Integrity Verification', val: 'Web Crypto SHA-256 Digest' }
  ];

  return (
    <div id="about-section" style={{ maxWidth: '920px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '7px 16px',
          borderRadius: '24px',
          background: 'rgba(12, 51, 85, 0.7)',
          border: '1px solid rgba(210, 245, 0, 0.35)',
          marginBottom: '18px'
        }}>
          <GraduationCap size={16} color="#D2F500" />
          <span style={{ fontSize: '0.76rem', fontFamily: 'var(--font-mono)', color: '#D2F500', fontWeight: '700' }}>
            PROJECT SPECIFICATION &amp; ARCHITECTURE
          </span>
        </div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--ghost-white)', marginBottom: '10px' }}>
          About VERILENS
        </h2>
        <p style={{ color: 'var(--ghost-white-subtle)', maxWidth: '680px', margin: '0 auto', fontSize: '0.98rem', lineHeight: 1.65 }}>
          <strong>VERILENS – Digital Truth &amp; Safety Assistant</strong> is an academic media forensics and cybersecurity platform designed to detect synthetic imagery, identify generative AI anomalies, and promote digital provenance literacy.
        </p>
      </div>

      {/* Mission & Scope */}
      <div className="glass-panel" style={{ padding: '30px', marginBottom: '24px', background: 'rgba(12, 51, 85, 0.75)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--ghost-white)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={22} color="#D2F500" />
          <span>Mission &amp; Scope</span>
        </h3>
        <p style={{ fontSize: '0.94rem', color: 'var(--ghost-white-subtle)', lineHeight: 1.7, marginBottom: '16px' }}>
          The exponential growth of generative diffusion models (Midjourney, DALL-E 3, Stable Diffusion, FLUX) and real-time deepfakes has created an urgent need for accessible forensic verification tools. VERILENS combines physical camera sensor modeling, 2D Fourier frequency domain analysis, chromatic lens physics, and pretrained deep learning detectors into an ensemble forensic pipeline.
        </p>
        <p style={{ fontSize: '0.94rem', color: 'var(--ghost-white-muted)', lineHeight: 1.7 }}>
          In accordance with ethical academic and scientific standards, VERILENS incorporates an uncertainty protocol: images with compressed, edited, or ambiguous signatures are marked as INCONCLUSIVE with calibrated confidence intervals rather than forcing fabricated certainty.
        </p>
      </div>

      {/* Technical Stack Overview */}
      <div className="glass-panel" style={{ padding: '30px', marginBottom: '24px', background: 'rgba(12, 51, 85, 0.75)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--ghost-white)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Code size={22} color="#D2F500" />
          <span>System Architecture &amp; Tech Stack</span>
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '12px'
        }}>
          {stackItems.map((item, idx) => (
            <div key={idx} style={{
              background: 'rgba(5, 24, 41, 0.7)',
              padding: '16px 18px',
              borderRadius: '10px',
              border: '1px solid rgba(248, 248, 255, 0.08)'
            }}>
              <div style={{ fontSize: '0.74rem', color: '#D2F500', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: '600', color: 'var(--ghost-white)', marginTop: '4px', lineHeight: 1.45 }}>
                {item.val}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* College Project Credit Footer */}
      <div style={{
        padding: '22px',
        borderRadius: '12px',
        background: 'rgba(12, 51, 85, 0.5)',
        border: '1px dashed rgba(210, 245, 0, 0.35)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--ghost-white)' }}>
          VERILENS: AI-Powered Digital Truth &amp; Safety Assistant
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--ghost-white-muted)', marginTop: '4px' }}>
          Developed as a Cybersecurity &amp; Computer Science capstone demonstration.
        </div>
      </div>
    </div>
  );
}
