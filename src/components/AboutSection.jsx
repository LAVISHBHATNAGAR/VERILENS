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
          padding: '6px 16px',
          borderRadius: '9999px',
          background: 'var(--badge-blue-bg)',
          marginBottom: '16px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <GraduationCap size={15} color="var(--badge-blue-text)" />
          <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', fontWeight: '500', color: 'var(--badge-blue-text)' }}>
            PROJECT SPECIFICATION &amp; ARCHITECTURE
          </span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>
          About VERILENS
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontWeight: '400', color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto', fontSize: '0.96rem', lineHeight: 1.65 }}>
          <strong>VERILENS – Digital Truth &amp; Safety Assistant</strong> is an academic media forensics and cybersecurity platform designed to detect synthetic imagery, identify generative AI anomalies, and promote digital provenance literacy.
        </p>
      </div>

      {/* Mission & Scope */}
      <div className="glass-panel" style={{ padding: '30px', marginBottom: '24px', borderRadius: '24px' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={22} color="var(--blue-light)" />
          <span>Mission &amp; Scope</span>
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', fontWeight: '400', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '14px' }}>
          The exponential growth of generative diffusion models (Midjourney, DALL-E 3, Stable Diffusion, FLUX) and real-time deepfakes has created an urgent need for accessible forensic verification tools. VERILENS combines physical camera sensor modeling, 2D Fourier frequency domain analysis, chromatic lens physics, and pretrained deep learning detectors into an ensemble forensic pipeline.
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', fontWeight: '400', color: 'var(--text-muted)', lineHeight: 1.7 }}>
          In accordance with ethical academic and scientific standards, VERILENS incorporates an uncertainty protocol: images with compressed, edited, or ambiguous signatures are marked as INCONCLUSIVE with calibrated confidence intervals rather than forcing fabricated certainty.
        </p>
      </div>

      {/* Technical Stack Overview */}
      <div className="glass-panel" style={{ padding: '30px', marginBottom: '24px', borderRadius: '24px' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Code size={22} color="var(--blue-light)" />
          <span>System Architecture &amp; Tech Stack</span>
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '12px'
        }}>
          {stackItems.map((item, idx) => (
            <div key={idx} style={{
              background: 'var(--sub-block-bg)',
              padding: '16px 18px',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--blue-light)', fontFamily: 'var(--font-mono)', fontWeight: '500' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '0.9rem', fontFamily: 'var(--font-body)', fontWeight: '500', color: 'var(--text-primary)', marginTop: '4px', lineHeight: 1.45 }}>
                {item.val}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* College Project Credit Footer */}
      <div style={{
        padding: '22px',
        borderRadius: '20px',
        background: 'var(--badge-blue-bg)',
        boxShadow: 'var(--shadow-sm)',
        textAlign: 'center'
      }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.92rem', fontWeight: '600', color: 'var(--text-primary)' }}>
          VERILENS: AI-Powered Digital Truth &amp; Safety Assistant
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: '400', color: 'var(--text-muted)', marginTop: '4px' }}>
          Developed as a Cybersecurity &amp; Computer Science capstone demonstration.
        </div>
      </div>
    </div>
  );
}
