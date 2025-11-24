// 「はい」or「いいえ」の想定
export type YesNoAnswer = 'はい' | 'いいえ';

// 質問生成ワークフローのレスポンス型
export interface GeneratedQuestion {
  id: string;
  text: string;
  category: string;
  priority: number;
}

export interface QuestionGenerateResponse {
  questions: GeneratedQuestion[];
}

// レコメンド提案ワークフローのリクエスト/レスポンス型
export interface Question {
  id: string;          // 例: "q1"
  text: string;        // 例: "贈る相手は女性ですか？"
  category: string;    // 例: "recipient", "purpose", "price_range" など
  priority: number;    // 重要度（数値が小さいほど重要）
}

export interface AnswerItem {
  question: Question;
  answer: YesNoAnswer;
}

export interface RecommendRequest {
  answers: AnswerItem[];
}

export interface RecommendationItem {
  product_id: string;
  name: string;
  reason: string;
  store_name: string;
  store_url: string;
}

export interface RecommendResponse {
  recommendation: RecommendationItem[];
}

