import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

const baseUrl = process.env.BRIX_STORYBOOK_URL ?? 'http://127.0.0.1:6006'
const executablePath =
  process.env.BRIX_CHROME_EXECUTABLE ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const outputDirectory = new URL('../case-study-media/', import.meta.url)

const captures = [
  {
    file: '01-introduction.png',
    url: `${baseUrl}/?path=/docs/introduction--docs`,
  },
  {
    file: '02-button-variants.png',
    url: `${baseUrl}/iframe.html?id=actions-button--sizes&viewMode=story`,
  },
  {
    file: '03-multi-select.png',
    url: `${baseUrl}/iframe.html?id=inputs-multi-select--multiple-selections&viewMode=story`,
    delay: 1000,
  },
  {
    file: '04-health-badges.png',
    url: `${baseUrl}/iframe.html?id=status-call-center-badge--all-statuses&viewMode=story`,
  },
  {
    file: '05-call-agent-card.png',
    url: `${baseUrl}/iframe.html?id=compositions-live-call-card--default-usage&viewMode=story`,
  },
  {
    file: '06-call-playback.png',
    url: `${baseUrl}/iframe.html?id=compositions-audio-transcript-player--default-usage&viewMode=story`,
  },
]

await mkdir(outputDirectory, { recursive: true })

const browser = await chromium.launch({ executablePath, headless: true })
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
})

for (const capture of captures) {
  await page.goto(capture.url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(capture.delay ?? 350)
  await page.screenshot({
    path: new URL(capture.file, outputDirectory).pathname,
    fullPage: false,
  })
}

await browser.close()
