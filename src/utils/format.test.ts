import { describe, expect, it } from 'vitest'

import { formatCapability, formatDate, formatPlanLabel, formatRelativeTime } from '@/utils/format'

describe('format helpers', () => {
  it('formats plan labels', () => {
    expect(formatPlanLabel('free')).toBe('Free')
    expect(formatPlanLabel('plus')).toBe('Plus')
    expect(formatPlanLabel('pro')).toBe('Pro')
    expect(formatPlanLabel('pro_max')).toBe('Pro max')
  })

  it('formats capability names', () => {
    expect(formatCapability('chat')).toBe('Chat request')
    expect(formatCapability('image')).toBe('Image generation')
  })

  it('formats dates and handles missing values', () => {
    expect(formatDate('2026-07-04T00:00:00.000Z')).toContain('2026')
    expect(formatDate(null)).toBe('Not available')
  })

  it('formats recent relative times', () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()

    expect(formatRelativeTime(fiveMinutesAgo)).toBe('5m ago')
    expect(formatRelativeTime('not-a-date')).toBe('Unknown time')
  })
})
