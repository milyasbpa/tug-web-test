import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SkipNavLink } from './SkipNav';

const meta: Meta<typeof SkipNavLink> = {
  title: 'Core/SkipNavLink',
  component: SkipNavLink,
  parameters: {
    docs: {
      description: {
        component:
          'Visually hidden link that becomes visible on keyboard focus. ' +
          'Place as the first element inside `<body>` before the navbar. ' +
          'Add `id="main-content"` to your `<main>` element. ' +
          'WCAG 2.1 Level A — Success Criterion 2.4.1 (Bypass Blocks).',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SkipNavLink>;

export const Default: Story = {
  render: (args) => (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        Press <kbd className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">Tab</kbd> to see the
        skip link appear.
      </p>
      <SkipNavLink {...args} />
      <div id="main-content" className="rounded-md border p-4 text-sm">
        Main content target
      </div>
    </div>
  ),
};
