import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LayoutDashboard, Settings } from 'lucide-react';

import { NAV_TABS } from '@/core/modules/navigation';

import { MenuTabs } from './TabMenu';

const meta: Meta<typeof MenuTabs> = {
  title: 'Components/MenuTabs',
  component: MenuTabs,
  tags: ['autodocs'],
  args: {
    tabs: NAV_TABS,
  },
};

export default meta;
type Story = StoryObj<typeof MenuTabs>;

export const Default: Story = {};

export const CustomTabs: Story = {
  args: {
    tabs: [
      { value: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { value: 'settings', label: 'Settings', icon: Settings },
    ],
    defaultValue: 'dashboard',
  },
};
