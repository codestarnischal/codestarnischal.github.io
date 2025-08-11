"use client";
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/lib/store/settings';
import { clearAll, getAllReports } from '@/lib/storage/db';

export default function SettingsPage() {
  const { techName, company, webhookUrl, autoSend, set } = useSettings();

  const exportAll = async () => {
    const data = { settings: { techName, company, webhookUrl, autoSend }, reports: await getAllReports() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = 'scoutlens-export.json'; a.click(); URL.revokeObjectURL(url);
  };

  const importAll = async (file: File) => {
    const text = await file.text();
    const data = JSON.parse(text);
    if (data.settings) set(data.settings);
    // Reports import skipped for brevity; could merge into IDB.
    alert('Settings imported');
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (f) importAll(f);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader><div className="h2">Defaults</div></CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="text-xs subtle mb-1">Technician</div>
            <Input value={techName} onChange={(e) => set({ techName: e.target.value })} />
          </div>
          <div>
            <div className="text-xs subtle mb-1">Company</div>
            <Input value={company} onChange={(e) => set({ company: e.target.value })} />
          </div>
          <div>
            <div className="text-xs subtle mb-1">Webhook URL</div>
            <Input value={webhookUrl} onChange={(e) => set({ webhookUrl: e.target.value })} placeholder="https://..." />
          </div>
          <div>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={autoSend} onChange={(e) => set({ autoSend: e.target.checked })} />
              Auto-send on Save
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><div className="h2">Data</div></CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm subtle">Local-first. Nothing is uploaded unless you export or enable the webhook.</div>
          <div className="flex gap-3">
            <Button onClick={exportAll}>Export All (JSON)</Button>
            <label className="inline-flex items-center gap-2">
              <input type="file" accept="application/json" onChange={onFile} className="hidden" id="sl-import" />
              <span className="h-10 inline-flex items-center px-4 py-2 rounded-xl border cursor-pointer">Import</span>
            </label>
          </div>
          <div>
            <Button variant="destructive" onClick={() => { if (confirm('Delete all reports?')) clearAll(); }}>Delete All Reports</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}