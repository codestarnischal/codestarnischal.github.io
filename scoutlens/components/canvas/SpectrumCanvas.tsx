"use client";
import { useEffect, useRef } from 'react';

export default function SpectrumCanvas({ analyser }: { analyser?: AnalyserNode | null }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const bufferRef = useRef<Float32Array | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const ratio = window.devicePixelRatio || 1;

    const handle = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.scale(ratio, ratio);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      if (analyser) {
        const bins = analyser.frequencyBinCount;
        if (!bufferRef.current || bufferRef.current.length !== bins) {
          bufferRef.current = new Float32Array(bins);
        }
        const buf = bufferRef.current as Float32Array;
        analyser.getFloatFrequencyData(buf as unknown as Float32Array<ArrayBuffer>);
        const barWidth = Math.max(1, Math.floor(width / 96));
        for (let x = 0; x < width; x += barWidth) {
          const idx = Math.min(bins - 1, Math.floor((x / width) * bins));
          const db = buf[idx] ?? -140;
          const magnitude = Math.max(0, (db + 140) / 140);
          const barHeight = magnitude * height;
          const y = height - barHeight;
          ctx.fillStyle = '#2563eb';
          ctx.fillRect(x, y, barWidth - 1, barHeight);
        }
      }
      rafRef.current = requestAnimationFrame(handle);
    };
    rafRef.current = requestAnimationFrame(handle);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [analyser]);

  return <canvas className="w-full h-24 rounded-xl border border-slate-200" ref={canvasRef} aria-label="Spectrum" role="img" />;
}