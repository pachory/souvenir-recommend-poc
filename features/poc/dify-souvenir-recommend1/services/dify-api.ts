import { randomUUID } from 'crypto';
import type {
  GeneratedQuestion,
  QuestionGenerateResponse,
  RecommendRequest,
  RecommendResponse,
} from '../types';

const DIFY_API_BASE_URL = 'https://api.dify.ai/v1';

export interface DifyApiConfig {
  questionGenerationApiKey: string;
  recommendApiKey: string;
}

/**
 * 質問生成ワークフローを実行
 */
export async function generateQuestions(
  config: DifyApiConfig
): Promise<QuestionGenerateResponse> {
  const response = await fetch(
    `${DIFY_API_BASE_URL}/workflows/run`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.questionGenerationApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        response_mode: 'blocking',
        user: randomUUID(),
      }),
    }
  );

  if (!response.ok) {
    let errorMessage = `Dify API error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
        // よくあるエラーメッセージを日本語に変換
        if (errorMessage === 'Workflow not published') {
          errorMessage = 'ワークフローが公開されていません。Difyでワークフローを公開してください。';
        }
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch {
      // JSONパースに失敗した場合はテキストとして扱う
      const errorText = await response.text();
      if (errorText) {
        errorMessage = errorText;
      }
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  
  // Dify APIのレスポンスから質問データを抽出
  let questions: GeneratedQuestion[] | null = null;
  
  try {
    // パターン1: data.data.outputs.result にJSON文字列として含まれる
    if (data.data?.outputs?.result) {
      const parsed = JSON.parse(data.data.outputs.result);
      
      // parsedがオブジェクトでquestionsプロパティを持つ場合
      if (parsed.questions && Array.isArray(parsed.questions)) {
        questions = parsed.questions;
      }
    }
  } catch (parseError) {
    console.error('Error parsing Dify API response:', parseError);
    throw new Error(`Failed to parse Dify API response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
  }
  
  if (questions && questions.length > 0) {
    return { questions };
  }

  throw new Error(`Invalid response format from Dify API. Expected questions array but got: ${JSON.stringify(data)}`);
}

/**
 * レコメンド提案ワークフローを実行
 */
export async function getRecommendations(
  request: RecommendRequest,
  config: DifyApiConfig
): Promise<RecommendResponse> {
  const response = await fetch(
    `${DIFY_API_BASE_URL}/workflows/run`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.recommendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          answers: JSON.stringify(request.answers),
        },
        response_mode: 'blocking',
        user: randomUUID(),
      }),
    }
  );

  if (!response.ok) {
    let errorMessage = `Dify API error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
        // よくあるエラーメッセージを日本語に変換
        if (errorMessage === 'Workflow not published') {
          errorMessage = 'ワークフローが公開されていません。Difyでワークフローを公開してください。';
        }
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch {
      // JSONパースに失敗した場合はテキストとして扱う
      const errorText = await response.text();
      if (errorText) {
        errorMessage = errorText;
      }
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  
  // Dify APIのレスポンスからレコメンドデータを抽出
  // 実際のレスポンス構造に応じて調整が必要
  if (data.data?.outputs?.result) {
    const parsed = JSON.parse(data.data.outputs.result);

    // recommendationが存在し、配列であることを確認
    if (parsed.recommendation && Array.isArray(parsed.recommendation)) {
      return { recommendation: parsed.recommendation };
    }
  }

  throw new Error('Invalid response format from Dify API');
}
