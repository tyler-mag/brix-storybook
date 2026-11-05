import { useRef, useState } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { ChevronDown, Headphones, LoaderCircle, Volume2, VolumeX } from 'lucide-react'
import { CallHealthBadge } from '../CallHealthBadge'
import { artifactTranscript } from './artifactTranscript'
import styles from './CallAgentCard.module.css'

export type CallAgentCardVariant = 'sort-by-agent' | 'mixed-feed'

export interface CallTranscriptItem {
  id: string
  speaker: 'agent' | 'customer'
  label: string
  time: string
  copy: string
}

export interface CallAgentCardProps
  extends Omit<ComponentPropsWithoutRef<'article'>, 'children'> {
  variant?: CallAgentCardVariant
  agentName?: string
  directionLabel?: string
  elapsedTime?: string
  transcriptItems?: CallTranscriptItem[]
  muted?: boolean
  defaultMuted?: boolean
  defaultToolExpanded?: boolean
  onMutedChange?: (muted: boolean) => void
  onTakeover?: () => void
}

export function CallAgentCard({
  variant = 'sort-by-agent',
  agentName = 'Agent name',
  directionLabel = 'Outbound to: (510) 921-0193',
  elapsedTime = '00:00',
  transcriptItems = artifactTranscript,
  muted,
  defaultMuted = true,
  defaultToolExpanded = false,
  onMutedChange,
  onTakeover,
  className,
  ...props
}: CallAgentCardProps) {
  const [internalMuted, setInternalMuted] = useState(defaultMuted)
  const [toolExpanded, setToolExpanded] = useState(defaultToolExpanded)
  const toolRef = useRef<HTMLDivElement>(null)
  const isMuted = muted ?? internalMuted

  function toggleMuted() {
    const next = !isMuted
    if (muted === undefined) setInternalMuted(next)
    onMutedChange?.(next)
  }

  function toggleTool() {
    const next = !toolExpanded
    setToolExpanded(next)
    if (next) {
      window.setTimeout(() => {
        toolRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 100)
    }
  }

  return (
    <article
      {...props}
      aria-label="Live call card"
      className={[styles.card, className].filter(Boolean).join(' ')}
    >
      <div className={styles.content}>
        <div className={styles.statusBlock}>
          <div className={styles.statusRow}>
            <CallHealthBadge label="Tool failure" tone="error" />
          </div>
          {variant === 'sort-by-agent' ? (
            <button className={styles.agentLink} type="button">
              {agentName}
            </button>
          ) : null}
        </div>

        <div className={styles.callMeta}>
          <span>{directionLabel}</span>
          <time>{elapsedTime}</time>
        </div>

        <div className={styles.actions}>
          <button className={styles.takeover} onClick={onTakeover} type="button">
            <Headphones aria-hidden="true" />
            Take over conversation
          </button>
          <button
            aria-label={isMuted ? 'Unmute call' : 'Mute call'}
            aria-pressed={isMuted}
            className={styles.mute}
            onClick={toggleMuted}
            type="button"
          >
            {isMuted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
          </button>
        </div>

        <div aria-label="Call transcript" className={styles.transcript} role="region">
          {transcriptItems.map((item) => (
            <div
              className={[
                styles.transcriptRow,
                item.speaker === 'customer' ? styles.customerRow : styles.agentRow,
              ].join(' ')}
              key={item.id}
            >
              <div className={styles.transcriptLabel}>
                <strong>{item.label}</strong>
                <span aria-hidden="true">•</span>
                <time>{item.time}</time>
              </div>
              <p>{item.copy}</p>
            </div>
          ))}

          <div className={styles.tool} ref={toolRef}>
            <button
              aria-expanded={toolExpanded}
              className={[
                styles.toolTrigger,
                toolExpanded ? styles.toolTriggerExpanded : null,
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={toggleTool}
              type="button"
            >
              <LoaderCircle aria-hidden="true" className={styles.spinner} />
              <span>Performing tool • 00:10</span>
              <ChevronDown aria-hidden="true" className={styles.chevron} />
            </button>
            {toolExpanded ? (
              <div className={styles.toolBody}>
                <p>
                  Executing tool operation to complete the requested task. Processing
                  parameters and preparing response.
                </p>
                <strong>Parameters</strong>
                <ul>
                  <li>Operation: <span>Tool execution</span></li>
                  <li>Status: <span>In progress</span></li>
                  <li>Timeout: <span>30 seconds</span></li>
                </ul>
                <strong>Progress</strong>
                <ul>
                  <li>Initialization: <span>Complete</span></li>
                  <li>Processing: <span>75%</span></li>
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}
