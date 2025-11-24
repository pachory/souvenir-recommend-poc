import Link from 'next/link';
import { pocs } from '../data/pocs';

export function PocList() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold mb-4">PoC一覧</h1>
      <ul className="flex flex-col gap-3">
        {pocs.map((poc) => (
          <li key={poc.slug}>
            <Link
              href={`/poc/${poc.slug}`}
              className="block p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              <h2 className="text-xl font-semibold mb-1">{poc.title}</h2>
              {poc.description && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {poc.description}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

