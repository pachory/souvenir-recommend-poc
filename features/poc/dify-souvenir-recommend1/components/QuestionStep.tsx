'use client';

import type { GeneratedQuestion, YesNoAnswer } from '../types';

interface QuestionStepProps {
  question: GeneratedQuestion;
  onAnswer: (answer: YesNoAnswer) => void;
  disabled?: boolean;
}

export function QuestionStep({
  question,
  onAnswer,
  disabled = false,
}: QuestionStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
        {question.text}
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => onAnswer('はい')}
          disabled={disabled}
          className="flex-1 px-6 py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          はい
        </button>
        <button
          onClick={() => onAnswer('いいえ')}
          disabled={disabled}
          className="flex-1 px-6 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 rounded-lg font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          いいえ
        </button>
      </div>
    </div>
  );
}

