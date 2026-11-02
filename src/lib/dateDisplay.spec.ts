import { describe, expect, it } from 'vitest'
import { formatMonthYear } from './dateDisplay'

describe('formatMonthYear', () => {
  it('formats month 1–12 as a long month + year for en-US', () => {
    expect(formatMonthYear('en-US', 2026, 1)).toBe('January 2026')
    expect(formatMonthYear('en-US', 2026, 10)).toBe('October 2026')
  })

  it('formats for pt-BR', () => {
    const label = formatMonthYear('pt-BR', 2026, 3)
    expect(label.toLowerCase()).toContain('2026')
    expect(label.toLowerCase()).toMatch(/mar/)
  })
})
