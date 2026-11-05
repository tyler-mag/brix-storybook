import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { CallAgentCard } from './CallAgentCard'

const meta = {
  title: 'Compositions/Live call card',
  component: CallAgentCard,
  parameters: {
    layout: 'centered',
    status: 'ready',
    a11y: {
      config: { rules: [{ id: 'color-contrast', enabled: false }] },
    },
  },
  args: {
    variant: 'sort-by-agent',
    agentName: 'Agent name',
    directionLabel: 'Outbound to: (510) 921-0193',
    elapsedTime: '00:00',
    defaultMuted: true,
    defaultToolExpanded: false,
    onMutedChange: fn(),
    onTakeover: fn(),
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['sort-by-agent', 'mixed-feed'],
    },
  },
} satisfies Meta<typeof CallAgentCard>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultUsage: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Agent name')).toBeVisible()
    await expect(canvas.getByText('Tool failure')).toBeVisible()
  },
}

export const WithoutAgentName: Story = {
  args: { variant: 'mixed-feed' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByText('Agent name')).not.toBeInTheDocument()
  },
}

export const ToolDetails: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Performing tool • 00:10' })
    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(canvas.getByText(/Executing tool operation/)).toBeVisible()
  },
}

export const Unmuted: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Unmute call' }))
    await expect(canvas.getByRole('button', { name: 'Mute call' })).toBeVisible()
    await expect(args.onMutedChange).toHaveBeenCalledWith(false)
    canvas.getByRole('button', { name: 'Mute call' }).blur()
  },
}
