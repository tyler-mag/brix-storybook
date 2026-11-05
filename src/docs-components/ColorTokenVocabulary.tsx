import { Check, Copy } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import styles from './ColorTokenVocabulary.module.css'

export type ColorToken = {
  name: string
  value: string
}

export type ColorTokenGroup = {
  label: string
  tokens: ColorToken[]
}

function CopyToken({ token }: { token: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(token)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <button
      aria-label={`Copy ${token}`}
      className={styles.copy}
      onClick={copy}
      type="button"
    >
      {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

export function ColorTokenVocabulary({
  example = 'color: var(--brix-color-text-primary);',
  groups,
  intro = 'Import Brix semantic tokens once, then use the variable that matches the interface role.',
}: {
  example?: string
  groups: ColorTokenGroup[]
  intro?: string
}) {
  return (
    <div className={styles.vocabulary}>
      <header className={styles.intro}>
        <p>{intro}</p>
        <div className={styles.importBlock}>
          <code>@import './styles/tokens.generated.css';</code>
          <code>{example}</code>
        </div>
      </header>

      {groups.map((group) => (
        <section className={styles.group} key={group.label}>
          <h2>{group.label}</h2>
          <div className={styles.list}>
            {group.tokens.map((token) => (
              <div className={styles.token} key={token.name}>
                <span
                  aria-hidden="true"
                  className={`${styles.swatch} ${token.value === 'transparent' ? styles.transparent : ''}`}
                  style={{ '--token-color': token.value } as CSSProperties}
                />
                <span className={styles.identity}>
                  <code>{token.name}</code>
                  <span className={styles.value}>{token.value}</span>
                </span>
                <CopyToken token={`var(${token.name})`} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
