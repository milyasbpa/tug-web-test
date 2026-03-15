'use client';

import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { axiosInstanceMutator } from '@/core/api/axios';
import type { AuthControllerLoginV1MutationResult } from '@/core/api/generated/auth/auth';
import { useRouter } from '@/core/i18n/navigation';
import { useAuthStore } from '@/features/login/store/auth.store';

import type { LoginFormValues } from '../sections/form/form.login.schema';

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

      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, refreshToken }),
      });

      setAuth(null, accessToken);

      router.push('/packages');
    },

    onError: () => {
      toast.error(t('error'));
    },
  });
}
