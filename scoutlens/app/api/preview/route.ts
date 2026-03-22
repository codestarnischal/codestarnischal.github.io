import { NextResponse } from 'next/server';
import { runPreviewAnalysis } from '@/lib/preview/engine';
import type { AnalysisRequest } from '@/lib/preview/types';

function isRegion(value: unknown): value is AnalysisRequest['region'] {
  return value === 'EU' || value === 'US' || value === 'Global';
}

function isUrgency(value: unknown): value is AnalysisRequest['urgency'] {
  return value === 'Normal' || value === 'Priority' || value === 'Critical';
}

function validatePayload(payload: unknown): AnalysisRequest {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Request body must be an object.');
  }

  const candidate = payload as Record<string, unknown>;

  if (typeof candidate['company'] !== 'string' || candidate['company'].trim().length < 2) {
    throw new Error('Company name must be at least 2 characters.');
  }

  if (typeof candidate['question'] !== 'string' || candidate['question'].trim().length < 12) {
    throw new Error('Question must be at least 12 characters.');
  }

  if (!isRegion(candidate['region'])) {
    throw new Error('Region must be EU, US, or Global.');
  }

  if (!isUrgency(candidate['urgency'])) {
    throw new Error('Urgency must be Normal, Priority, or Critical.');
  }

  return {
    company: candidate['company'],
    question: candidate['question'],
    region: candidate['region'],
    urgency: candidate['urgency'],
  };
}

export async function POST(request: Request) {
  try {
    const payload = validatePayload(await request.json());
    const analysis = await runPreviewAnalysis(payload);

    return NextResponse.json(analysis, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unexpected error while building preview.',
      },
      { status: 400 }
    );
  }
}
