'use client';

import { useEffect } from 'react';
import { useQuestionGeneration } from '../hooks/useQuestionGeneration';
import { useRecommend } from '../hooks/useRecommend';
import { useQuestionnaireFlow } from '../hooks/useQuestionnaireFlow';
import { BreadcrumbProgress } from './BreadcrumbProgress';
import { QuestionStep } from './QuestionStep';
import { RecommendationList } from './RecommendationList';

export function QuestionnaireForm() {
  const {
    generate,
    loading: generatingQuestions,
    error: questionError,
    data: questionData,
  } = useQuestionGeneration();

  const {
    getRecommendations,
    loading: loadingRecommendations,
    error: recommendError,
    data: recommendData,
  } = useRecommend();

  const {
    state,
    setState,
    questions,
    currentQuestionIndex,
    answers,
    initializeQuestions,
    answerQuestion,
    getCurrentQuestion,
    progress,
    totalQuestions,
    reset,
  } = useQuestionnaireFlow();

  // 初期化時に質問を生成
  useEffect(() => {
    if (state === 'initial') {
      setState('loading');
      generate().catch(() => {
        setState('initial');
      });
    }
  }, [state, generate, setState]);

  // 質問データが取得できたら初期化
  useEffect(() => {
    if (questionData?.questions && questionData.questions.length > 0) {
      if (state === 'loading' || state === 'initial') {
        initializeQuestions(questionData.questions);
      }
    }
  }, [questionData, state, initializeQuestions]);

  // すべての質問に回答したらレコメンドを取得
  useEffect(() => {
    if (state === 'submitting' && answers.length > 0) {
      getRecommendations({ answers })
        .then(() => {
          setState('completed');
        })
        .catch(() => {
          setState('answering');
        });
    }
  }, [state, answers, getRecommendations, setState]);

  // エラー表示
  if (questionError) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-red-800 dark:text-red-200 font-medium mb-2">
          エラーが発生しました
        </p>
        <p className="text-red-600 dark:text-red-300 text-sm">
          {questionError}
        </p>
        <button
          onClick={() => {
            setState('initial');
            generate();
          }}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
        >
          再試行
        </button>
      </div>
    );
  }

  if (recommendError) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-red-800 dark:text-red-200 font-medium mb-2">
          レコメンド取得中にエラーが発生しました
        </p>
        <p className="text-red-600 dark:text-red-300 text-sm">
          {recommendError}
        </p>
        <button
          onClick={() => {
            setState('submitting');
            getRecommendations({ answers });
          }}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
        >
          再試行
        </button>
      </div>
    );
  }

  // ローディング状態
  if (generatingQuestions || state === 'loading') {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-zinc-50 mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">
            質問を生成しています...
          </p>
        </div>
      </div>
    );
  }

  if (loadingRecommendations || state === 'submitting') {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-zinc-50 mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">
            おすすめ商品を取得しています...
          </p>
        </div>
      </div>
    );
  }

  // 完了状態：レコメンド結果を表示
  if (state === 'completed' && recommendData) {
    return (
      <div className="flex flex-col gap-6">
        <RecommendationList recommendations={recommendData.recommendation} />
        <div className="flex justify-center pt-4">
          <button
            onClick={() => {
              reset();
              setState('initial');
            }}
            className="px-6 py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            最初からやり直す
          </button>
        </div>
      </div>
    );
  }

  // 回答中：現在の質問を表示
  const currentQuestion = getCurrentQuestion();
  
  if (currentQuestion && state === 'answering') {
    return (
      <div>
        <BreadcrumbProgress current={progress} total={totalQuestions} />
        <QuestionStep
          question={currentQuestion}
          onAnswer={answerQuestion}
          disabled={false}
        />
      </div>
    );
  }

  // デバッグ用：状態が不明な場合
  if (state === 'answering' && !currentQuestion) {
    return (
      <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-yellow-800 dark:text-yellow-200 font-medium mb-2">
          デバッグ情報
        </p>
        <p className="text-yellow-600 dark:text-yellow-300 text-sm">
          State: {state}, Questions: {questions.length}, Current Index: {currentQuestionIndex}
        </p>
      </div>
    );
  }

  return null;
}

