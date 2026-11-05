import type { CallTranscriptItem } from './CallAgentCard'

export const artifactTranscript: CallTranscriptItem[] = [
  {
    id: 'agent-intro',
    speaker: 'agent',
    label: 'Agent',
    time: '00:01',
    copy: 'Hello this is name calling to give you a heads up about Trailer 482 at Wesco Distribution. It has been on site for 44 hours. It\'s approaching the 48-hour SLA limit — consider scheduling pickup soon to avoid detention fees',
  },
  {
    id: 'customer-reply',
    speaker: 'customer',
    label: 'Customer',
    time: '00:03',
    copy: 'Customer voice transcription',
  },
  {
    id: 'agent-response',
    speaker: 'agent',
    label: 'Agent',
    time: '00:10',
    copy: 'response',
  },
]

