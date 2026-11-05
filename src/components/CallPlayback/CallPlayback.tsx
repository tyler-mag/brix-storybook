import { useEffect, useRef, useState } from 'react'
import type { ComponentPropsWithoutRef, PointerEvent as ReactPointerEvent } from 'react'
import { artifactPlaybackEvents } from './artifactPlaybackEvents'
import { formatCallTime } from './formatCallTime'
import styles from './CallPlayback.module.css'

export interface CallPlaybackEvent {
  id: string
  start: number
  end: number
  label: string
  color: string
}

export interface CallPlaybackProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  duration?: number
  initialTime?: number
  events?: CallPlaybackEvent[]
  onSeek?: (time: number, event?: CallPlaybackEvent) => void
  onPlayingChange?: (playing: boolean) => void
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function CallPlayback({
  duration = 185,
  initialTime = 0,
  events = artifactPlaybackEvents,
  onSeek,
  onPlayingChange,
  className,
  ...props
}: CallPlaybackProps) {
  const safeDuration = Math.max(1, duration)
  const [currentTime, setCurrentTime] = useState(() =>
    clamp(initialTime, 0, safeDuration),
  )
  const [playing, setPlaying] = useState(false)
  const [dragging, setDragging] = useState(false)
  const timelineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      setCurrentTime((time) => {
        const next = Math.min(time + 1, safeDuration)
        if (next === safeDuration) {
          setPlaying(false)
          onPlayingChange?.(false)
        }
        return next
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [onPlayingChange, playing, safeDuration])

  function timeFromPointer(clientX: number) {
    const rect = timelineRef.current?.getBoundingClientRect()
    if (!rect) return currentTime
    return clamp(((clientX - rect.left) / rect.width) * safeDuration, 0, safeDuration)
  }

  function seek(time: number, event?: CallPlaybackEvent) {
    const next = clamp(time, 0, safeDuration)
    setCurrentTime(next)
    onSeek?.(next, event)
  }

  function startPlayback() {
    setPlaying(true)
    onPlayingChange?.(true)
  }

  function seekAndPlay(time: number, event?: CallPlaybackEvent) {
    seek(time, event)
    startPlayback()
  }

  function togglePlayback() {
    const next = !playing
    if (next && currentTime >= safeDuration) seek(0)
    setPlaying(next)
    onPlayingChange?.(next)
  }

  function handleTrackPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget && event.target !== timelineRef.current) return
    seekAndPlay(timeFromPointer(event.clientX))
  }

  function handleDragStart(event: ReactPointerEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragging(true)
    seek(timeFromPointer(event.clientX))
  }

  function handleDragMove(event: ReactPointerEvent<HTMLButtonElement>) {
    if (!dragging) return
    seek(timeFromPointer(event.clientX))
  }

  function handleDragEnd(event: ReactPointerEvent<HTMLButtonElement>) {
    if (!dragging) return
    seek(timeFromPointer(event.clientX))
    setDragging(false)
    startPlayback()
  }

  function handleSliderKey(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const delta = event.key === 'ArrowRight' ? 5 : -5
    seekAndPlay(currentTime + delta)
  }

  return (
    <div {...props} className={[styles.player, className].filter(Boolean).join(' ')}>
      <button
        aria-label={playing ? 'Pause' : 'Play'}
        className={styles.playButton}
        onClick={togglePlayback}
        type="button"
      >
        <span aria-hidden="true" className={playing ? styles.pauseIcon : styles.playIcon} />
      </button>

      <div className={styles.timelineColumn}>
        <div
          className={styles.timeline}
          onPointerDown={handleTrackPointerDown}
          ref={timelineRef}
        >
          <span
            aria-hidden="true"
            className={styles.progress}
            style={{ width: `${(currentTime / safeDuration) * 100}%` }}
          />
          {events.map((event) => {
            const start = clamp(event.start, 0, safeDuration)
            const end = clamp(event.end, start, safeDuration)
            return (
              <button
                aria-label={`${event.label} at ${formatCallTime(start)}`}
                className={styles.eventRange}
                data-tooltip={event.label}
                key={event.id}
                onClick={() => seekAndPlay(start, event)}
                style={{
                  left: `${(start / safeDuration) * 100}%`,
                  width: `${((end - start) / safeDuration) * 100}%`,
                  backgroundColor: event.color,
                }}
                type="button"
              />
            )
          })}
          <button
            aria-label="Playback position"
            aria-valuemax={safeDuration}
            aria-valuemin={0}
            aria-valuenow={Math.round(currentTime)}
            aria-valuetext={`${formatCallTime(currentTime)} of ${formatCallTime(safeDuration)}`}
            className={[styles.handle, dragging ? styles.dragging : null]
              .filter(Boolean)
              .join(' ')}
            onKeyDown={handleSliderKey}
            onPointerDown={handleDragStart}
            onPointerMove={handleDragMove}
            onPointerUp={handleDragEnd}
            role="slider"
            style={{ left: `${(currentTime / safeDuration) * 100}%` }}
            type="button"
          />
        </div>
      </div>

      <output className={styles.time}>
        {formatCallTime(currentTime)} / {formatCallTime(safeDuration)}
      </output>
    </div>
  )
}
