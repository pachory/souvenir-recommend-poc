'use client';

import { useState, useCallback } from 'react';
import type { GeneratedQuestion, AnswerItem, YesNoAnswer } from '../types';

export type QuestionnaireState =
  | 'initial' // 初期状態
  | 'loading' // 質問生成中
  | 'answering' // 回答中
  | 'submitting' // レコメンド取得中
  | 'completed'; // 完了

export function useQuestionnaireFlow() {
  const [state, setState] = useState<QuestionnaireState>('initial');
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerItem[]>([]);

  const initializeQuestions = useCallback((questions: GeneratedQuestion[]) => {
    setQuestions(questions);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setState('answering');
  }, []);

  const answerQuestion = useCallback(
    (answer: YesNoAnswer) => {
      if (state !== 'answering') return;

      const currentQuestion = questions[currentQuestionIndex];
      if (!currentQuestion) return;

      const newAnswer: AnswerItem = {
        question: {
          id: currentQuestion.id,
          text: currentQuestion.text,
          category: currentQuestion.category,
          priority: currentQuestion.priority,
        },
        answer,
      };

      const newAnswers = [...answers, newAnswer];
      setAnswers(newAnswers);

      // 次の質問へ
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // すべての質問に回答済み
        setState('submitting');
      }
    },
    [state, questions, currentQuestionIndex, answers]
  );

  const getCurrentQuestion = useCallback(() => {
    return questions[currentQuestionIndex] || null;
  }, [questions, currentQuestionIndex]);

  const isAllAnswered = useCallback(() => {
    return answers.length === questions.length && questions.length > 0;
  }, [answers.length, questions.length]);

  const reset = useCallback(() => {
    setState('initial');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
  }, []);

  return {
    state,
    setState,
    questions,
    currentQuestionIndex,
    answers,
    initializeQuestions,
    answerQuestion,
    getCurrentQuestion,
    isAllAnswered,
    reset,
    progress: questions.length > 0 ? currentQuestionIndex + 1 : 0,
    totalQuestions: questions.length,
  };
}

