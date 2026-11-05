import * as Popover from '@radix-ui/react-popover'
import { Check, ChevronsUpDown, Search, X } from 'lucide-react'
import {
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import styles from './MultiSelect.module.css'

export interface MultiSelectOption {
  value: string
  label: string
  /** Retained for data-model compatibility; the artifact does not render descriptions. */
  description?: string
  disabled?: boolean
}

export interface MultiSelectProps {
  options: MultiSelectOption[]
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  ariaLabel?: string
  disabled?: boolean
}

const joinClassNames = (...classNames: Array<string | undefined | false>) =>
  classNames.filter(Boolean).join(' ')

export function MultiSelect({
  options,
  value,
  defaultValue = [],
  onValueChange,
  placeholder = 'Agents',
  searchPlaceholder = 'Search agents...',
  emptyMessage = 'No agents found.',
  ariaLabel,
  disabled = false,
}: MultiSelectProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const listboxId = useId()
  const selectedValues = value ?? uncontrolledValue

  const selectedOptions = useMemo(
    () =>
      selectedValues
        .map((selectedValue) => options.find((option) => option.value === selectedValue))
        .filter((option): option is MultiSelectOption => Boolean(option)),
    [options, selectedValues],
  )

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    if (!normalizedQuery) return options
    return options.filter((option) =>
      option.label.toLocaleLowerCase().includes(normalizedQuery),
    )
  }, [options, query])

  const summary =
    selectedOptions.length === 1
      ? selectedOptions[0].label
      : selectedOptions.length > 1
        ? `${selectedOptions.length} selected`
        : null

  const accessibleName =
    ariaLabel ?? (summary ? `${placeholder}: ${summary}` : placeholder)

  const commitValue = (nextValue: string[]) => {
    if (value === undefined) setUncontrolledValue(nextValue)
    onValueChange?.(nextValue)
  }

  const toggleOption = (option: MultiSelectOption) => {
    if (option.disabled) return
    const isSelected = selectedValues.includes(option.value)
    const nextValue = isSelected
      ? selectedValues.filter((selectedValue) => selectedValue !== option.value)
      : [...selectedValues, option.value]

    commitValue(nextValue)
    setAnnouncement(`${option.label} ${isSelected ? 'removed' : 'selected'}.`)
  }

  const focusOption = (index: number) => {
    const optionElements = document.querySelectorAll<HTMLElement>(
      `[data-brix-listbox="${listboxId}"] [role="option"]:not([aria-disabled="true"])`,
    )
    optionElements[index]?.focus()
  }

  const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || disabled) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setOpen((currentOpen) => !currentOpen)
      if (!open) requestAnimationFrame(() => searchRef.current?.focus())
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      requestAnimationFrame(() => searchRef.current?.focus())
    }
  }

  const handleSearchKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' && filteredOptions.length > 0) {
      event.preventDefault()
      focusOption(0)
    }
    if (event.key === 'Escape') setOpen(false)
    if (event.key === 'Backspace' && query === '' && selectedOptions.length > 0) {
      const removedOption = selectedOptions[selectedOptions.length - 1]
      commitValue(selectedValues.slice(0, -1))
      setAnnouncement(`${removedOption.label} removed.`)
    }
  }

  const handleOptionKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    optionIndex: number,
  ) => {
    const selectableOptions = filteredOptions.filter((option) => !option.disabled)
    const currentOption = filteredOptions[optionIndex]
    const selectableIndex = selectableOptions.findIndex(
      (option) => option.value === currentOption.value,
    )

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusOption(Math.min(selectableIndex + 1, selectableOptions.length - 1))
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (selectableIndex === 0) searchRef.current?.focus()
      else focusOption(selectableIndex - 1)
    }
    if (event.key === 'Home') {
      event.preventDefault()
      focusOption(0)
    }
    if (event.key === 'End') {
      event.preventDefault()
      focusOption(selectableOptions.length - 1)
    }
    if (event.key === 'Escape') setOpen(false)
  }

  const clearSelection = () => {
    commitValue([])
    setAnnouncement('All agents cleared.')
  }

  return (
    <div className={styles.root}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild disabled={disabled}>
          <div
            className={styles.trigger}
            role="combobox"
            aria-label={accessibleName}
            aria-controls={listboxId}
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : 0}
            onKeyDown={handleTriggerKeyDown}
          >
            <span className={styles.triggerContent}>
              <span className={styles.triggerLabel}>{placeholder}</span>
              {summary ? (
                <span className={styles.summaryBadge}>
                  <span className={styles.summaryText}>{summary}</span>
                  <button
                    className={styles.clearSelection}
                    type="button"
                    aria-label="Clear selection"
                    onPointerDown={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                    }}
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      clearSelection()
                    }}
                    onKeyDown={(event) => event.stopPropagation()}
                  >
                    <X aria-hidden="true" />
                  </button>
                </span>
              ) : null}
            </span>
            <ChevronsUpDown className={styles.triggerIcon} aria-hidden="true" />
          </div>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className={styles.content}
            aria-label={`${placeholder} selector`}
            align="start"
            sideOffset={8}
            collisionPadding={8}
            avoidCollisions={false}
            onOpenAutoFocus={(event) => event.preventDefault()}
            onCloseAutoFocus={(event) => event.preventDefault()}
          >
            <div className={styles.searchSection}>
              <div className={styles.searchField}>
                <Search className={styles.searchIcon} aria-hidden="true" />
                <input
                  ref={searchRef}
                  className={styles.searchInput}
                  type="text"
                  value={query}
                  placeholder={searchPlaceholder}
                  aria-label={searchPlaceholder}
                  autoComplete="off"
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
              </div>
            </div>

            <div
              id={listboxId}
              className={styles.listbox}
              role="listbox"
              aria-label={`${placeholder} options`}
              aria-multiselectable="true"
              data-brix-listbox={listboxId}
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, optionIndex) => {
                  const selected = selectedValues.includes(option.value)
                  return (
                    <button
                      key={option.value}
                      className={styles.option}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      aria-disabled={option.disabled || undefined}
                      disabled={option.disabled}
                      tabIndex={-1}
                      onClick={() => toggleOption(option)}
                      onKeyDown={(event) => handleOptionKeyDown(event, optionIndex)}
                    >
                      <span
                        className={joinClassNames(styles.checkbox, selected && styles.checkboxSelected)}
                        aria-hidden="true"
                      >
                        {selected ? <Check /> : null}
                      </span>
                      <span className={styles.optionLabel}>{option.label}</span>
                    </button>
                  )
                })
              ) : (
                <p
                  className={styles.empty}
                  role="option"
                  aria-disabled="true"
                  aria-selected="false"
                >
                  {emptyMessage}
                </p>
              )}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      <span className={styles.srOnly} aria-live="polite">
        {announcement}
      </span>
    </div>
  )
}
