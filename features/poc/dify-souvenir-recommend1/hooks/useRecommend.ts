'use client';

import { useState, useCallback } from 'react';
import type { RecommendRequest, RecommendResponse } from '../types';

export function useRecommend() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RecommendResponse | null>(null);

  const getRecommendations = useCallback(async (request: RecommendRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/dify/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get recommendations');
      }

      const result: RecommendResponse = await response.json();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getRecommendations,
    loading,
    error,
    data,
  };
}

