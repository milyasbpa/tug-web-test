import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import loginMessages from '@/core/i18n/json/en/login.json';

// ── Module mock ───────────────────────────────────────────────────────────────
// useLogin is mocked so Form.login.tsx can be tested without a real network.
// vi.hoisted ensures the fn reference is available inside the vi.mock factory.
const mockMutate = vi.hoisted(() => vi.fn());

vi.mock('@/features/login/react-query/use-login', () => ({
  useLogin: () => ({ mutate: mockMutate, isPending: false }),
}));

import { FormLogin } from './Form.login';

// ── Test helpers ──────────────────────────────────────────────────────────────

function renderFormLogin() {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <NextIntlClientProvider locale="en" messages={{ login: loginMessages }}>
        <FormLogin />
      </NextIntlClientProvider>
    </QueryClientProvider>,
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('FormLogin', () => {
  describe('rendering', () => {
    it('renders email input', () => {
      renderFormLogin();
      expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    });

    it('renders password input', () => {
      renderFormLogin();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('renders submit button', () => {
      renderFormLogin();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('email input has type="email"', () => {
      renderFormLogin();
      expect(screen.getByRole('textbox', { name: /email/i })).toHaveAttribute('type', 'email');
    });

    it('password input has type="password"', () => {
      renderFormLogin();
      expect(screen.getByLabelText(/password/i)).toHaveAttribute('type', 'password');
    });
  });

  describe('validation errors', () => {
    it('shows error when submitting invalid email', async () => {
      renderFormLogin();
      const user = userEvent.setup();

      await user.type(screen.getByRole('textbox', { name: /email/i }), 'not-an-email');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(await screen.findByText('Please enter a valid email address')).toBeInTheDocument();
    });

    it('shows error when submitting password shorter than 8 characters', async () => {
      renderFormLogin();
      const user = userEvent.setup();

      await user.type(screen.getByRole('textbox', { name: /email/i }), 'user@example.com');
      await user.type(screen.getByLabelText(/password/i), 'short');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(await screen.findByText('Password must be at least 8 characters')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('submit button has an accessible name', () => {
      renderFormLogin();
      const button = screen.getByRole('button', { name: /sign in/i });
      expect(button).toBeInTheDocument();
    });

    it('email input is marked aria-invalid after failed submit', async () => {
      renderFormLogin();
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /sign in/i }));

      const emailInput = await screen.findByRole('textbox', { name: /email/i });
      expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('integration', () => {
    beforeEach(() => mockMutate.mockReset());

    it('calls mutate with form values on valid submit', async () => {
      renderFormLogin();
      const user = userEvent.setup();

      await user.type(screen.getByRole('textbox', { name: /email/i }), 'user@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(mockMutate).toHaveBeenCalledOnce();
      expect(mockMutate).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123',
      });
    });
  });
});
