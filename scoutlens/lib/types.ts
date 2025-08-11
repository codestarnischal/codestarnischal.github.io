export type AudioFeatures = {
  rms: number;
  centroidHz: number;
  hfRatio: number;
  zcr: number;
  peakHz: number;
};

export type Finding = { label: string; confidence: number };
export type Gps = { lat: number; lon: number } | null;

export type Report = {
  id: string;
  createdAt: string;
  techName: string;
  company: string;
  assetType: 'fan' | 'compressor' | 'pump' | 'hvac';
  assetId?: string;
  notes?: string;
  gps: Gps;
  features: AudioFeatures;
  findings: Finding[];
  severity: number;
  images: { snapshot?: string; spectrum?: string };
  signature?: string;
  sha256: string;
};