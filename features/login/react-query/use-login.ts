'use client';

import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { axiosInstanceMutator } from '@/core/api/axios';
import type { AuthControllerLoginV1MutationResult } from '@/core/api/generated/auth/auth';
import { useRouter } from '@/core/i18n/navigation';
import { useAuthStore } from '@/features/login/store/auth.store';

import type { LoginFormValues } from '../sections/form/form.login.schema';

// ── useLogin ──────────────────────────────────────────────────────────────────
// Anti-corruption layer wrapping the backend login endpoint.
//
// NOTE: The login endpoint has a requestBody (email + password) but the spec
// omits it, so the generated hook takes `void`. We call axiosInstanceMutator
// directly and type the result with AuthControllerLoginV1MutationResult from
// the generated auth module to stay in sync with Orval output.
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
      axiosInstanceMutator<AuthControllerLoginV1MutationResult>({
        url: '/api/v1/auth/login',
        method: 'POST',
        data: values,
      }),

    onSuccess: async (data) => {
      const accessToken = data.data?.accessToken ?? '';
      const refreshToken = data.data?.refreshToken ?? '';

      // 1. Persist tokens as cookies via Next.js Route Handler
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, refreshToken }),
      });

      // 2. Update Zustand store so axios interceptor can attach the token immediately
      setAuth(null, accessToken);

      // 3. Redirect to the packages page
      router.push('/packages');
    },

    onError: () => {
      toast.error(t('error'));
    },
  });
}
