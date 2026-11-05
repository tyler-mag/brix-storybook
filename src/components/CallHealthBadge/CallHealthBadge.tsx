import type { ComponentPropsWithoutRef } from 'react'
import styles from './CallHealthBadge.module.css'

export type CallHealthBadgeTone = 'error' | 'warning' | 'neutral'

export interface CallHealthBadgeProps
  extends Omit<ComponentPropsWithoutRef<'span'>, 'children'> {
  label: string
  tone: CallHealthBadgeTone
  /** Overrides the tone dot for runtime statuses such as Live call. */
  dotColor?: string
  /** Matches the source artifact's two-second pulsing status dot. */
  animated?: boolean
}

export function CallHealthBadge({
  label,
  tone,
  dotColor,
  animated = true,
  className,
  ...props
}: CallHealthBadgeProps) {
  return (
    <span
      {...props}
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      data-tone={tone}
    >
      <span
        aria-hidden="true"
        className={[styles.dot, animated ? styles.animated : null]
          .filter(Boolean)
          .join(' ')}
        style={dotColor ? { backgroundColor: dotColor } : undefined}
      />
      <span className={[styles.badge, styles[tone]].join(' ')}>{label}</span>
    </span>
  )
}

export interface LiveCallIndicatorProps {
  label?: string
}

export function LiveCallIndicator({ label = 'Live call' }: LiveCallIndicatorProps) {
  return (
    <CallHealthBadge dotColor="#5EAB41" label={label} tone="neutral" />
  )
}

