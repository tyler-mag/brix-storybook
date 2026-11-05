import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { MultiSelect, type MultiSelectOption } from './MultiSelect'
import styles from './MultiSelect.module.css'

const agents: MultiSelectOption[] = [
  { value: 'smith', label: 'Agent Smith' },
  { value: 'johnson', label: 'Agent Johnson' },
  {
    value: 'williams',
    label: 'Agent Williams with a very long descriptive title that should truncate',
  },
  { value: 'brown', label: 'Agent Brown' },
  { value: 'davis', label: 'Agent Davis' },
  { value: 'miller', label: 'Agent Miller' },
]

const meta = {
  title: 'Inputs/Multi-select',
  component: MultiSelect,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className={styles.storySurface}>
        <div className={styles.storyFrame}>
          <Story />
        </div>
      </div>
    ),
  ],
  args: {
    options: agents,
    placeholder: 'Agents',
    searchPlaceholder: 'Search agents...',
    emptyMessage: 'No agents found.',
    onValueChange: fn(),
  },
} satisfies Meta<typeof MultiSelect>

export default meta
type Story = StoryObj<typeof meta>

const getPage = (canvasElement: HTMLElement) => within(canvasElement.ownerDocument.body)

export const DefaultUsage: Story = {}

export const Open: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('combobox', { name: 'Agents' }))
    await expect(getPage(canvasElement).getByRole('listbox', { name: 'Agents options' })).toBeVisible()
  },
}

export const SingleSelection: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = getPage(canvasElement)
    await userEvent.click(canvas.getByRole('combobox', { name: 'Agents' }))
    await userEvent.click(page.getByRole('option', { name: 'Agent Smith' }))

    await expect(canvas.getByRole('combobox', { name: 'Agents: Agent Smith' })).toBeVisible()
    await expect(canvas.getByText('Agent Smith')).toBeVisible()
    await expect(canvas.queryByText('1 selected')).not.toBeInTheDocument()
    await expect(page.getByRole('listbox', { name: 'Agents options' })).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Clear selection' }))
    await expect(canvas.getByRole('combobox', { name: 'Agents' })).toBeVisible()
    await userEvent.click(page.getByRole('option', { name: 'Agent Smith' }))
    await expect(canvas.getByRole('combobox', { name: 'Agents: Agent Smith' })).toBeVisible()
  },
}

export const MultipleSelections: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = getPage(canvasElement)
    await userEvent.click(canvas.getByRole('combobox', { name: 'Agents' }))
    await userEvent.click(page.getByRole('option', { name: 'Agent Smith' }))
    await userEvent.click(page.getByRole('option', { name: 'Agent Johnson' }))

    await expect(canvas.getByRole('combobox', { name: 'Agents: 2 selected' })).toBeVisible()
    await expect(canvas.getByText('2 selected')).toBeVisible()
    await expect(page.getByRole('listbox', { name: 'Agents options' })).toBeVisible()
  },
}

export const Search: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = getPage(canvasElement)
    await userEvent.click(canvas.getByRole('combobox', { name: 'Agents' }))
    const search = page.getByRole('textbox', { name: 'Search agents...' })
    await userEvent.type(search, 'Miller')
    await expect(page.getByRole('option', { name: 'Agent Miller' })).toBeVisible()
    await expect(page.queryByRole('option', { name: 'Agent Smith' })).not.toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    await userEvent.click(canvas.getByRole('combobox', { name: 'Agents' }))
    await expect(page.getByRole('textbox', { name: 'Search agents...' })).toHaveValue('Miller')
  },
}

export const EmptyResults: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = getPage(canvasElement)
    await userEvent.click(canvas.getByRole('combobox', { name: 'Agents' }))
    await userEvent.type(page.getByRole('textbox', { name: 'Search agents...' }), 'zzz')
    await expect(page.getByText('No agents found.')).toBeVisible()
  },
}
