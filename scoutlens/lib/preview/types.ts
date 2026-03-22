export type AnalysisRequest = {
  company: string;
  question: string;
  region: 'EU' | 'US' | 'Global';
  urgency: 'Normal' | 'Priority' | 'Critical';
};

export type EngineStep = {
  id: string;
  label: string;
  detail: string;
  status: 'completed' | 'active' | 'queued';
};

export type EngineSummary = {
  headline: string;
  bullets: string[];
  confidence: number;
};

export type SignalCard = {
  title: string;
  value: string;
  tone: 'positive' | 'neutral' | 'warning';
};

export type AnalysisResponse = {
  request: AnalysisRequest;
  steps: EngineStep[];
  auditor: EngineSummary;
  researcher: EngineSummary;
  synthesis: {
    recommendation: string;
    deploymentNotes: string[];
  };
  signals: SignalCard[];
  latencyMs: number;
  deployment: {
    frontend: string;
    backend: string;
    infra: string[];
  };
};
