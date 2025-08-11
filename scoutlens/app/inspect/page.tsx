"use client";
import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import SpectrumCanvas from '@/components/canvas/SpectrumCanvas';
import WaveformCanvas from '@/components/canvas/WaveformCanvas';
import SignaturePad from '@/components/SignaturePad';
import type { AudioFeatures, Report } from '@/lib/types';
import { computeFeatures as compute } from '@/lib/audio/features';
import { evaluateFindings, computeSeverity } from '@/lib/audio/heuristics';
import { putReport } from '@/lib/storage/db';
import { useSettings } from '@/lib/store/settings';
import { sha256Hex } from '@/lib/utils/crypto';
import { nanoid } from 'nanoid';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function InspectPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const spectrumRef = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [features, setFeatures] = useState<AudioFeatures>({ rms: 0, centroidHz: 0, hfRatio: 0, zcr: 0, peakHz: 0 });
  const [assetType, setAssetType] = useState<'fan' | 'compressor' | 'pump' | 'hvac'>('fan');
  const [assetId, setAssetId] = useState('');
  const [notes, setNotes] = useState('');
  const [signature, setSignature] = useState<string | undefined>();
  const [gps, setGps] = useState<{ lat: number; lon: number } | null>(null);
  const [snapshot, setSnapshot] = useState<string | undefined>();
  const [spectrumImage, setSpectrumImage] = useState<string | undefined>();
  const { techName, company, webhookUrl, autoSend } = useSettings();

  const findings = useMemo(() => evaluateFindings(features, assetType), [features, assetType]);
  const severity = useMemo(() => computeSeverity(findings), [findings]);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: true });
        if (!mounted) return;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const src = audioCtx.createMediaStreamSource(stream);
        const an = audioCtx.createAnalyser();
        an.fftSize = 2048; an.smoothingTimeConstant = 0.85;
        src.connect(an);
        setCtx(audioCtx);
        setAnalyser(an);
      } catch (e) {
        console.error('Media init failed', e);
      }
    };
    init();
    navigator.geolocation?.getCurrentPosition((p) => setGps({ lat: p.coords.latitude, lon: p.coords.longitude }), () => {}, { enableHighAccuracy: true, maximumAge: 10000 });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!analyser || !ctx) return;
    let raf: number;
    const tick = () => {
      const f = compute(analyser, ctx.sampleRate);
      setFeatures(f);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [analyser, ctx]);

  const takeSnapshot = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    const w = video.videoWidth; const h = video.videoHeight;
    const targetW = 640; const targetH = Math.floor((h / w) * targetW);
    canvas.width = targetW; canvas.height = targetH;
    const c = canvas.getContext('2d')!;
    c.drawImage(video, 0, 0, targetW, targetH);
    setSnapshot(canvas.toDataURL('image/png'));
  };

  const captureSpectrumImage = () => {
    const canvas = document.querySelector('[aria-label="Spectrum"]') as HTMLCanvasElement | null;
    if (!canvas) return;
    setSpectrumImage(canvas.toDataURL('image/png'));
  };

  const saveInspection = async (alsoPdf = false) => {
    const payload: Omit<Report, 'id' | 'sha256'> = {
      createdAt: new Date().toISOString(),
      techName, company,
      assetType, assetId: assetId || undefined,
      notes: notes || undefined,
      gps,
      features,
      findings,
      severity,
      images: { snapshot, spectrum: spectrumImage },
      signature,
    };
    const json = JSON.stringify(payload);
    const sha = await sha256Hex(json);
    const report: Report = { id: nanoid(), sha256: sha, ...payload };
    await putReport(report);
    if (autoSend && webhookUrl) {
      fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(report) }).catch(() => {});
    }
    if (alsoPdf) {
      const { generateReportPdf } = await import('@/lib/pdf/report');
      const bytes = await generateReportPdf(report);
      const blob = new Blob([new Uint8Array(bytes).buffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `ScoutLens-${report.id}.pdf`; a.click();
      URL.revokeObjectURL(url);
    }
    // confetti
    if (!localStorage.getItem('sl_first_save')) {
      localStorage.setItem('sl_first_save', '1');
      import('canvas-confetti').then((m: any) => m.default());
    }
    alert('Inspection saved');
  };

  const severityVariant = severity >= 70 ? 'destructive' : severity >= 40 ? 'warning' : 'success';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="h2">Live Preview</div>
              <div className="flex items-center gap-2">
                <Badge variant={severityVariant as any}>Severity {severity}</Badge>
                <div className="w-40"><Progress value={severity} /></div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="aspect-video w-full overflow-hidden rounded-xl border bg-black">
              <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
            </div>
            <WaveformCanvas analyser={analyser} />
            <SpectrumCanvas analyser={analyser} />
            <div className="flex gap-3">
              <Button className="flex-1" onClick={takeSnapshot}>Snapshot</Button>
              <Button variant="outline" className="flex-1" onClick={captureSpectrumImage}>Capture Spectrum</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between"><div className="h2">Features</div></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <Feature label="RMS" value={features.rms.toFixed(3)} />
              <Feature label="Centroid" value={`${features.centroidHz.toFixed(0)} Hz`} />
              <Feature label=">6kHz Ratio" value={features.hfRatio.toFixed(2)} />
              <Feature label="ZCR" value={features.zcr.toFixed(3)} />
              <Feature label="Peak" value={`${features.peakHz.toFixed(0)} Hz`} />
            </div>
            <div className="mt-4">
              <div className="font-medium mb-2">Findings</div>
              <ul className="list-disc list-inside text-sm text-slate-700">
                {findings.length === 0 && <li>None detected</li>}
                {findings.map((f, i) => (
                  <li key={i}>{f.label} — {(f.confidence * 100).toFixed(0)}%</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-5 space-y-4">
        <Card>
          <CardHeader><div className="h2">Inspection Details</div></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs subtle mb-1">Technician</div>
                <Input defaultValue={techName} placeholder="Your name" onChange={(e) => localStorage.setItem('techName', e.target.value)} />
              </div>
              <div>
                <div className="text-xs subtle mb-1">Company</div>
                <Input defaultValue={company} placeholder="Company" onChange={(e) => localStorage.setItem('company', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs subtle mb-1">Asset Type</div>
                <Select value={assetType} onChange={(e) => setAssetType(e.target.value as any)}>
                  <option value="fan">Fan/Blower</option>
                  <option value="compressor">Compressor</option>
                  <option value="pump">Pump</option>
                  <option value="hvac">HVAC Condenser</option>
                </Select>
              </div>
              <div>
                <div className="text-xs subtle mb-1">Asset ID</div>
                <Input value={assetId} onChange={(e) => setAssetId(e.target.value)} placeholder="e.g. Unit-7A" />
              </div>
            </div>
            <div>
              <div className="text-xs subtle mb-1">Notes</div>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Observations..." />
            </div>
            <div>
              <div className="text-xs subtle mb-1">Signature</div>
              <SignaturePad onChange={setSignature} />
            </div>
            <div className="text-xs subtle">GPS: {gps ? `${gps.lat.toFixed(6)}, ${gps.lon.toFixed(6)}` : 'Unknown'}</div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button onClick={() => saveInspection(false)}>Save Inspection</Button>
              <Button variant="outline" onClick={() => saveInspection(true)}>Generate PDF</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Feature({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border p-3">
      <div className="text-xs subtle">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}