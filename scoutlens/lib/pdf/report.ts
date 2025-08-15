import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { Report } from '@/lib/types';

export async function generateReportPdf(report: Report): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]); // Letter
  const { width, height } = page.getSize();

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const titleFontSize = 18;
  const textFontSize = 11;
  const left = 48;
  let y = height - 48;

  page.drawText('ScoutLens Inspection Report', { x: left, y, size: titleFontSize, font });
  y -= 22;
  page.drawText(new Date(report.createdAt).toLocaleString(), { x: left, y, size: textFontSize, font, color: rgb(0.2, 0.2, 0.2) });
  y -= 18;

  // Meta block
  const meta = [
    `Technician: ${report.techName}`,
    `Company: ${report.company}`,
    `Asset: ${report.assetType}${report.assetId ? ' #' + report.assetId : ''}`,
    `GPS: ${report.gps ? `${report.gps.lat.toFixed(6)}, ${report.gps.lon.toFixed(6)}` : 'N/A'}`,
    `Severity: ${report.severity}`,
  ];
  meta.forEach((line) => { page.drawText(line, { x: left, y, size: textFontSize, font }); y -= 16; });
  y -= 8;

  // Findings
  page.drawText('Findings:', { x: left, y, size: textFontSize, font });
  y -= 16;
  report.findings.forEach((f) => {
    page.drawText(`• ${f.label} — ${(f.confidence * 100).toFixed(0)}%`, { x: left + 12, y, size: textFontSize, font });
    y -= 14;
  });
  if (report.findings.length === 0) { page.drawText('• None', { x: left + 12, y, size: textFontSize, font }); y -= 14; }
  y -= 8;

  // Features line
  const feat = report.features;
  const featLine = `Features: RMS ${feat.rms.toFixed(3)}  Centroid ${feat.centroidHz.toFixed(0)} Hz  HF ${feat.hfRatio.toFixed(2)}  ZCR ${feat.zcr.toFixed(3)}  Peak ${feat.peakHz.toFixed(0)} Hz`;
  page.drawText(featLine, { x: left, y, size: textFontSize, font, color: rgb(0.2,0.2,0.2) });
  y -= 18;

  // Images
  if (report.images.snapshot) {
    try {
      const png = await pdf.embedPng(report.images.snapshot);
      const imgWidth = 240; const imgHeight = (png.height / png.width) * imgWidth;
      page.drawImage(png, { x: left, y: y - imgHeight, width: imgWidth, height: imgHeight });
    } catch {}
  }
  if (report.images.spectrum) {
    try {
      const png = await pdf.embedPng(report.images.spectrum);
      const imgWidth = 240; const imgHeight = (png.height / png.width) * imgWidth;
      page.drawImage(png, { x: left + 260, y: y - imgHeight, width: imgWidth, height: imgHeight });
    } catch {}
  }
  y -= 180;

  // Notes
  page.drawText('Notes:', { x: left, y, size: textFontSize, font });
  y -= 14;
  wrapText(report.notes || '—', 80).forEach((line) => { page.drawText(line, { x: left + 12, y, size: textFontSize, font }); y -= 14; });
  y -= 10;

  // Signature
  if (report.signature) {
    try {
      const png = await pdf.embedPng(report.signature);
      const w = 240; const h = (png.height / png.width) * w;
      page.drawText('Signature:', { x: left, y, size: textFontSize, font });
      page.drawImage(png, { x: left + 90, y: y - h + 8, width: w, height: h });
      y -= h + 8;
    } catch {}
  }

  // Hash footer
  page.drawText(`SHA-256: ${report.sha256}`, { x: left, y: 48, size: 9, font, color: rgb(0.4,0.4,0.4) });
  page.drawText('Heuristics-based MVP — verify before critical decisions.', { x: left, y: 34, size: 9, font, color: rgb(0.5,0.5,0.5) });

  return pdf.save();
}

function wrapText(text: string, max: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > max) { lines.push(line.trim()); line = w; }
    else line += ' ' + w;
  }
  if (line) lines.push(line.trim());
  return lines;
}