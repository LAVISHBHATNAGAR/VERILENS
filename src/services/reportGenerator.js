// PDF and JSON Forensic Report Generator for VERILENS
import { jsPDF } from 'jspdf';

/**
 * Generate and download a PDF forensic report
 */
export function downloadPdfReport(analysisResult, imagePreviewUrl) {
  if (!analysisResult) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageW = 210;
  const pageH = 297;
  const margin = 18;
  const contentW = pageW - margin * 2;

  // Header Banner - Professional Deep Navy / Blue
  doc.setFillColor(30, 64, 175); // #1E40AF
  doc.rect(0, 0, pageW, 44, 'F');

  // Blue accent bar
  doc.setFillColor(37, 99, 235); // #2563EB
  doc.rect(0, 42, pageW, 2, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('VERILENS', margin, 18);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(191, 219, 254);
  doc.text('DIGITAL TRUTH & SAFETY ASSISTANT • FORENSIC INTEGRITY AUDIT', margin, 24);

  // Top Right Info
  doc.setFontSize(8);
  doc.setTextColor(226, 232, 240);
  doc.text(`REPORT ID: ${analysisResult.id || 'VRL-SEC-01'}`, pageW - margin, 18, { align: 'right' });
  doc.text(`ISSUED: ${new Date(analysisResult.timestamp).toLocaleString()}`, pageW - margin, 24, { align: 'right' });
  doc.text(`ENGINE: ${analysisResult.isRealEngine ? 'Multi-Signal Engine' : 'Client Signal Engine'}`, pageW - margin, 30, { align: 'right' });

  let y = 54;

  // Section 1: Target Media Summary
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentW, 28, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentW, 28, 2, 2, 'D');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(23, 43, 77);
  doc.text('FILE PROVENANCE & IDENTIFICATION', margin + 6, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`File Name: ${analysisResult.metadata.fileName}`, margin + 6, y + 15);
  doc.text(`Dimensions: ${analysisResult.metadata.dimensions}  |  File Size: ${analysisResult.metadata.fileSize}`, margin + 6, y + 21);
  const hashDigest = (analysisResult.metadata.sha256Hash || 'N/A').substring(0, 44);
  doc.text(`SHA-256 Digest: ${hashDigest}...`, margin + 6, y + 26);

  y += 34;

  // Section 2: Executive Verdict Banner
  const isAi = analysisResult.verdictLevel === 'ai';
  const isReal = analysisResult.verdictLevel === 'real';

  if (isAi) {
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(254, 202, 202);
    doc.setTextColor(220, 38, 38);
  } else if (isReal) {
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(187, 247, 208);
    doc.setTextColor(22, 163, 74);
  } else {
    doc.setFillColor(255, 251, 235);
    doc.setDrawColor(253, 230, 138);
    doc.setTextColor(217, 119, 6);
  }

  doc.roundedRect(margin, y, contentW, 26, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(`VERDICT: ${analysisResult.verdict.toUpperCase()}`, margin + 8, y + 10);

  doc.setFontSize(9.5);
  doc.text(
    `AI Likelihood: ${analysisResult.aiScore}%   |   Authentic Likelihood: ${analysisResult.realScore}%   |   Confidence: ${analysisResult.confidence || 'N/A'}% (${analysisResult.confidenceLevel || 'Calibrated'})`,
    margin + 8,
    y + 18
  );

  y += 32;

  // Section 3: Summary Explanation
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(23, 43, 77);
  doc.text('FORENSIC SUMMARY & ASSESSMENT', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);

  const summaryText = analysisResult.summary || analysisResult.explanation || 'Assessment completed.';
  const splitExplanation = doc.splitTextToSize(summaryText, contentW);
  doc.text(splitExplanation, margin, y);
  y += splitExplanation.length * 4.5 + 6;

  // Section 4: Forensic Pillar Evaluation
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(23, 43, 77);
  doc.text('FORENSIC PILLAR BREAKDOWN', margin, y);
  y += 6;

  // Table header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentW, 7, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('INSPECTION DOMAIN', margin + 4, y + 5);
  doc.text('SCORE', margin + 80, y + 5);
  doc.text('EVALUATION STATUS', margin + 115, y + 5);
  y += 7;

  if (analysisResult.pillars) {
    analysisResult.pillars.forEach((p) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text(p.name, margin + 4, y + 5);
      doc.text(`${p.score}%`, margin + 80, y + 5);

      if (p.color === 'red') doc.setTextColor(220, 38, 38);
      else if (p.color === 'emerald') doc.setTextColor(22, 163, 74);
      else doc.setTextColor(217, 119, 6);

      doc.text(p.status, margin + 115, y + 5);

      doc.setDrawColor(241, 245, 249);
      doc.line(margin, y + 7, margin + contentW, y + 7);
      y += 8;
    });
  }
  y += 6;

  // Section 5: Detected Irregularities & Indicators
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(23, 43, 77);
  doc.text('DETECTED INDICATORS & ANOMALY SIGNALS', margin, y);
  y += 6;

  if (analysisResult.anomalies && analysisResult.anomalies.length > 0) {
    analysisResult.anomalies.forEach((ano) => {
      if (y > pageH - 45) {
        doc.addPage();
        y = 20;
      }

      const title = ano.name || ano.title || 'Signal Detected';
      const desc = ano.detail || ano.description || '';
      const type = ano.type || (ano.severity ? `${ano.severity} PRIORITY` : 'INDICATOR');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(23, 43, 77);
      doc.text(`[${type}] ${title}`, margin, y);
      y += 4.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      const splitDesc = doc.splitTextToSize(desc, contentW - 4);
      doc.text(splitDesc, margin + 2, y);
      y += splitDesc.length * 4 + 4;
    });
  }

  // Footer Disclaimer
  y = pageH - 24;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, margin + contentW, y);
  y += 4;

  doc.setFontSize(6.8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(148, 163, 184);
  const disclaimerText = doc.splitTextToSize(
    'LEGAL NOTICE: ' + (analysisResult.reliabilityNotice || analysisResult.disclaimer || 'No AI detector is 100% accurate.') + ' Verify critical media using C2PA provenance and journalistic sources.',
    contentW
  );
  doc.text(disclaimerText, margin, y);

  const cleanId = (analysisResult.id || 'Report').replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`VERILENS_Forensic_Report_${cleanId}.pdf`);
}

/**
 * Export raw JSON data
 */
export function downloadJsonData(analysisResult) {
  if (!analysisResult) return;
  const jsonStr = JSON.stringify(analysisResult, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `VERILENS_Data_${analysisResult.id || 'export'}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
