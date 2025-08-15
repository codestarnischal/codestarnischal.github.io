"use client";
import { useEffect, useRef, useState } from 'react';

export default function SignaturePad({ onChange }: { onChange?: (dataUrl: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [dataUrl, setDataUrl] = useState<string | undefined>();

  useEffect(() => {
    const canvas = canvasRef.current!;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(rect.width * ratio);
      canvas.height = Math.floor(180 * ratio);
      const ctx = canvas.getContext('2d')!;
      ctx.scale(ratio, ratio);
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, rect.width, 180);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      if (dataUrl) {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0, rect.width, 180);
        img.src = dataUrl;
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [dataUrl]);

  const getPos = (e: PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const handleDown = (e: PointerEvent) => {
      setDrawing(true);
      const p = getPos(e);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
    };
    const handleMove = (e: PointerEvent) => {
      if (!drawing) return;
      const p = getPos(e);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    };
    const handleUp = () => {
      setDrawing(false);
      const url = canvas.toDataURL('image/png');
      setDataUrl(url);
      onChange?.(url);
    };
    canvas.addEventListener('pointerdown', handleDown);
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      canvas.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [drawing, onChange]);

  return <canvas ref={canvasRef} className="w-full h-44 rounded-xl border border-slate-200 bg-white" />;
}