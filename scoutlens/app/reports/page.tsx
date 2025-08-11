"use client";
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { Report } from '@/lib/types';
import { deleteReport, getAllReports, putReport } from '@/lib/storage/db';

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const load = async () => {
      const all = await getAllReports();
      if (all.length === 0) {
        // seed one demo
        const demo: Report = {
          id: 'demo-1',
          createdAt: new Date().toISOString(),
          techName: 'Demo Tech',
          company: 'Acme Facilities',
          assetType: 'fan',
          features: { rms: 0.12, centroidHz: 2100, hfRatio: 0.31, zcr: 0.08, peakHz: 55 },
          findings: [{ label: 'Loose panel / vibration', confidence: 0.58 }],
          severity: 34,
          images: {},
          gps: null,
          sha256: 'demo'
        };
        await putReport(demo);
      }
      setReports(await getAllReports());
    };
    load();
  }, []);

  const exportJson = (r: Report) => {
    const blob = new Blob([JSON.stringify(r, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = `Report-${r.id}.json`; a.click(); URL.revokeObjectURL(url);
  };

  const makePdf = async (r: Report) => {
    const { generateReportPdf } = await import('@/lib/pdf/report');
    const bytes = await generateReportPdf(r);
    const url = URL.createObjectURL(new Blob([new Uint8Array(bytes).buffer], { type: 'application/pdf' }));
    const a = document.createElement('a'); a.href = url; a.download = `ScoutLens-${r.id}.pdf`; a.click(); URL.revokeObjectURL(url);
  };

  const remove = async (id: string) => { await deleteReport(id); setReports(await getAllReports()); };

  return (
    <Card>
      <CardHeader><div className="h2">Saved Reports</div></CardHeader>
      <CardContent>
        <div className="overflow-auto">
          <Table>
            <THead>
              <TR>
                <TH>Date</TH>
                <TH>Asset</TH>
                <TH>Severity</TH>
                <TH>Findings</TH>
                <TH className="text-right pr-6">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {reports.map((r) => (
                <TR key={r.id}>
                  <TD>{new Date(r.createdAt).toLocaleString()}</TD>
                  <TD>{r.assetType}{r.assetId ? ` #${r.assetId}` : ''}</TD>
                  <TD>{r.severity}</TD>
                  <TD>{r.findings.map((f) => f.label).join(', ') || '—'}</TD>
                  <TD className="text-right space-x-2">
                    <Button variant="outline" onClick={() => makePdf(r)}>PDF</Button>
                    <Button variant="outline" onClick={() => exportJson(r)}>JSON</Button>
                    <Button variant="destructive" onClick={() => remove(r.id)}>Delete</Button>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}