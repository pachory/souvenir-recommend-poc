'use client';

interface BreadcrumbProgressProps {
  current: number;
  total: number;
}

export function BreadcrumbProgress({ current, total }: BreadcrumbProgressProps) {
  if (total === 0) return null;

  return (
    <nav className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
      <span>質問</span>
      <span className="font-semibold text-zinc-900 dark:text-zinc-50">
        {current}
      </span>
      <span>/</span>
      <span>{total}</span>
    </nav>
  );
}

