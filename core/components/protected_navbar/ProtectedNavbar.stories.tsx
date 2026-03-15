import type { Decorator, Meta, StoryObj } from '@storybook/nextjs-vite';

import type { User } from '@/core/api/generated/starterKitAPIDocumentation.schemas';
import { useAuthStore } from '@/features/login/store/auth.store';

import { ProtectedNavbar } from './ProtectedNavbar';

const withAuthUser = (user: User | null): Decorator => {
  function WithAuthUser(Story: Parameters<Decorator>[0], context: Parameters<Decorator>[1]) {
    useAuthStore.setState({ user, accessToken: user ? 'mock-token' : null });
    return <Story {...context} />;
  }
  WithAuthUser.displayName = 'WithAuthUser';
  return WithAuthUser as unknown as Decorator;
};

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

/** Logged-in state with a visible user email */
export const LoggedIn: Story = {
  decorators: [
    withAuthUser({ id: 'user-1', email: 'admin@example.com', name: 'Admin', role: 'admin' }),
  ],
};

/** No user in the store (e.g. token-only session where user object was not fetched) */
export const TokenOnlySession: Story = {
  decorators: [withAuthUser(null)],
};
