import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { HomeContainer } from './Home.container';

const meta: Meta<typeof HomeContainer> = {
  title: 'Pages/Home',
  component: HomeContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'xl',
    },
    docs: {
      story: {
        inline: false,
        height: '900px',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof HomeContainer>;

/** Full home page — Navbar · Guide Cards · Masonry Gallery */
export const Default: Story = {};
