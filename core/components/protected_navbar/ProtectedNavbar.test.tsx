import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockPush = vi.hoisted(() => vi.fn());
const mockUseAuthStore = vi.hoisted(() => vi.fn());

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      'links.wellnessPackages': 'Wellness Packages',
      'user.loggedInAs': 'Logged in as',
      logout: 'Log out',
    };
    return map[key] ?? key;
  },
}));

vi.mock('@/core/i18n/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  Link: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@/features/login/store/auth.store', () => ({
  useAuthStore: mockUseAuthStore,
}));

import { ProtectedNavbar } from './ProtectedNavbar';

function setupStore(user: { email: string } | null = null, clearAuth = vi.fn()) {
  mockUseAuthStore.mockImplementation((selector: (s: unknown) => unknown) => {
    const store = { user, clearAuth };
    return selector(store);
  });
}

describe('ProtectedNavbar', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the Wellness Packages navigation link', () => {
    setupStore();
    render(<ProtectedNavbar />);
    expect(screen.getByRole('link', { name: 'Wellness Packages' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Wellness Packages' })).toHaveAttribute(
      'href',
      '/packages',
    );
  });

  it('renders the logout button', () => {
    setupStore();
    render(<ProtectedNavbar />);
    expect(screen.getByRole('button', { name: 'Log out' })).toBeInTheDocument();
  });

  it('shows the user email when user is logged in', () => {
    setupStore({ email: 'admin@example.com' });
    render(<ProtectedNavbar />);
    expect(screen.getByText('admin@example.com')).toBeInTheDocument();
  });

  it('does not show an email when user is null', () => {
    setupStore(null);
    render(<ProtectedNavbar />);
    expect(screen.queryByText('@')).not.toBeInTheDocument();
  });

  it('calls DELETE /api/auth/session, clearAuth, and redirect on logout', async () => {
    const clearAuth = vi.fn();
    setupStore({ email: 'admin@example.com' }, clearAuth);
    render(<ProtectedNavbar />);

    await userEvent.click(screen.getByRole('button', { name: 'Log out' }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/session', { method: 'DELETE' });
      expect(clearAuth).toHaveBeenCalledOnce();
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });
});
