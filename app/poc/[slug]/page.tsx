import { notFound } from 'next/navigation';
import { getPoc } from '@/features/poc/registry';

// PoCを登録
import '@/features/poc/dify-souvenir-recommend1/register';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PocPage({ params }: PageProps) {
  const { slug } = await params;
  const poc = getPoc(slug);

  if (!poc) {
    notFound();
  }

  return <>{poc.component}</>;
}
