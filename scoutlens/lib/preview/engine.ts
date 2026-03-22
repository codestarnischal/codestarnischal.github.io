import type { AnalysisRequest, AnalysisResponse, EngineStep, SignalCard } from '@/lib/preview/types';

const REGION_PRESSURE: Record<AnalysisRequest['region'], number> = {
  EU: 78,
  US: 62,
  Global: 85,
};

const URGENCY_MULTIPLIER: Record<AnalysisRequest['urgency'], number> = {
  Normal: 1,
  Priority: 1.15,
  Critical: 1.3,
};

function normalizeQuestion(question: string): string {
  return question.trim().replace(/\s+/g, ' ');
}

function buildSteps(request: AnalysisRequest): EngineStep[] {
  return [
    {
      id: 'intake',
      label: 'Gateway intake',
      detail: `Validated ${request.company} request and shaped a single workflow payload.`,
      status: 'completed',
    },
    {
      id: 'auditor',
      label: 'Auditor pass',
      detail: `Scored ${request.region} policy exposure for ${request.company}.`,
      status: 'completed',
    },
    {
      id: 'researcher',
      label: 'Research pass',
      detail: `Mapped supply chain and market impact tied to ${request.question}.`,
      status: 'completed',
    },
    {
      id: 'synthesis',
      label: 'Synthesis',
      detail: 'Returned a deployable response contract for the frontend.',
      status: 'active',
    },
  ];
}

function computeRiskScore(request: AnalysisRequest): number {
  const base = REGION_PRESSURE[request.region] * URGENCY_MULTIPLIER[request.urgency];
  const keywordBoost = /(supply chain|regulation|compliance|tariff|export|sanction)/i.test(request.question)
    ? 8
    : 0;

  return Math.min(99, Math.round(base + keywordBoost));
}

function buildSignals(request: AnalysisRequest, riskScore: number): SignalCard[] {
  const operationsTone: SignalCard['tone'] = riskScore > 80 ? 'warning' : 'neutral';
  const fundingTone: SignalCard['tone'] = request.urgency === 'Critical' ? 'warning' : 'positive';

  return [
    {
      title: 'Regulatory pressure',
      value: `${riskScore}/100`,
      tone: riskScore > 80 ? 'warning' : 'neutral',
    },
    {
      title: 'Execution mode',
      value: request.urgency,
      tone: fundingTone,
    },
    {
      title: 'Operational focus',
      value: request.region,
      tone: operationsTone,
    },
  ];
}

export async function runPreviewAnalysis(rawRequest: AnalysisRequest): Promise<AnalysisResponse> {
  const startedAt = performance.now();
  const request: AnalysisRequest = {
    ...rawRequest,
    company: rawRequest.company.trim(),
    question: normalizeQuestion(rawRequest.question),
  };

  const riskScore = computeRiskScore(request);
  const steps = buildSteps(request);
  const signals = buildSignals(request, riskScore);

  return {
    request,
    steps,
    auditor: {
      headline: `${request.region} compliance watchlist elevated for ${request.company}.`,
      bullets: [
        `Primary exposure clusters around ${request.region.toLowerCase()}-linked sourcing and disclosure obligations.`,
        'A single backend flow keeps intake, analysis, and response signing in one deployable surface.',
        'Escalation threshold should trigger human review whenever the risk score stays above 80.',
      ],
      confidence: Math.min(97, riskScore),
    },
    researcher: {
      headline: `Market impact centers on supplier resilience and pricing flexibility for ${request.company}.`,
      bullets: [
        `The fastest MVP is one orchestrator that pairs policy summaries with entity-level supply chain notes.`,
        `Use the question, "${request.question}", as the retrieval key for filings, regulations, and vendor data.`,
        'Expose the result as one JSON contract so the UI can stream or poll without a second integration layer.',
      ],
      confidence: Math.max(68, Math.round(riskScore * 0.88)),
    },
    synthesis: {
      recommendation:
        'Ship a single Next.js deployment: App Router frontend, typed API route backend, and one preview workflow that can later hand off to LangGraph or Ray without changing the UI contract.',
      deploymentNotes: [
        'Frontend submits one typed request and renders analyst cards, signal chips, and launch guidance.',
        'Backend can run locally for preview and swap to a remote inference service through environment variables.',
        'This keeps preview latency low while remaining production-shaped for Vercel, Docker, or a Node host.',
      ],
    },
    signals,
    latencyMs: Math.round(performance.now() - startedAt + 180),
    deployment: {
      frontend: 'Next.js App Router page with an interactive mission console and deploy checklist.',
      backend: 'Next.js route handler that validates input, runs the preview engine, and returns a stable JSON schema.',
      infra: ['Vercel or Node host', 'Environment-variable based backend handoff', 'Single repo for frontend and backend preview'],
    },
  };
}
