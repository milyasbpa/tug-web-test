import type { Decorator, Meta, StoryObj } from '@storybook/nextjs-vite';

import { useAuthStore } from '@/features/login/store/auth.store';

import { ProtectedNavbar } from './ProtectedNavbar';

// ── Decorator: seed the Zustand auth store for each story ─────────────────────

const withAuthUser = (user: { email: string; id?: string } | null): Decorator => {
  function WithAuthUser(Story: Parameters<Decorator>[0], context: Parameters<Decorator>[1]) {
    useAuthStore.setState({ user, accessToken: user ? 'mock-token' : null });
    return <Story {...context} />;
  }
  WithAuthUser.displayName = 'WithAuthUser';
  return WithAuthUser as unknown as Decorator;
};

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta<typeof ProtectedNavbar> = {
  title: 'Components/ProtectedNavbar',
  component: ProtectedNavbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true },
  },
};

export default meta;
type Story = StoryObj<typeof ProtectedNavbar>;

// ── Stories ───────────────────────────────────────────────────────────────────

/** Logged-in state with a visible user email */
export const LoggedIn: Story = {
  decorators: [withAuthUser({ email: 'admin@example.com' })],
};

/** No user in the store (e.g. token-only session where user object was not fetched) */
export const TokenOnlySession: Story = {
  decorators: [withAuthUser(null)],
};
