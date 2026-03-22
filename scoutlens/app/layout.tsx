import '../styles/globals.css';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { MotionConfig, AnimatePresence } from 'framer-motion';

export const metadata = {
  title: 'ScoutLens — Dual-Engine AI Preview',
  description: 'Deployable preview for a single-version AI auditor and market researcher workflow.',
};


export const viewport = {
  themeColor: '#ffffff',
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <MotionConfig transition={{ duration: 0.18, ease: 'easeInOut' }}>
          <Header />
          <main className="container max-w-6xl py-6 sm:py-8">{children}</main>
          <Footer />
          <ServiceWorkerRegister />
          <Shortcuts />
        </MotionConfig>
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="border-b bg-white/70 backdrop-blur sticky top-0 z-40">
      <div className="container max-w-6xl py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-block h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-soft" />
          <span className="font-semibold tracking-tight text-lg">ScoutLens</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link className="hover:text-blue-600" href="/">Preview</Link>
          <Link className="hover:text-blue-600" href="/inspect">Inspect</Link>
          <Link className="hover:text-blue-600" href="/reports">Reports</Link>
          <Link className="hover:text-blue-600" href="/settings">Settings</Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t">
      <div className="container max-w-6xl py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm subtle">Local-first. Nothing leaves your device unless you export.</p>
        <a className="text-sm text-blue-600 hover:underline" href="https://" target="_blank" rel="noreferrer">About</a>
      </div>
    </footer>
  );
}

function ServiceWorkerRegister() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `if (typeof window !== 'undefined' && 'serviceWorker' in navigator) { window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(()=>{}); }); }`,
      }}
    />
  );
}

function Shortcuts() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `document.addEventListener('keydown', (e) => { if (e.target && (e.target as HTMLElement).tagName?.toLowerCase() === 'input') return; if (e.key === 'g') { let buffer = ''; const handler = (ev) => { buffer += ev.key; if (buffer === 'gi') location.href = '/inspect'; if (buffer === 'gr') location.href = '/reports'; if (buffer === 'gs') location.href = '/settings'; setTimeout(()=>buffer='', 600); document.removeEventListener('keydown', handler); }; document.addEventListener('keydown', handler); } });`,
      }}
    />
  );
}