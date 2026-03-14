import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/nextjs-vite';

import '../../app/globals.css';
import { withNextIntl } from './decorators/withNextIntl';

const preview: Preview = {
  decorators: [
    withNextIntl,
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      test: 'todo',
    },

    viewport: {
      defaultViewport: 'xl',
      viewports: {
        sm: {
          name: 'sm (640px)',
          styles: { width: '640px', height: '900px' },
          type: 'mobile',
        },
        md: {
          name: 'md (768px)',
          styles: { width: '768px', height: '900px' },
          type: 'tablet',
        },
        lg: {
          name: 'lg (1024px)',
          styles: { width: '1024px', height: '900px' },
          type: 'desktop',
        },
        xl: {
          name: 'xl (1280px)',
          styles: { width: '1280px', height: '900px' },
          type: 'desktop',
        },
        '2xl': {
          name: '2xl (1536px)',
          styles: { width: '1536px', height: '900px' },
          type: 'desktop',
        },
      },
    },
  },
};

export default preview;
