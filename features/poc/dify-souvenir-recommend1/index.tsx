import { QuestionnaireForm } from './components/QuestionnaireForm';

export function DifySouvenirRecommend1() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col py-32 px-16 bg-white dark:bg-black">
        <h1 className="text-3xl font-bold mb-8 text-zinc-900 dark:text-zinc-50">
          Dify Workflow お土産レコメンド
        </h1>
        <QuestionnaireForm />
      </main>
    </div>
  );
}

