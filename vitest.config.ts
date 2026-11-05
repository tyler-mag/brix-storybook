import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'

const currentDir = dirname(fileURLToPath(import.meta.url))
const chromeExecutable = process.env.BRIX_CHROME_EXECUTABLE

export default defineConfig({
  plugins: [
    storybookTest({
      configDir: join(currentDir, '.storybook'),
    }),
  ],
  test: {
    name: 'storybook',
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(
        chromeExecutable
          ? { launchOptions: { executablePath: chromeExecutable } }
          : {},
      ),
      instances: [{ browser: 'chromium' }],
    },
  },
})
