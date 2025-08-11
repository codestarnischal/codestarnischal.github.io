export type AudioFeatures = {
  rms: number;
  centroidHz: number;
  hfRatio: number;
  zcr: number;
  peakHz: number;
};

export function computeFeatures(
  analyser: AnalyserNode,
  sampleRate: number
): AudioFeatures {
  const timeSize = analyser.fftSize;
  const freqSize = analyser.frequencyBinCount;
  const timeData = new Float32Array(timeSize);
  const freqData = new Float32Array(freqSize);

  analyser.getFloatTimeDomainData(timeData);
  analyser.getFloatFrequencyData(freqData);

  // RMS
  let sumSquares = 0;
  let zeroCrossings = 0;
  for (let i = 0; i < timeData.length; i++) {
    const v = timeData[i] ?? 0;
    sumSquares += v * v;
    if (i > 0) {
      const prev = timeData[i - 1] ?? 0;
      if ((prev >= 0 && v < 0) || (prev < 0 && v >= 0)) zeroCrossings++;
    }
  }
  const rms = Math.sqrt(sumSquares / Math.max(1, timeData.length));
  const zcr = zeroCrossings / Math.max(1, timeData.length);

  // Magnitude from dB values
  const mag = new Float32Array(freqData.length);
  let magSum = 0;
  for (let i = 0; i < freqData.length; i++) {
    const db = freqData[i] ?? -140;
    const m = Math.pow(10, db / 20);
    mag[i] = m;
    magSum += m;
  }
  const binHz = sampleRate / (2 * freqSize);

  // Spectral centroid
  let weightedSum = 0;
  for (let i = 0; i < mag.length; i++) {
    weightedSum += i * binHz * (mag[i] ?? 0);
  }
  const centroidHz = magSum > 0 ? weightedSum / magSum : 0;

  // Peak frequency
  let peakIdx = 0;
  for (let i = 1; i < mag.length; i++) {
    if ((mag[i] ?? 0) > (mag[peakIdx] ?? 0)) peakIdx = i;
  }
  const peakHz = peakIdx * binHz;

  // High-frequency ratio (>6kHz)
  const cutoffIdx = Math.floor(6000 / binHz);
  let hf = 0;
  for (let i = cutoffIdx; i < mag.length; i++) hf += mag[i] ?? 0;
  const hfRatio = magSum > 0 ? hf / magSum : 0;

  return { rms, centroidHz, hfRatio, zcr, peakHz };
}