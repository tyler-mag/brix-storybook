import { forwardRef, type ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'danger'
export type ButtonSize = 'default' | 'small' | 'medium' | 'compact'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual hierarchy for the action. Primary preserves the authored artifact treatment. */
  variant?: ButtonVariant
  /** Default is 36px. Small is 28px; legacy medium/compact aliases remain compatible. */
  size?: ButtonSize
}

const joinClassNames = (...classNames: Array<string | undefined | false>) =>
  classNames.filter(Boolean).join(' ')

/** A Brix action button with explicit hierarchy and density. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    size = 'default',
    type = 'button',
    variant = 'primary',
    ...buttonProps
  },
  ref,
) {
  const resolvedSize = size === 'small' || size === 'compact' ? 'small' : 'default'

  return (
    <button
      {...buttonProps}
      ref={ref}
      type={type}
      className={joinClassNames(
        styles.button,
        styles[variant],
        styles[resolvedSize],
        className,
      )}
    >
      {children}
    </button>
  )
})
