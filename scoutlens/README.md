# ScoutLens

Phone-first Industrial AI Inspector that runs entirely in the browser. Point your phone at a machine. Get a signed, evidence-backed inspection report in 20 seconds.

## Tech Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + custom shadcn-like components
- Radix UI primitives, Lucide icons, Framer Motion
- Zustand state
- WebAudio API, MediaDevices, Canvas
- IndexedDB (idb)
- PDF generation via pdf-lib
- PWA via Next manifest + Service Worker
- Vitest + Playwright

## Getting Started

1. Install dependencies:

```
pnpm install
```

2. Run the dev server:

```
pnpm dev
```

3. Open http://localhost:3000 (defaults to /inspect).

## Features
- Live camera+mic preview (rear camera preferred)
- Real-time audio features: RMS, spectral centroid, HF ratio, ZCR, peak freq
- Spectrum and waveform canvases
- Heuristic findings and severity (0–100)
- Fill in details, signature, GPS capture
- Save to IndexedDB, generate PDF, optional webhook post
- Reports table with PDF/JSON export and delete
- PWA installable; works offline for Inspect → Save → PDF

## Data Model
See `lib/types.ts` for `Report` and feature types.

## Tests
- Unit tests:
```
pnpm test
```
- E2E (requires dev server running):
```
pnpm dev &
pnpm test:e2e
```

## Privacy
Local-first. No network calls occur unless you configure a webhook.