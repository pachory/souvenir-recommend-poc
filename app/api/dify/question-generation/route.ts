import { NextResponse } from 'next/server';
import { generateQuestions } from '@/features/poc/dify-souvenir-recommend1/services/dify-api';

export async function POST() {
  try {
    const apiKey = process.env.DIFY_QUESTION_GENERATION_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'DIFY_QUESTION_GENERATION_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const result = await generateQuestions({
      questionGenerationApiKey: apiKey,
      recommendApiKey: process.env.DIFY_RECOMMEND_API_KEY || '',
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating questions:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    const statusCode =
      errorMessage.includes('Workflow not published') ||
      errorMessage.includes('ワークフローが公開されていません')
        ? 400
        : 500;
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}

