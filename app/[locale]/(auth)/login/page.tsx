import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { LoginContainer } from '@/features/login/container/Login.container';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('login');
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default function LoginPage() {
  return <LoginContainer />;
}
