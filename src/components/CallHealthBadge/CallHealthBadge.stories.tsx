import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { CallHealthBadge, LiveCallIndicator } from './CallHealthBadge'
import styles from './CallHealthBadge.module.css'

const meta = {
  title: 'Status/Call center badge',
  component: CallHealthBadge,
  parameters: {
    layout: 'centered',
    status: 'ready',
    backgrounds: { default: 'artifact' },
    a11y: {
      config: { rules: [{ id: 'color-contrast', enabled: false }] },
    },
  },
  args: {
    label: 'Tool failure',
    tone: 'error',
    animated: true,
  },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['error', 'warning', 'neutral'],
    },
  },
} satisfies Meta<typeof CallHealthBadge>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultUsage: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Tool failure')).toBeVisible()
  },
}

export const Error: Story = {
  args: { label: 'User escalation', tone: 'error' },
}

export const Warning: Story = {
  args: { label: 'Repetition detected', tone: 'warning' },
}

export const Live: Story = {
  render: () => <LiveCallIndicator />,
}

export const AllStatuses: Story = {
  render: () => (
    <div className={styles.showcase}>
      <section className={styles.showcaseGroup}>
        <h3 className={styles.showcaseHeading}>Error Badges</h3>
        <div className={styles.showcaseRow}>
          <CallHealthBadge label="Tool failure" tone="error" />
          <CallHealthBadge label="User escalation" tone="error" />
        </div>
      </section>
      <section className={styles.showcaseGroup}>
        <h3 className={styles.showcaseHeading}>Warning Badges</h3>
        <div className={styles.showcaseRow}>
          <CallHealthBadge label="Negative Sentiment" tone="warning" />
          <CallHealthBadge label="Repetition detected" tone="warning" />
          <CallHealthBadge label="Prolonged silence" tone="warning" />
        </div>
      </section>
      <section className={styles.showcaseGroup}>
        <h3 className={styles.showcaseHeading}>Status Badges</h3>
        <div className={styles.showcaseRow}><LiveCallIndicator /></div>
      </section>
    </div>
  ),
}
