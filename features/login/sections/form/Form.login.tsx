'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { Button } from '@/core/components/button';
import { FormField } from '@/core/components/form_field';
import { Input } from '@/core/components/input';
import { useLogin } from '@/features/login/react-query/use-login';

import { loginSchema, type LoginFormValues } from './form.login.schema';

export function FormLogin() {
  const t = useTranslations('login');
  const { mutate, isPending } = useLogin();

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: LoginFormValues) => {
    mutate(values);
  };

  return (
    <div className="sm:bg-card w-full max-w-sm space-y-6 sm:rounded-xl sm:border sm:p-8 sm:shadow-sm">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground text-sm">{t('subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <FormField
          name="email"
          control={control}
          label={t('email.label')}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              id="email"
              type="email"
              placeholder={t('email.placeholder')}
              autoComplete="email"
              aria-invalid={!!fieldState.error}
              aria-describedby={fieldState.error ? 'email-error' : undefined}
              disabled={isPending}
            />
          )}
        />

        <FormField
          name="password"
          control={control}
          label={t('password.label')}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              id="password"
              type="password"
              placeholder={t('password.placeholder')}
              autoComplete="current-password"
              aria-invalid={!!fieldState.error}
              aria-describedby={fieldState.error ? 'password-error' : undefined}
              disabled={isPending}
            />
          )}
        />

        <Button
          type="submit"
          variant="default"
          size="xl"
          className="w-full"
          disabled={isPending}
          aria-label={isPending ? t('submitting') : t('submit')}
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" />
              {t('submitting')}
            </>
          ) : (
            t('submit')
          )}
        </Button>
      </form>
    </div>
  );
}
