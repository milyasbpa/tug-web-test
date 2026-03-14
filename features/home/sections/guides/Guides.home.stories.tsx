import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { GuidesHome } from './Guides.home';

const meta: Meta<typeof GuidesHome> = {
  title: 'Pages/Home/sections/Guides',
  component: GuidesHome,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    viewport: {
      defaultViewport: 'xl',
    },
  },
};

export default meta;
type Story = StoryObj<typeof GuidesHome>;

export const Default: Story = {};
