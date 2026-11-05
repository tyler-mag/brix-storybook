export const brixTokens = {
  color: {
    brand: {
      weakest: '#E5FBF1',
      default: '#2F7D61',
      stronger: '#24614E',
      strongest: '#243B34',
      ai: '#2FDF85',
    },
    surface: {
      canvas: '#FCFCFC',
      subtle: '#F7F7F7',
      raised: '#FFFFFF',
    },
    text: {
      primary: '#2E2E2E',
      secondary: '#5E5E5E',
      muted: '#717171',
    },
  },
  radius: {
    control: 8,
    surface: 12,
    pill: 999,
  },
  motion: {
    fast: 120,
    standard: 180,
    slow: 320,
  },
} as const

export type BrixTokens = typeof brixTokens
