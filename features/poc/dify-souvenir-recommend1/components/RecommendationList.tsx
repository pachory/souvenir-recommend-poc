'use client';

import type { RecommendationItem } from '../types';

interface RecommendationListProps {
  recommendations: RecommendationItem[];
}

export function RecommendationList({
  recommendations,
}: RecommendationListProps) {
  if (recommendations.length === 0) {
    return (
      <div className="text-center text-zinc-600 dark:text-zinc-400 py-8">
        おすすめ商品が見つかりませんでした。
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        おすすめ商品
      </h2>
      <div className="grid gap-4">
        {recommendations.map((item) => (
          <div
            key={item.product_id}
            className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
              {item.name}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              {item.reason}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500 dark:text-zinc-500">
                {item.store_name}
              </span>
              {item.store_url && (
                <a
                  href={item.store_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  詳細を見る →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

