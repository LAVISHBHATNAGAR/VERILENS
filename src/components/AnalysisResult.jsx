import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Download,
  RefreshCw,
  FileText,
  Layers,
  Info,
  Lock,
  Activity,
  AlertCircle,
  Eye,
  Sun,
  Cpu,
  Sliders,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { downloadPdfReport, downloadJsonData } from '../services/reportGenerator';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import {
  CalibratedVerdictGauge,
  ForensicRadarChart,
  SpectralDecayChart
} from './ForensicCharts';

export default function AnalysisResult({
  result,
  imageItem,
  onReset,
  onOpenApiConfig
}) {
  const [downloading, setDownloading] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const reducedMotion = useReducedMotion();

  if (!result) return null;

  const isAi = result.verdictLevel === 'ai';
  const isReal = result.verdictLevel === 'real';
  const isInconclusive = result.verdictLevel === 'inconclusive';

  const handleDownloadPdf = () => {
    setDownloading(true);
    try {
      downloadPdfReport(result, imageItem?.dataUrl);
      if (isReal && !reducedMotion) {
        confetti({
          particleCount: 42,
          spread: 60,
          origin: { y: 0.82 },
          colors: ['#ff2e2e', '#ff5e78', '#ffafbd']
        });
      }
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopySha = async () => {
    const hash = result.metadata?.sha256Hash;
    if (!hash) return;
    try {
      await navigator.clipboard.writeText(hash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 1800);
    } catch {
      // Clipboard unsupported
    }
  };

  const themeConfig = {
    ai: {
      accent: 'var(--error)',
      bg: 'var(--error-bg)',
      badge: 'mono-badge-ai',
      borderClass: 'border-red-500/30',
      icon: AlertTriangle
    },
    real: {
      accent: 'var(--success)',
      bg: 'var(--success-bg)',
      badge: 'mono-badge-real',
      borderClass: 'border-emerald-500/30',
      icon: CheckCircle2
    },
    inconclusive: {
      accent: 'var(--warning)',
      bg: 'var(--warning-bg)',
      badge: 'mono-badge-warn',
      borderClass: 'border-amber-500/30',
      icon: HelpCircle
    }
  };

  const activeTheme = themeConfig[result.verdictLevel] || themeConfig.inconclusive;
  const VerdictIcon = activeTheme.icon;

  const allSignals = [
    ...(result.anomalies || []),
    ...(result.authenticSignals || [])
  ];

  const dlPillar = result.pillars?.find((p) => (p.name || '').toLowerCase().includes('deep learning'));
  const isModelUnconfigured =
    result.modelStatus === 'UNCONFIGURED' ||
    (dlPillar && (dlPillar.status || '').toLowerCase().includes('unconfigured'));

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      {/* 1. Executive Verdict & Calibrated Gauge Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-[26px] relative overflow-hidden">
        {/* Top Metadata Telemetry Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-[var(--border-hairline)]">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className={`mono-badge ${activeTheme.badge}`}>
              <VerdictIcon className="w-3.5 h-3.5" />
              <span>FORENSIC VERDICT DOSSIER</span>
            </span>
            <span className="font-mono text-xs text-[var(--text-muted)] tabular-nums">
              ID: {result.id}
            </span>
            {result.executionTimeMs != null && (
              <span className="font-mono text-xs text-[var(--text-muted)] tabular-nums">
                · {result.executionTimeMs}ms
              </span>
            )}
            {result.isCached && (
              <span className="mono-badge mono-badge-blue text-[10px] py-0.5 px-2">
                SHA-256 CACHED
              </span>
            )}
          </div>

          <div className="font-mono text-xs text-[var(--text-muted)] flex items-center gap-2">
            <span>ENGINE:</span>
            <span className="text-[var(--blue-light)] font-medium">
              {result.isRealEngine ? 'Multi-Signal Backend Engine' : 'Client Canvas Fallback'}
            </span>
          </div>
        </div>

        {/* Verdict Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-start gap-4">
              <div
                className={`w-16 h-16 rounded-2xl border ${activeTheme.borderClass} flex items-center justify-center shrink-0`}
                style={{ background: activeTheme.bg }}
              >
                <VerdictIcon className="w-8 h-8" style={{ color: activeTheme.accent }} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                    {result.verdict}
                  </h2>
                  <span
                    className={`mono-badge ${activeTheme.badge} tabular-nums`}
                  >
                    CONFIDENCE: {result.confidenceLevel || 'Calibrated'} ({result.confidence || 0}%)
                  </span>
                </div>

                <p className="text-sm sm:text-[0.95rem] text-[var(--text-secondary)] mt-2 leading-relaxed">
                  {isInconclusive
                    ? 'Evidence falls in an ambiguous range or signals conflict; preserved as Inconclusive to avoid false attribution.'
                    : isAi
                      ? `Multi-signal forensics indicate synthetic generative markers with ${result.confidence}% calibrated confidence.`
                      : `Physical camera sensor and optical signatures align with authentic capture (${result.confidence}% calibrated confidence).`}
                </p>
              </div>
            </div>

            {/* Model Explanation Box */}
            <div
              className="rounded-2xl bg-[var(--sub-block-bg)] p-4 sm:p-5 border border-[var(--border-hairline)]"
              style={{ borderLeft: `4px solid ${activeTheme.accent}` }}
            >
              <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                <Info className="w-4 h-4 text-[var(--blue-light)]" />
                <span>CALIBRATED ASSESSMENT SUMMARY</span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {result.summary}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <CalibratedVerdictGauge
              aiScore={result.aiScore}
              realScore={result.realScore}
              confidence={result.confidence}
              verdictLevel={result.verdictLevel}
            />
          </div>
        </div>

        {/* Deep Learning Vision Model Telemetry Banner */}
        {isModelUnconfigured ? (
          <div className="rounded-2xl bg-[var(--sub-block-bg)] border border-amber-500/30 p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-[var(--warning)] shrink-0" />
              <div>
                <div className="text-sm font-semibold text-[var(--text-primary)]">
                  Deep Learning Vision Model — Unconfigured
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  Evaluation currently relies on 2D Fourier FFT harmonics, PRNU sensor noise, optical dispersion, and scene physics.
                </div>
              </div>
            </div>
            {onOpenApiConfig && (
              <button
                type="button"
                onClick={onOpenApiConfig}
                className="btn-secondary text-xs py-2 px-4"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Configure Model Key</span>
              </button>
            )}
          </div>
        ) : (
          <div className="rounded-2xl bg-[var(--success-bg)] border border-emerald-500/30 p-3.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0" />
              <span className="text-sm font-semibold text-[var(--text-primary)]">
                Deep Learning Vision Model Active: {result.modelName || dlPillar?.status}
              </span>
            </div>
            <span className="font-mono text-[11px] font-medium text-[var(--success)]">
              NEURAL INFERENCE VERIFIED
            </span>
          </div>
        )}
      </div>

      {/* 2. Interactive Quantitative Visualizations (Radar + Spectral Falloff) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ForensicRadarChart pillars={result.pillars || []} />
        <SpectralDecayChart result={result} />
      </div>

      {/* 3. Tabbed Forensic Evidence Inspector */}
      <div className="glass-panel p-5 sm:p-7 rounded-[26px]">
        <Tabs defaultValue="pillars" className="w-full">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                Forensic Evidence Breakdown
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Inspect pillar metrics, scene illumination, signal logs, and cryptographic metadata
              </p>
            </div>

            <TabsList className="h-auto p-1 rounded-full bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] flex-wrap">
              <TabsTrigger value="pillars" className="rounded-full px-3.5 py-1.5 text-xs">
                Forensic Pillars ({result.pillars?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="sherloq" className="rounded-full px-3.5 py-1.5 text-xs">
                Sherloq Suite
              </TabsTrigger>
              <TabsTrigger value="visual" className="rounded-full px-3.5 py-1.5 text-xs">
                Visual Physics
              </TabsTrigger>
              <TabsTrigger value="signals" className="rounded-full px-3.5 py-1.5 text-xs">
                Signals ({allSignals.length})
              </TabsTrigger>
              <TabsTrigger value="provenance" className="rounded-full px-3.5 py-1.5 text-xs">
                Hash &amp; Limits
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: Forensic Pillars */}
          <TabsContent value="pillars">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {(result.pillars || []).map((pillar, idx) => {
                const barColor =
                  pillar.color === 'red'
                    ? '#EF4444'
                    : pillar.color === 'emerald'
                      ? '#10B981'
                      : '#F59E0B';
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] p-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="font-semibold text-sm text-[var(--text-primary)]">
                          {pillar.name}
                        </div>
                        <span className="font-mono text-sm font-bold text-[var(--text-primary)] tabular-nums">
                          {pillar.score}%
                        </span>
                      </div>
                      <div className="font-mono text-xs font-medium" style={{ color: barColor }}>
                        {pillar.status}
                      </div>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-slate-500/20 mt-4 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pillar.score}%`, background: barColor }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* TAB 1B: Sherloq DSP Forensics Suite */}
          <TabsContent value="sherloq" className="space-y-4">
            {!result.sherloq ? (
              <div className="rounded-2xl bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] p-6 text-center text-sm text-[var(--text-muted)]">
                Sherloq DSP telemetry is available on fresh backend scans or open-workbench inspections. Re-analyze this frame to populate JPEG Ghost, Color PCA, Haar Wavelet, Bit-Plane, and Thumbnail Diff metrics.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Multi-Quality JPEG Ghost & ELA Curve */}
                  <div className="rounded-2xl bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] p-4">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-mono text-[11px] font-semibold text-[var(--text-primary)]">
                        JPEG GHOST &amp; RECOMPRESSION SWEEP
                      </span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[var(--badge-blue-bg)] text-[var(--badge-blue-text)] tabular-nums">
                        BEST MATCH: Q{result.sherloq.jpegAudit?.bestGhostQuality ?? 85}
                      </span>
                    </div>

                    {result.sherloq.jpegAudit?.ghostCurve?.length > 0 ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-4 gap-2 h-20 items-end pt-2 px-1">
                          {result.sherloq.jpegAudit.ghostCurve.map((pt) => {
                            const maxErr = Math.max(
                              1,
                              ...result.sherloq.jpegAudit.ghostCurve.map((c) => c.meanError || 0)
                            );
                            const hPct = Math.max(12, Math.round(((pt.meanError || 0) / maxErr) * 100));
                            const isBest = pt.quality === result.sherloq.jpegAudit.bestGhostQuality;
                            return (
                              <div key={pt.quality} className="h-full flex flex-col justify-end items-center gap-1">
                                <span className="font-mono text-[9.5px] text-[var(--text-muted)] tabular-nums">
                                  {pt.meanError}
                                </span>
                                <div
                                  className={`w-full max-w-[36px] rounded-t transition-all ${
                                    isBest ? 'bg-[#34d399]' : 'bg-[#ff2e2e]/75'
                                  }`}
                                  style={{ height: `${hPct}%` }}
                                />
                                <span className="font-mono text-[10px] text-[var(--text-secondary)] tabular-nums">
                                  Q{pt.quality}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="pt-2 border-t border-[var(--border-hairline)] flex items-center justify-between font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
                          <span>Q85 ELA Mean: {result.sherloq.jpegAudit.elaMeanQ85}</span>
                          <span>Hotspots: {result.sherloq.jpegAudit.elaHotspotRatio}%</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-[var(--text-muted)] leading-relaxed">
                        Interactive browser JPEG ELA and Hany Farid Ghost Maps are available directly in the workbench inspector toolbar before running analysis.
                      </div>
                    )}
                  </div>

                  {/* 3x3 Color Covariance PCA */}
                  <div className="rounded-2xl bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] p-4">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-mono text-[11px] font-semibold text-[var(--text-primary)]">
                        RGB COVARIANCE PCA EIGENVALUES
                      </span>
                      <span className="font-mono text-[10px] text-[var(--text-muted)] tabular-nums">
                        MINOR RATIO: {result.sherloq.colorPca?.minorAxisRatio ?? 0}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {(result.sherloq.colorPca?.variancePct || [0, 0, 0]).map((pct, i) => (
                        <div key={i}>
                          <div className="flex items-center justify-between font-mono text-[11px] mb-1 tabular-nums">
                            <span className="text-[var(--text-secondary)]">
                              PC{i + 1} (λ={result.sherloq.colorPca?.eigenvalues?.[i] ?? 0})
                            </span>
                            <span className="text-[var(--text-primary)] font-semibold">{pct}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-500/20 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${Math.max(2, pct)}%`,
                                background: i === 0 ? '#ff2e2e' : i === 1 ? '#ff5e78' : '#34d399'
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Secondary Sherloq Quantitative Telemetry Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="rounded-2xl bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] p-4">
                    <div className="font-mono text-[10px] text-[var(--text-muted)] mb-1">
                      MEDIAN RESIDUAL &amp; HAAR DWT
                    </div>
                    <div className="font-mono text-sm font-bold text-[var(--text-primary)] tabular-nums">
                      MAE {result.sherloq.median?.mae ?? 0} · HH {result.sherloq.wavelet?.hhEnergy ?? 0}
                    </div>
                    <div className="text-xs text-[var(--text-muted)] mt-1 tabular-nums">
                      Zero-Delta Smoothing: {result.sherloq.median?.zeroResidualRatio ?? 0}%
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] p-4">
                    <div className="font-mono text-[10px] text-[var(--text-muted)] mb-1">
                      LSB BIT-PLANE SHANNON ENTROPY
                    </div>
                    <div className="font-mono text-sm font-bold text-[var(--text-primary)] tabular-nums">
                      Bit 0: {result.sherloq.bitPlanes?.bit0Entropy ?? 0} bits
                    </div>
                    <div className="text-xs text-[var(--text-muted)] mt-1 tabular-nums">
                      Bit 1: {result.sherloq.bitPlanes?.bit1Entropy ?? 0} · Bit 2: {result.sherloq.bitPlanes?.bit2Entropy ?? 0}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] p-4">
                    <div className="font-mono text-[10px] text-[var(--text-muted)] mb-1">
                      THUMBNAIL &amp; SHERLOQ HINT
                    </div>
                    <div className="font-mono text-sm font-bold text-[var(--text-primary)] tabular-nums">
                      {result.sherloq.thumbnailAudit?.hasEmbeddedThumbnail
                        ? `EXIF Thumb MAE: ${result.sherloq.thumbnailAudit.thumbnailMae}`
                        : `Container: ${result.sherloq.thumbnailAudit?.containerFormat || 'IMAGE'}`}
                    </div>
                    <div className="text-xs text-[var(--text-muted)] mt-1 tabular-nums">
                      {typeof result.sherloq.sherloqAiHint === 'number'
                        ? `Spatial Hint: ${Math.round(result.sherloq.sherloqAiHint * 100)}% AI · ${result.sherloq.thumbnailAudit?.thumbnailMismatch ? 'MISMATCH' : 'Fast DSP'}`
                        : 'Fast Sherloq spatial scan active'}
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* TAB 2: Visual & Scene Physics */}
          <TabsContent value="visual" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[var(--blue-light)]" />
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  Scene &amp; Illumination Analysis
                </span>
              </div>
              <span className="mono-badge mono-badge-blue">
                {result.sceneTitle || 'Photographic Scene'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="rounded-2xl bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] p-4">
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--text-muted)] mb-1.5">
                  <Layers className="w-3.5 h-3.5 text-[var(--blue-light)]" />
                  <span>COMPOSITION &amp; SUBJECT</span>
                </div>
                <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                  {result.visualContent?.compositionDescription || result.sceneTitle}
                </p>
              </div>

              <div className="rounded-2xl bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] p-4">
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--text-muted)] mb-1.5">
                  <Sun className="w-3.5 h-3.5 text-[var(--blue-light)]" />
                  <span>ILLUMINATION &amp; SHADOW PHYSICS</span>
                </div>
                <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                  {result.visualContent?.lighting?.description || 'Uniform illumination distribution with balanced shadow fall-off.'}
                </p>
              </div>
            </div>

            {result.visualObservations && result.visualObservations.length > 0 && (
              <div className="space-y-2">
                {result.visualObservations.map((obs, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] px-4 py-2.5 text-sm text-[var(--text-secondary)] flex items-baseline gap-2.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan-accent)] shrink-0 translate-y-[-1px]" />
                    <span>{obs}</span>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* TAB 3: Anomalies & Authentic Signals */}
          <TabsContent value="signals" className="space-y-3">
            {allSignals.length === 0 ? (
              <div className="rounded-2xl bg-[var(--sub-block-bg)] p-6 text-center text-sm text-[var(--text-muted)]">
                No distinct anomaly or authenticity markers were logged for this specimen.
              </div>
            ) : (
              allSignals.map((sig, idx) => {
                const isAnomaly = sig.type === 'ANOMALY' || sig.type === 'DEFINITIVE_ANOMALY';
                const isAuthentic = sig.type === 'AUTHENTIC';
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 font-semibold text-sm text-[var(--text-primary)]">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{
                            background: isAnomaly
                              ? 'var(--error)'
                              : isAuthentic
                                ? 'var(--success)'
                                : 'var(--warning)'
                          }}
                        />
                        <span>{sig.name || sig.title}</span>
                      </div>
                      <span
                        className={`mono-badge text-[10px] py-0.5 px-2.5 ${isAnomaly
                          ? 'mono-badge-ai'
                          : isAuthentic
                            ? 'mono-badge-real'
                            : 'mono-badge-warn'
                          }`}
                      >
                        {isAnomaly ? 'ANOMALY MARKER' : isAuthentic ? 'AUTHENTIC SIGNAL' : 'NEUTRAL NOTE'}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] pl-4 leading-relaxed">
                      {sig.detail || sig.description}
                    </p>
                  </div>
                );
              })
            )}
          </TabsContent>

          {/* TAB 4: Provenance, SHA-256 Digest & Limitations */}
          <TabsContent value="provenance" className="space-y-4">
            <div className="rounded-2xl bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">
                  CRYPTOGRAPHIC FILE PROVENANCE
                </span>
                {result.metadata?.sha256Hash && (
                  <button
                    type="button"
                    onClick={handleCopySha}
                    className="btn-secondary text-xs py-1.5 px-3"
                  >
                    {copiedHash ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[var(--success)]" />
                        <span>SHA-256 Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy SHA-256</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="font-mono text-[10px] text-[var(--text-muted)]">FILE NAME</div>
                  <div className="font-mono text-[var(--text-primary)] truncate mt-0.5">
                    {result.metadata?.fileName}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-[var(--text-muted)]">DIMENSIONS &amp; SIZE</div>
                  <div className="font-mono text-[var(--text-primary)] tabular-nums mt-0.5">
                    {result.metadata?.dimensions} · {result.metadata?.fileSize}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-[var(--text-muted)]">MIME TYPE</div>
                  <div className="font-mono text-[var(--text-primary)] mt-0.5">
                    {result.metadata?.mimeType}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border-hairline)]">
                <div className="font-mono text-[10px] text-[var(--text-muted)] mb-1">SHA-256 DIGEST</div>
                <code className="block font-mono text-xs text-[var(--blue-light)] break-all">
                  {result.metadata?.sha256Hash || 'N/A'}
                </code>
              </div>
            </div>

            {result.limitations && result.limitations.length > 0 && (
              <div
                className="rounded-2xl bg-[var(--warning-bg)] border border-amber-500/30 p-4 sm:p-5"
                style={{ borderLeft: '4px solid var(--warning)' }}
              >
                <div className="flex items-center gap-2 font-semibold text-sm text-[var(--warning)] mb-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>LIMITATIONS OF THIS ANALYSIS</span>
                </div>
                <ul className="list-disc pl-5 space-y-1.5 text-sm text-[var(--text-secondary)]">
                  {result.limitations.map((lim, idx) => (
                    <li key={idx}>{lim}</li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* 4. Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onReset} className="btn-secondary px-6 py-3">
          <RefreshCw className="w-4 h-4 text-[var(--blue-light)]" />
          <span>Inspect Another Image</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => downloadJsonData(result)}
            className="btn-secondary px-5 py-3"
          >
            <FileText className="w-4 h-4 text-[var(--blue-light)]" />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="btn-primary px-7 py-3"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Compiling PDF...' : 'Download Forensic PDF'}</span>
          </button>
        </div>
      </div>

      {/* 5. Scientific Reliability & Zero-Retention Guarantees */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel p-5 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[var(--badge-blue-bg)] flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 text-[var(--badge-blue-text)]" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-[var(--text-primary)] mb-1">
              Probabilistic Reliability Notice
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              No automated AI detector is 100% accurate. Heavy re-compression, editing, or novel architectures can shift spectral and noise baselines.
            </p>
          </div>
        </div>

        <div className="glass-panel p-5 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[var(--badge-blue-bg)] flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5 text-[var(--badge-blue-text)]" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-[var(--text-primary)] mb-1">
              Zero Disk Retention Policy
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Images decode strictly in RAM buffers for frequency and residual extraction and are immediately discarded without permanent storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
