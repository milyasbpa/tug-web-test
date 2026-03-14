'use client';

import { useRouter } from 'next/navigation';
import { type ChangeEvent, type FormEvent, useState } from 'react';

import { useLogin } from '@/core/api/generated/auth/auth';
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/auth.schemas';
import { useAuthStore } from '@/features/auth/store/auth.store';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [form, setForm] = useState<LoginFormValues>({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<LoginFormValues>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const { mutate: login, isPending } = useLogin({
    mutation: {
      onSuccess: async (data) => {
        // Persist tokens via Route Handler (sets httpOnly cookie for refreshToken)
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          }),
        });

        // Hydrate Zustand store with user + token
        setAuth(data.user, data.accessToken);

        router.push('/dashboard');
      },
      onError: () => {
        setServerError('Invalid email or password. Please try again.');
      },
    },
  });

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);

    const result = loginSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Partial<LoginFormValues> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof LoginFormValues;
        fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    login({ data: result.data });
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Sign in</h1>
          <p className="text-muted-foreground text-sm">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              disabled={isPending}
              placeholder="you@example.com"
              className="focus:ring-ring w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 disabled:opacity-50"
            />
            {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              disabled={isPending}
              placeholder="••••••••"
              className="focus:ring-ring w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 disabled:opacity-50"
            />
            {errors.password && <p className="text-destructive text-xs">{errors.password}</p>}
          </div>

          {serverError && (
            <p className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {isPending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
}
