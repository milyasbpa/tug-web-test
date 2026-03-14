import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import * as React from 'react';

import { NavigationModule } from './Navigation.module';

const meta: Meta<typeof NavigationModule> = {
  title: 'Modules/Navigation',
  component: NavigationModule,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof NavigationModule>;

// ── Stories ───────────────────────────────────────────────────────────────────

/** Default — fully wired navbar, click the avatar to open modals */
export const Default: Story = {
  render: () => <NavigationModule />,
};
