import { describe, expect, it } from 'vitest'
import {
  endOfWeekMondayStart,
  formatBucketLabel,
  getPeriodRange,
  listBucketKeys,
  normalizeTransactionDay,
  parseLocalISODate,
  shiftAnchor,
  startOfWeekMonday,
  toLocalISODate,
  txBucketKey,
} from './overviewPeriod'

describe('toLocalISODate / parseLocalISODate', () => {
  it('round-trips a local calendar date without UTC shift', () => {
    const d = new Date(2026, 9, 15) // Oct 15 local
    expect(toLocalISODate(d)).toBe('2026-10-15')
    expect(toLocalISODate(parseLocalISODate('2026-10-15'))).toBe('2026-10-15')
  })
})

describe('week helpers (Monday start)', () => {
  it('starts the week on Monday for a Wednesday', () => {
    // 2026-10-14 is Wednesday
    const wed = new Date(2026, 9, 14)
    expect(toLocalISODate(startOfWeekMonday(wed))).toBe('2026-10-12')
    expect(toLocalISODate(endOfWeekMondayStart(wed))).toBe('2026-10-18')
  })

  it('treats Sunday as end of the week that started previous Monday', () => {
    // 2026-10-18 is Sunday
    const sun = new Date(2026, 9, 18)
    expect(toLocalISODate(startOfWeekMonday(sun))).toBe('2026-10-12')
  })
})

describe('getPeriodRange', () => {
  it('returns inclusive week bounds', () => {
    expect(getPeriodRange('week', new Date(2026, 9, 14))).toEqual({
      start: '2026-10-12',
      end: '2026-10-18',
    })
  })

  it('returns full calendar month', () => {
    expect(getPeriodRange('month', new Date(2026, 1, 10))).toEqual({
      start: '2026-02-01',
      end: '2026-02-28',
    })
  })

  it('returns full calendar year', () => {
    expect(getPeriodRange('year', new Date(2026, 6, 1))).toEqual({
      start: '2026-01-01',
      end: '2026-12-31',
    })
  })
})

describe('shiftAnchor', () => {
  it('shifts by week / month / year', () => {
    const anchor = new Date(2026, 9, 15)
    expect(toLocalISODate(shiftAnchor('week', anchor, 1))).toBe('2026-10-22')
    expect(toLocalISODate(shiftAnchor('week', anchor, -1))).toBe('2026-10-08')
    expect(toLocalISODate(shiftAnchor('month', anchor, 1))).toBe('2026-11-15')
    expect(toLocalISODate(shiftAnchor('year', anchor, -1))).toBe('2025-10-15')
  })
})

describe('listBucketKeys', () => {
  it('lists each day in a week range', () => {
    expect(listBucketKeys('week', '2026-10-12', '2026-10-18')).toEqual([
      '2026-10-12',
      '2026-10-13',
      '2026-10-14',
      '2026-10-15',
      '2026-10-16',
      '2026-10-17',
      '2026-10-18',
    ])
  })

  it('lists 12 month keys for a year preset', () => {
    const keys = listBucketKeys('year', '2026-01-01', '2026-12-31')
    expect(keys).toHaveLength(12)
    expect(keys[0]).toBe('2026-01')
    expect(keys[11]).toBe('2026-12')
  })
})

describe('normalizeTransactionDay / txBucketKey', () => {
  it('normalizes ISO datetime and padded day numbers', () => {
    expect(normalizeTransactionDay('2026-10-05T12:00:00.000Z')).toBe('2026-10-05')
    expect(normalizeTransactionDay('2026-9-5')).toBe('2026-09-05')
    expect(normalizeTransactionDay('')).toBe('')
  })

  it('buckets by day or month depending on preset', () => {
    expect(txBucketKey('2026-10-05', 'month')).toBe('2026-10-05')
    expect(txBucketKey('2026-10-05', 'year')).toBe('2026-10')
  })
})

describe('formatBucketLabel', () => {
  it('formats year buckets as short month names', () => {
    const label = formatBucketLabel('2026-03', 'year', 'en-US')
    expect(label.toLowerCase()).toContain('mar')
  })

  it('formats month buckets as day-of-month numbers', () => {
    expect(formatBucketLabel('2026-10-15', 'month', 'en-US')).toBe('15')
  })
})
