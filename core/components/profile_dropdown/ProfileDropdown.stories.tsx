import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ProfileDropdown } from './ProfileDropdown';

const meta: Meta<typeof ProfileDropdown> = {
  title: 'Components/ProfileDropdown',
  component: ProfileDropdown,
  tags: ['autodocs'],
  parameters: {
    // Give enough space so the dropdown can open downward
    layout: 'centered',
  },
  args: {
    user: {
      name: 'Denny Satria',
      email: 'denny@google.com',
    },
    quota: {
      remaining: 10,
      renewDate: 'January 13th 2026',
    },
    onUsageHistory: () => console.log('usage history'),
    onPlanBilling: () => console.log('plan & billing'),
    onSettings: () => console.log('settings'),
    onLogOut: () => console.log('log out'),
  },
};

export default meta;
type Story = StoryObj<typeof ProfileDropdown>;

/** Default — initials avatar, with quota badge */
export const Default: Story = {};

/** With a real avatar photo */
export const WithPhoto: Story = {
  args: {
    user: {
      name: 'Denny Satria',
      email: 'denny@google.com',
      avatarSrc: 'https://i.pravatar.cc/150?img=12',
    },
  },
};

/** No quota badge */
export const NoQuota: Story = {
  args: {
    quota: undefined,
  },
};

/** Long name and email — truncation kicks in */
export const LongContent: Story = {
  args: {
    user: {
      name: 'Alexander Bartholomew-Richardson',
      email: 'alexander.bartholomew.richardson@company.example.com',
    },
    quota: {
      remaining: 3,
      renewDate: 'March 31st 2026',
    },
  },
};

/** Zero photoshoots remaining */
export const QuotaExhausted: Story = {
  args: {
    quota: {
      remaining: 0,
      renewDate: 'February 28th 2026',
    },
  },
};
