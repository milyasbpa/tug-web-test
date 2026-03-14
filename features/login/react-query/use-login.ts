'use client';

import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { axiosInstanceMutator } from '@/core/api/axios';
import type { AuthResponseDto } from '@/core/api/generated/nestjsStarter.schemas';
import { useRouter } from '@/core/i18n/navigation';
import { useAuthStore } from '@/features/login/store/auth.store';

import type { LoginFormValues } from '../sections/form/form.login.schema';

// ── useLogin ──────────────────────────────────────────────────────────────────
// Anti-corruption layer wrapping the backend login endpoint.
//
// NOTE: openapi.json omits the requestBody for POST /api/auth/login, so the
// Orval-generated hook takes `void`. We call axiosInstanceMutator directly
// to send email + password in the request body.
//
// onSuccess flow:
//   1. POST /api/auth/session  → set httpOnly refresh_token cookie + access_token cookie
//   2. setAuth(null, accessToken) → Zustand store (token refresh interceptor reads this)
//   3. router.push('/dashboard') → navigate to protected area
export function useLogin() {
  const t = useTranslations('login');
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (values: LoginFormValues) =>
      axiosInstanceMutator<AuthResponseDto>({
        url: '/api/auth/login',
        method: 'POST',
        data: values,
      }),

    onSuccess: async (data) => {
      // 1. Persist tokens as cookies via Next.js Route Handler
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        }),
      });

      // 2. Update Zustand store so axios interceptor can attach the token immediately
      setAuth(null, data.accessToken);

      // 3. Redirect to the dashboard
      router.push('/dashboard');
    },

    onError: () => {
      toast.error(t('error'));
    },
  });
}
