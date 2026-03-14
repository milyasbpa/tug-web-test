import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { NAV_TABS } from '@/core/modules/navigation';

import { Navbar } from './Navbar';

const meta: Meta<typeof Navbar> = {
  title: 'Components/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Navbar>;

// ── Authenticated variant ─────────────────────────────────────────────────────

/** Default authenticated state — Logo · Tabs · Create + ProfileDropdown */
export const Authenticated: Story = {
  args: {
    variant: 'authenticated',
    tabs: NAV_TABS,
    user: {
      name: 'Denny Satria',
      email: 'denny@google.com',
    },
    quota: {
      remaining: 10,
      renewDate: 'January 13th 2026',
    },
    onCreateClick: () => console.log('create clicked'),
    onTabChange: (value) => console.log('tab changed:', value),
    onUsageHistory: () => console.log('usage history'),
    onPlanBilling: () => console.log('plan & billing'),
    onSettings: () => console.log('settings'),
    onLogOut: () => console.log('log out'),
  },
};

/** Authenticated — active tab pre-set to Projects */
export const ProjectsActive: Story = {
  args: {
    ...(Authenticated.args as object),
    activeTab: 'projects',
  },
};

/** Authenticated — user with a real avatar photo */
export const WithAvatar: Story = {
  args: {
    ...(Authenticated.args as object),
    user: {
      name: 'Denny Satria',
      email: 'denny@google.com',
      avatarSrc: 'https://i.pravatar.cc/150?img=12',
    },
  },
};

/** Authenticated — no quota badge in the profile panel */
export const NoQuota: Story = {
  args: {
    ...(Authenticated.args as object),
    quota: undefined,
  },
};

// ── Guest variant ─────────────────────────────────────────────────────────────

/** Guest state — Logo · Login + Sign up (unauthenticated) */
export const Guest: Story = {
  args: {
    variant: 'guest',
    onLoginClick: () => console.log('login clicked'),
    onSignUpClick: () => console.log('sign up clicked'),
  },
};
