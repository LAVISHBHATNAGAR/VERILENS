import React from 'react';
import { ShieldCheck, Eye, Cpu, Lock, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

export default function Hero({ onExploreSamples }) {
  return (
    <section style={{
      textAlign: 'center',
      padding: '48px 0 28px 0',
      position: 'relative'
    }}>
      {/* Top Cyber Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 14px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.1) 0%, rgba(168, 85, 247, 0.15) 100%)',
        border: '1px solid rgba(0, 240, 255, 0.3)',
        marginBottom: '20px',
        boxShadow: '0 0 20px rgba(0, 240, 255, 0.15)'
      }}>
        <Sparkles size={14} color="#00f0ff" />
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          letterSpacing: '0.08em',
          fontWeight: '600',
          color: '#38bdf8',
          textTransform: 'uppercase'
        }}>
          Multi-Spectral Visual Forensics • Demo Engine
        </span>
      </div>

      {/* Main Heading as requested */}
      <h1 style={{
        fontSize: 'clamp(2.1rem, 4.8vw, 3.4rem)',
        fontWeight: '800',
        letterSpacing: '-0.03em',
        lineHeight: 1.15,
        marginBottom: '16px',
        maxWidth: '920px',
        margin: '0 auto 16px auto'
      }}>
        <span className="text-gradient-cyan">Is This Image Real</span>{' '}
        <span style={{ color: '#94a3b8', fontWeight: '400' }}>or</span>{' '}
        <span className="text-gradient-purple">AI Generated?</span>
      </h1>

      {/* Subtitle as requested */}
      <p style={{
        fontSize: 'clamp(1rem, 2vw, 1.18rem)',
        color: 'var(--text-secondary)',
        maxWidth: '720px',
        margin: '0 auto 28px auto',
        lineHeight: 1.6
      }}>
        Upload an image and analyze visual patterns to identify possible signs of AI generation.
      </p>

      {/* Capabilities Feature Badges */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <div className="mono-badge mono-badge-cyan">
          <Eye size={12} />
          <span>Error Level Analysis (ELA)</span>
        </div>
        <div className="mono-badge mono-badge-purple">
          <Cpu size={12} />
          <span>High-Pass Gradient Mapping</span>
        </div>
        <div className="mono-badge mono-badge-cyan">
          <ShieldCheck size={12} />
          <span>CMOS Sensor Grain Check</span>
        </div>
        <div className="mono-badge mono-badge-purple">
          <Lock size={12} />
          <span>In-Browser Private Execution</span>
        </div>
      </div>
    </section>
  );
}
