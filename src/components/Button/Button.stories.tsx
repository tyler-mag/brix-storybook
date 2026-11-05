import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button, type ButtonProps } from './Button'
import styles from './Button.module.css'

const SizePreview = (args: ButtonProps) => (
  <div className={styles.storyRow}>
    <Button {...args} size="default">default</Button>
    <Button {...args} size="small">small</Button>
  </div>
)

const VariantPreview = () => (
  <div className={styles.storyRow}>
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="danger">Danger</Button>
  </div>
)

const meta = {
  title: 'Actions/Button',
  component: Button,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'danger'],
    },
    size: {
      control: 'inline-radio',
      options: ['default', 'small'],
    },
  },
  args: {
    children: 'Button',
    onClick: fn(),
    size: 'default',
    variant: 'primary',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultUsage: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Button' })

    await expect(button).toBeEnabled()
    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}

/** Hierarchy variants are isolated from density so each decision stays legible. */
export const Variants: Story = {
  render: VariantPreview,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Primary' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Secondary' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Danger' })).toBeVisible()
  },
}

/** Size names are the button labels, following the Zinnia comparison pattern. */
export const Sizes: Story = {
  render: (args) => <SizePreview {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'default' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'small' })).toBeVisible()
  },
}

export const Hover: Story = {
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Button' })
    await userEvent.hover(button)
    await expect(button).toBeEnabled()
  },
}

export const Focused: Story = {
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Button' })
    button.focus()
    await expect(button).toHaveFocus()
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
