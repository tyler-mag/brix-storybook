import type { CallPlaybackEvent } from './CallPlayback'

export const artifactPlaybackEvents: CallPlaybackEvent[] = [
  { id: 'tool', start: 80, end: 85, label: '{tool} used', color: '#4B7163' },
  {
    id: 'negative-sentiment',
    start: 120,
    end: 125,
    label: 'Negative sentiment detected',
    color: '#DC6803',
  },
  {
    id: 'user-escalation',
    start: 130,
    end: 135,
    label: 'User escalation',
    color: '#D92D20',
  },
  {
    id: 'takeover',
    start: 140,
    end: 185,
    label: 'User took over conversation',
    color: '#DC6803',
  },
]

