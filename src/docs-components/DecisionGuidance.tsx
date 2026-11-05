import type { ReactNode } from 'react'
import styles from './DecisionGuidance.module.css'

export type DecisionRow = {
  label: string
  children: ReactNode
}

type DecisionGuidanceProps = {
  title?: string
  rows: DecisionRow[]
}

/**
 * Presents the literal selection rules a person or AI agent needs before
 * choosing a Brix component. Keep the rules specific and testable.
 */
export function DecisionGuidance({
  title = 'Selection contract',
  rows,
}: DecisionGuidanceProps) {
  return (
    <section className={styles.wrapper} aria-labelledby="brix-decision-title">
      <div className={styles.heading}>
        <span className={styles.eyebrow}>Decision guidance</span>
        <h2 id="brix-decision-title">{title}</h2>
        <p>
          The same rules apply whether the decision is made by a designer,
          engineer, or an interface-generating agent.
        </p>
      </div>
      <dl className={styles.rows}>
        {rows.map((row) => (
          <div className={styles.row} key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.children}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
