import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export function Progress({ value, className }: { value: number; className?: string }) {
  const percent = Math.max(0, Math.min(100, value));
  return (
    <div className={cn('w-full h-3 bg-slate-100 rounded-full overflow-hidden', className)}>
      <div
        className="h-full bg-blue-600 transition-all"
        style={{ width: `${percent}%` }}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        role="progressbar"
      />
    </div>
  );
}