import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { PackagesContainer } from '@/features/packages/container/Packages.container';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('packages');
  return {
    title: t('title'),
  };
}

export default function PackagesPage() {
  return (
    <Suspense>
      <PackagesContainer />
    </Suspense>
  );
}
