# codestarnischal.github.io

This repository contains the `scoutlens` Next.js app, which now ships with a deployable dual-engine AI preview homepage plus the existing inspection demo.

## App
- `scoutlens/` — Next.js application with frontend and backend preview integration.

## Run from the repo root
```bash
pnpm dev
pnpm build
pnpm start
```

## Vercel deployment
The repository now includes a root `vercel.json` that installs and builds the app from `scoutlens/` with `corepack pnpm`, so Vercel uses the pinned pnpm version instead of an older default binary.

### Recommended deploy flow
1. Import this repository into Vercel.
2. Leave the project root at the repository root.
3. Deploy — Vercel will use the root `vercel.json` overrides to install and build the Next.js app in `scoutlens/`.

### If you saw the lockfile error
If Vercel showed `Ignoring not compatible lockfile` followed by `Headless installation requires a pnpm-lock.yaml file`, the install step was using a pnpm version too old for the lockfile. The current config fixes that by pinning pnpm in `scoutlens/package.json` and running install/build through `corepack pnpm`.

### Local verification
```bash
pnpm build
pnpm start
```
Then open `http://localhost:3000`.
