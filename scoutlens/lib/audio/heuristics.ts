import type { AudioFeatures } from './features';

export type AssetType = 'fan' | 'compressor' | 'pump' | 'hvac';
export type Finding = { label: string; confidence: number };

export function evaluateFindings(features: AudioFeatures, assetType: AssetType): Finding[] {
  const f: Finding[] = [];
  const { rms, centroidHz, hfRatio, zcr, peakHz } = features;

  // Bearing wear
  if (hfRatio > 0.45 && centroidHz > 2500 && rms > 0.08) {
    const conf = clamp(hfRatio * (centroidHz / 6000) * (rms / 0.3), 0.1, 0.99);
    f.push({ label: 'Bearing wear (likely)', confidence: conf });
  }

  // Belt slip / misalignment
  if (peakHz > 20 && peakHz < 180 && zcr > 0.072 && rms > 0.06) {
    const conf = clamp((0.6 * rms + 0.4 * zcr) * (1 - Math.abs(100 - peakHz) / 100), 0.1, 0.95);
    f.push({ label: 'Belt slip / misalignment', confidence: conf });
  }

  // Cavitation / turbulence (pump only)
  if (assetType === 'pump' && hfRatio > 0.28 && centroidHz > 1200 && centroidHz < 4000 && rms > 0.10) {
    const conf = clamp((hfRatio * 0.5 + (centroidHz - 1200) / 2800 * 0.3 + rms * 0.2), 0.15, 0.95);
    f.push({ label: 'Cavitation / turbulence', confidence: conf });
  }

  // Loose panel / structure
  if (peakHz < 60 && rms > 0.12) {
    const conf = clamp((0.7 * rms + 0.3 * (60 - peakHz) / 60), 0.1, 0.9);
    f.push({ label: 'Loose panel / vibration', confidence: conf });
  }

  return f;
}

export function computeSeverity(findings: Finding[]): number {
  // weights [35,25,30,20] across findings in consistent order as above
  const weights = [35, 25, 30, 20];
  let score = 0;
  for (let i = 0; i < Math.min(findings.length, weights.length); i++) {
    const item = findings[i]!;
    const w = weights[i]!;
    score += (item.confidence ?? 0) * (w ?? 0);
  }
  return clamp(Math.round(score), 0, 100);
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}