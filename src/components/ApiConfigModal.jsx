import React, { useState } from 'react';
import { 
  X, 
  Sliders, 
  Cpu, 
  Globe, 
  Key, 
  Code, 
  CheckCircle2, 
  ExternalLink,
  ShieldAlert,
  Save
} from 'lucide-react';
import { DETECTION_MODES } from '../services/detectionService';

export default function ApiConfigModal({ 
  isOpen, 
  onClose, 
  config, 
  onSaveConfig 
}) {
  const [mode, setMode] = useState(config.mode || DETECTION_MODES.DEMO);
  const [endpoint, setEndpoint] = useState(config.apiEndpoint || '');
  const [apiKey, setApiKey] = useState(config.apiKey || '');
  const [showCode, setShowCode] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveConfig({
      mode,
      apiEndpoint: endpoint.trim(),
      apiKey: apiKey.trim()
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const samplePythonBackend = `# Sample FastAPI / PyTorch Backend for VERILENS
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import torch
from PIL import Image
import io

app = FastAPI(title="VERILENS Detection Node")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/detect")
async def detect_ai_image(image: UploadFile = File(...)):
    contents = await image.read()
    img = Image.open(io.BytesIO(contents))
    
    # Run through your fine-tuned ResNet / ViT or HuggingFace model
    # Example output structure matching VERILENS schema:
    return {
        "ai_score": 0.89, # 89% AI likelihood
        "summary": "Deep neural network detected spatial high-frequency artifacts typical of diffusion synthesis.",
        "anomalies": [
            {"id": "feat-1", "severity": "HIGH", "category": "Diffusion Artifact", "title": "High Frequency Disparity", "description": "Layer activations highlight synthetic edge transitions."}
        ]
    }`;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 250,
      background: 'rgba(3, 7, 18, 0.8)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '580px',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: '#090d1a',
        border: '1px solid rgba(0, 240, 255, 0.3)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 240, 255, 0.15)',
        borderRadius: '16px',
        padding: '28px'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          paddingBottom: '14px',
          borderBottom: '1px solid rgba(56, 189, 248, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(0, 240, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(0, 240, 255, 0.35)'
            }}>
              <Sliders size={20} color="#00f0ff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ffffff' }}>
                Forensic Engine Configuration
              </h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Select analysis mode or integrate external AI vision models
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          {/* Mode Selector */}
          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '10px' }}>
              Select Operational Engine:
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Option 1: Demo Heuristic */}
              <div
                onClick={() => setMode(DETECTION_MODES.DEMO)}
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: mode === DETECTION_MODES.DEMO ? '1px solid #00f0ff' : '1px solid rgba(56, 189, 248, 0.15)',
                  background: mode === DETECTION_MODES.DEMO ? 'rgba(0, 240, 255, 0.08)' : 'rgba(15, 23, 42, 0.5)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: mode === DETECTION_MODES.DEMO ? '5px solid #00f0ff' : '2px solid #64748b',
                  marginTop: '2px',
                  flexShrink: 0
                }} />
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: '600', color: '#f8fafc' }}>
                    Client-Side Demo Heuristic Mode (Active Default)
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.45 }}>
                    Evaluates local image canvas entropy, DCT quantization, and noise floor. Fully functional offline with zero API requirements.
                  </div>
                </div>
              </div>

              {/* Option 2: Custom API */}
              <div
                onClick={() => setMode(DETECTION_MODES.API)}
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: mode === DETECTION_MODES.API ? '1px solid #a855f7' : '1px solid rgba(56, 189, 248, 0.15)',
                  background: mode === DETECTION_MODES.API ? 'rgba(168, 85, 247, 0.08)' : 'rgba(15, 23, 42, 0.5)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: mode === DETECTION_MODES.API ? '5px solid #a855f7' : '2px solid #64748b',
                  marginTop: '2px',
                  flexShrink: 0
                }} />
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: '600', color: '#f8fafc' }}>
                    Custom Cloud API / Backend Model
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.45 }}>
                    Route uploads to an external AI detection REST endpoint (e.g., Sightengine, Hive, Hugging Face, or local FastAPI server).
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* API Credentials Inputs if API mode selected */}
          {mode === DETECTION_MODES.API && (
            <div style={{
              background: 'rgba(7, 11, 20, 0.75)',
              padding: '16px',
              borderRadius: '10px',
              border: '1px solid rgba(168, 85, 247, 0.25)',
              marginBottom: '20px'
            }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '6px' }}>
                  Endpoint REST URL:
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="url"
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                    placeholder="https://your-api.com/v1/detect"
                    required={mode === DETECTION_MODES.API}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 34px',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      fontFamily: 'var(--font-mono)'
                    }}
                  />
                  <Globe size={15} color="#64748b" style={{ position: 'absolute', left: '10px', top: '12px' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '6px' }}>
                  Bearer API Key / Token:
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk_live_..."
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 34px',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      fontFamily: 'var(--font-mono)'
                    }}
                  />
                  <Key size={15} color="#64748b" style={{ position: 'absolute', left: '10px', top: '12px' }} />
                </div>
              </div>
            </div>
          )}

          {/* Toggle Developer Integration Code */}
          <div style={{ marginBottom: '22px' }}>
            <button
              type="button"
              onClick={() => setShowCode(!showCode)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#38bdf8',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                padding: '4px 0'
              }}
            >
              <Code size={14} />
              <span>{showCode ? 'Hide Backend Integration Code' : 'View Backend Python / FastAPI Sample'}</span>
            </button>

            {showCode && (
              <pre style={{
                marginTop: '10px',
                padding: '14px',
                borderRadius: '8px',
                background: 'rgba(3, 7, 18, 0.95)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                color: '#93c5fd',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                overflowX: 'auto',
                lineHeight: 1.45
              }}>
                {samplePythonBackend}
              </pre>
            )}
          </div>

          {/* Footer Save Button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              <Save size={16} />
              <span>{savedSuccess ? 'Config Saved!' : 'Apply Configuration'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
