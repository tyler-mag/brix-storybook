import type { Preview } from '@storybook/react-vite'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import '@fontsource-variable/figtree'
import '../src/styles/tokens.generated.css'
import '../src/styles/global.css'

const preview: Preview = {
  decorators: [
    (Story) => (
      <TooltipProvider delayDuration={180}>
        <Story />
      </TooltipProvider>
    ),
  ],
  parameters: {
    a11y: { test: 'error' },
    backgrounds: { disable: true },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    docs: {
      toc: { headingSelector: 'h2, h3' },
    },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Design Tokens',
          ['Overview', 'Primitive palette', 'Color vocabulary'],
          'Actions',
          'Inputs',
          'Status',
          'Compositions',
        ],
      },
    },
  },
};

export default preview;
