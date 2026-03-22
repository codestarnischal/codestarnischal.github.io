"use client";

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { AnalysisRequest, AnalysisResponse } from '@/lib/preview/types';

const INITIAL_FORM: AnalysisRequest = {
  company: 'Apple',
  question: 'Assess supply chain risk for AAPL based on recent EU regulations and pricing pressure.',
  region: 'EU',
  urgency: 'Priority',
};

export default function PreviewConsole() {
  const [form, setForm] = useState<AnalysisRequest>(INITIAL_FORM);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return form.company.trim().length >= 2 && form.question.trim().length >= 12;
  }, [form.company, form.question]);

  const submit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const failure = (await response.json()) as { error?: string };
        throw new Error(failure.error ?? 'Preview request failed.');
      }

      const payload = (await response.json()) as AnalysisResponse;
      setResult(payload);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Unknown preview error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-slate-900/10 bg-slate-950 text-white">
          <CardHeader className="space-y-4 border-white/10">
            <Badge variant="success" className="w-fit">Single-Version Preview</Badge>
            <div className="space-y-3">
              <h1 className="h1 max-w-2xl text-white md:text-5xl">
                Dual-engine AI preview with one deployable frontend and backend.
              </h1>
              <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
                This is the faster version: one Next.js app, one typed API route, one mission console, and one response contract the UI can preview immediately.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <HeroStat label="Launch shape" value="Frontend + backend" />
              <HeroStat label="Preview mode" value="Ready now" />
              <HeroStat label="Deploy target" value="Vercel / Node" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-1 text-xs uppercase tracking-[0.18em] text-slate-400">Company</div>
                <Input
                  className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
                  value={form.company}
                  onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}
                  placeholder="Apple"
                />
              </div>
              <div>
                <div className="mb-1 text-xs uppercase tracking-[0.18em] text-slate-400">Region</div>
                <Select
                  className="border-white/10 bg-white/5 text-white"
                  value={form.region}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, region: event.target.value as AnalysisRequest['region'] }))
                  }
                >
                  <option value="EU">EU</option>
                  <option value="US">US</option>
                  <option value="Global">Global</option>
                </Select>
              </div>
              <div>
                <div className="mb-1 text-xs uppercase tracking-[0.18em] text-slate-400">Urgency</div>
                <Select
                  className="border-white/10 bg-white/5 text-white"
                  value={form.urgency}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, urgency: event.target.value as AnalysisRequest['urgency'] }))
                  }
                >
                  <option value="Normal">Normal</option>
                  <option value="Priority">Priority</option>
                  <option value="Critical">Critical</option>
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="w-full" disabled={!canSubmit || isLoading} onClick={submit}>
                  {isLoading ? 'Running preview…' : 'Run preview'}
                </Button>
              </div>
            </div>
            <div>
              <div className="mb-1 text-xs uppercase tracking-[0.18em] text-slate-400">Mission prompt</div>
              <Textarea
                className="min-h-32 border-white/10 bg-white/5 text-white placeholder:text-slate-500"
                value={form.question}
                onChange={(event) => setForm((current) => ({ ...current, question: event.target.value }))}
                placeholder="Assess supply chain risk..."
              />
            </div>
            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="h2">Deploy-ready stack</div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-700">
            <DeployRow label="Frontend">App Router UI with one mission console and dashboard cards.</DeployRow>
            <DeployRow label="Backend">Typed route handler at <code>/api/preview</code> for one-shot analysis.</DeployRow>
            <DeployRow label="Integration">The frontend posts JSON once and renders one stable response contract.</DeployRow>
            <DeployRow label="Upgrade path">Swap the local preview engine for LangGraph, Ray, or vLLM later without redesigning the page.</DeployRow>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <CardHeader>
            <div className="h2">What you can preview</div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-700">
            <PreviewBullet title="AI Auditor">Instant compliance summary, risk score, and escalation threshold.</PreviewBullet>
            <PreviewBullet title="AI Researcher">Supply-chain and market view synthesized into operator-friendly bullets.</PreviewBullet>
            <PreviewBullet title="Synthesis">A single recommendation panel that translates analysis into deployment steps.</PreviewBullet>
            <PreviewBullet title="Latency">Fast preview path so you can test the UX before wiring expensive model infrastructure.</PreviewBullet>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="h2">Mission output</div>
              <p className="subtle text-sm">Run the preview to populate the integrated backend response.</p>
            </div>
            {result ? <Badge variant="warning">{result.latencyMs} ms simulated latency</Badge> : null}
          </CardHeader>
          <CardContent className="space-y-6">
            {result ? (
              <>
                <div className="grid gap-3 md:grid-cols-3">
                  {result.signals.map((signal) => (
                    <SignalBox key={signal.title} title={signal.title} value={signal.value} tone={signal.tone} />
                  ))}
                </div>
                <div className="grid gap-6 lg:grid-cols-3">
                  <SummaryCard title="Auditor" confidence={result.auditor.confidence} summary={result.auditor} />
                  <SummaryCard title="Researcher" confidence={result.researcher.confidence} summary={result.researcher} />
                  <Card className="bg-slate-50">
                    <CardHeader>
                      <div className="text-lg font-semibold">Synthesis</div>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-700">
                      <p>{result.synthesis.recommendation}</p>
                      <ul className="space-y-2">
                        {result.synthesis.deploymentNotes.map((note) => (
                          <li key={note} className="flex gap-2">
                            <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                <Card className="bg-slate-950 text-white">
                  <CardHeader>
                    <div className="text-lg font-semibold">Workflow timeline</div>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    {result.steps.map((step) => (
                      <div key={step.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-medium">{step.label}</div>
                          <Badge variant={step.status === 'active' ? 'warning' : 'success'}>{step.status}</Badge>
                        </div>
                        <p className="mt-2 text-sm text-slate-300">{step.detail}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-600">
                Fill out the mission prompt and click <strong>Run preview</strong> to see the integrated frontend/backend flow.
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</div>
      <div className="mt-2 text-lg font-semibold text-white">{value}</div>
    </div>
  );
}

function DeployRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <div className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div>{children}</div>
    </div>
  );
}

function PreviewBullet({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <div className="font-semibold text-slate-900">{title}</div>
      <p className="mt-1">{children}</p>
    </div>
  );
}

function SignalBox({
  title,
  value,
  tone,
}: {
  title: string;
  value: string;
  tone: 'positive' | 'neutral' | 'warning';
}) {
  const toneClassName =
    tone === 'warning'
      ? 'border-amber-200 bg-amber-50 text-amber-950'
      : tone === 'positive'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
        : 'border-slate-200 bg-white text-slate-900';

  return (
    <div className={`rounded-2xl border p-4 ${toneClassName}`}>
      <div className="text-xs uppercase tracking-[0.18em] opacity-70">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function SummaryCard({
  title,
  confidence,
  summary,
}: {
  title: string;
  confidence: number;
  summary: AnalysisResponse['auditor'];
}) {
  return (
    <Card className="bg-slate-50">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div className="text-lg font-semibold">{title}</div>
          <Badge variant="success">{confidence}% confidence</Badge>
        </div>
        <p className="text-sm text-slate-700">{summary.headline}</p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-slate-700">
          {summary.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
