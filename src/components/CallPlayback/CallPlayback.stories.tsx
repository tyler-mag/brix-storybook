import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { CallPlayback } from './CallPlayback'

const meta = {
  title: 'Compositions/Audio Transcript Player',
  component: CallPlayback,
  parameters: {
    layout: 'centered',
    status: 'ready',
  },
  args: {
    duration: 185,
    initialTime: 0,
    onSeek: fn(),
    onPlayingChange: fn(),
  },
} satisfies Meta<typeof CallPlayback>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultUsage: Story = {}

export const EventSeeking: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('0:00 / 3:05')).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'User escalation at 2:10' }),
    )
    await expect(canvas.getByText('2:10 / 3:05')).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Pause' })).toBeVisible()
    await expect(args.onSeek).toHaveBeenCalledWith(
      130,
      expect.objectContaining({ id: 'user-escalation' }),
    )
  },
}

export const Playing: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Play' }))
    await expect(canvas.getByRole('button', { name: 'Pause' })).toBeVisible()
    await expect(args.onPlayingChange).toHaveBeenCalledWith(true)
  },
}

export const AtTakeover: Story = {
  args: { initialTime: 140 },
}
