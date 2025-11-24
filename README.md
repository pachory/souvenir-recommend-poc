# お土産レコメンドアプリ PoC

## 概要

チャット形式でお土産レコメンドを行うアプリケーションの PoC です。

## 技術スタック

- Next.js 16 (関連するライブラリは package.json を参照)
- Dify API (LLM API)

## PoC1: Dify Workflow を利用したチャット形式でのお土産レコメンド

2つのワークフローアプリケーションで構成。

### 質問生成ワークフロー

ユーザーに提示する 10個の yes/no 質問 を LLM で自動生成するワークフロー。
ナレッジベースの構造（カテゴリ、価格帯、相手の属性、用途など）を参照し、
商品ジャンルに依存しない汎用的な質問を作成する。
質問は JSON で返され、フロント側で表示・回答収集に使われる。

### レコメンド提案ワークフロー

ユーザーの 質問と回答の JSON を入力として受け取り、
LLM が回答内容から「誰に・どんなシーンで・どんな特徴の贈り物を探しているか」を推定。
その推定内容をもとにナレッジベースで検索し、
おすすめ商品を上位5件まで JSON 形式で返す。

#### Dify のレコメンド提案ワークフローの req/res の型

##### Request

```typescript
// 「はい」or「いいえ」の想定
export type YesNoAnswer = 'はい' | 'いいえ';

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

// レコメンド提案ワークフローへのリクエストボディ
export interface RecommendRequest {
  answers: AnswerItem[];
}
```

#### Response

```typescript
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
```

### Web アプリケーションへの組み込み

Web アプリケーション側は質問生成ワークフローの JSON を元に質問をチャット形式で10問回答させる。
回答は自由入力ではなく、「はい、いいえ」の2択で回答させる。
回答が終わったら、レコメンド提案ワークフローの API を呼び出し、パラメーターに質問と回答の JSON を渡しておすすめ商品の JSON を取得する。
取得したおすすめ商品の JSON を元に商品一覧を表示する。
