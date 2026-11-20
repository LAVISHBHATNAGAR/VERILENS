import React from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  Code, 
  GraduationCap, 
  Cpu, 
  CheckCircle2, 
  Layers, 
  BookOpen,
  Sparkles
} from 'lucide-react';

export default function AboutSection() {
  const stackItems = [
    { label: 'Frontend Framework', val: 'React 19 + Vite 6' },
    { label: 'Image Signal Processing', val: 'HTML5 Offscreen Canvas API' },
    { label: 'Computer Vision Filters', val: 'Sobel High-Pass, ELA, DCT Noise Residual' },
    { label: 'Forensic PDF Engine', val: 'Client-side jsPDF' },
    { label: 'Integrity Verification', val: 'Web Crypto API (SHA-256 Digest)' },
    { label: 'API Architecture', val: 'Pluggable REST / Microservice Adapter' }
  ];

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '20px',
          background: 'rgba(56, 189, 248, 0.1)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          marginBottom: '16px'
        }}>
          <GraduationCap size={15} color="#38bdf8" />
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#38bdf8', fontWeight: '600' }}>
            PROJECT SPECIFICATION &amp; ARCHITECTURE
          </span>
        </div>
        <h2 style={{ fontSize: '2.1rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px' }}>
          About VERILENS
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto', fontSize: '0.96rem', lineHeight: 1.6 }}>
          <strong>VERILENS – Digital Truth &amp; Safety Assistant</strong> is an academic media forensics and cybersecurity project designed to detect synthetic imagery, identify generative AI anomalies, and promote digital provenance literacy.
        </p>
      </div>

      {/* Mission & Problem Statement */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={22} color="#00f0ff" />
          <span>Mission &amp; Scope</span>
        </h3>
        <p style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.65, marginBottom: '16px' }}>
          The exponential growth of generative diffusion models (Midjourney, DALL-E 3, Stable Diffusion, FLUX) and real-time deepfakes has created an urgent need for accessible forensic verification tools. VERILENS combines client-side signal processing heuristics with an expandable API architecture, providing students, journalists, and cybersecurity researchers with an intuitive platform to inspect media authenticity.
        </p>
        <p style={{ fontSize: '0.92rem', color: '#94a3b8', lineHeight: 1.65 }}>
          In accordance with ethical academic standards, this platform does not fabricate fake cryptographic certitude: its default mode operates as an educational heuristic simulator evaluating real canvas metrics, structured for straightforward drop-in integration with production neural networks.
        </p>
      </div>

      {/* Technical Stack Overview */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Code size={22} color="#a855f7" />
          <span>System Architecture &amp; Tech Stack</span>
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '12px'
        }}>
          {stackItems.map((item, idx) => (
            <div key={idx} style={{
              background: 'rgba(7, 11, 20, 0.65)',
              padding: '14px 16px',
              borderRadius: '10px',
              border: '1px solid rgba(56, 189, 248, 0.12)'
            }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: '600', color: '#f8fafc', marginTop: '2px' }}>
                {item.val}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* College Project Credit Footer */}
      <div style={{
        padding: '20px',
        borderRadius: '12px',
        background: 'rgba(15, 23, 42, 0.5)',
        border: '1px dashed rgba(56, 189, 248, 0.25)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1' }}>
          VERILENS: AI-Powered Digital Truth &amp; Safety Assistant
        </div>
        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Developed as a Cybersecurity &amp; Computer Science capstone demonstration.
        </div>
      </div>
    </div>
  );
}
