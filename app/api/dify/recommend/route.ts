import { NextResponse } from 'next/server';
import { getRecommendations } from '@/features/poc/dify-souvenir-recommend1/services/dify-api';
import type { RecommendRequest } from '@/features/poc/dify-souvenir-recommend1/types';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.DIFY_RECOMMEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'DIFY_RECOMMEND_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const body: RecommendRequest = await request.json();

    if (!body.answers || !Array.isArray(body.answers)) {
      return NextResponse.json(
        { error: 'Invalid request body: answers array is required' },
        { status: 400 }
      );
    }

    const result = await getRecommendations(body, {
      questionGenerationApiKey: process.env.DIFY_QUESTION_GENERATION_API_KEY || '',
      recommendApiKey: apiKey,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error getting recommendations:', error);
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

