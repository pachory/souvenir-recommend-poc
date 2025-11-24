'use client';

import { useState, useCallback } from 'react';
import type { QuestionGenerateResponse } from '../types';

export function useQuestionGeneration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<QuestionGenerateResponse | null>(null);

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/dify/question-generation', {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate questions');
      }

      const result: QuestionGenerateResponse = await response.json();
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
    generate,
    loading,
    error,
    data,
  };
}

