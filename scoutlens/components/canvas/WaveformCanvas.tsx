"use client";
import { useEffect, useRef } from 'react';

export default function WaveformCanvas({ analyser }: { analyser?: AnalyserNode | null }) {
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
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;

      if (analyser) {
        const len = analyser.fftSize;
        if (!bufferRef.current || bufferRef.current.length !== len) {
          bufferRef.current = new Float32Array(len);
        }
        const buf = bufferRef.current as Float32Array;
        analyser.getFloatTimeDomainData(buf as unknown as Float32Array<ArrayBuffer>);
        ctx.beginPath();
        for (let i = 0; i < width; i++) {
          const idx = Math.min(len - 1, Math.floor((i / width) * len));
          const sample = buf[idx] ?? 0;
          const v = (sample + 1) / 2;
          const y = v * height;
          if (i === 0) ctx.moveTo(i, y);
          else ctx.lineTo(i, y);
        }
        ctx.stroke();
      }
      rafRef.current = requestAnimationFrame(handle);
    };
    rafRef.current = requestAnimationFrame(handle);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [analyser]);

  return <canvas className="w-full h-24 rounded-xl border border-slate-200" ref={canvasRef} aria-label="Waveform" role="img" />;
}