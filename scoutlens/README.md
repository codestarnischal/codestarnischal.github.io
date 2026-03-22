# ScoutLens

ScoutLens now includes a deployable **Dual-Engine AI Preview**: a faster single-version experience that combines a frontend mission console and a typed backend route in one Next.js app.

## What is included
- A preview homepage at `/` for the AI Auditor + AI Market Researcher workflow.
- A backend integration route at `/api/preview` that validates input and returns a stable JSON response.
- The original industrial inspection demo at `/inspect`, with reports and settings still available.

## Tech Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + custom shadcn-like components
- Radix UI primitives, Lucide icons, Framer Motion
- Zustand state
- IndexedDB (idb)
- PDF generation via pdf-lib
- Vitest + Playwright

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Run the dev server:

```bash
pnpm dev
```

3. Open http://localhost:3000 to preview the dual-engine experience.

## Preview workflow
The landing page is the fastest version of the prior multi-service concept:
- **Frontend:** mission prompt, region/urgency controls, response dashboard.
- **Backend:** `POST /api/preview` route with typed validation.
- **Deployment:** ready for a single Vercel deployment or any Node-compatible host.

## Available routes
- `/` — Dual-engine preview website
- `/inspect` — Industrial AI inspector demo
- `/reports` — Saved inspection reports
- `/settings` — Local settings and exports

## Tests
- Unit tests:
```bash
pnpm test
```
- Type checks:
```bash
pnpm typecheck
```
- Production build:
```bash
pnpm build
```

## Privacy
The preview route runs locally inside the app and does not call external services unless you extend it.
