import { describe, it, expect } from 'vitest';
import { clamp, evaluateFindings, computeSeverity } from '@/lib/audio/heuristics';

describe('heuristics', () => {
  it('clamp works', () => {
    expect(clamp(5, 0, 3)).toBe(3);
    expect(clamp(-1, 0, 1)).toBe(0);
    expect(clamp(0.5, 0, 1)).toBe(0.5);
  });

  it('findings and severity compute', () => {
    const features = { rms: 0.15, centroidHz: 3000, hfRatio: 0.5, zcr: 0.08, peakHz: 45 };
    const findings = evaluateFindings(features, 'fan');
    expect(findings.length).toBeGreaterThan(0);
    const severity = computeSeverity(findings);
    expect(severity).toBeGreaterThan(0);
  });
});