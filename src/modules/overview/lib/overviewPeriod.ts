export type OverviewPreset = 'week' | 'month' | 'year'

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

/** Local calendar date as YYYY-MM-DD (no UTC shift). */
export function toLocalISODate(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

export function parseLocalISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** Week starts Monday; range inclusive. */
export function startOfWeekMonday(d: Date): Date {
  const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const dow = copy.getDay()
  const offset = dow === 0 ? -6 : 1 - dow
  copy.setDate(copy.getDate() + offset)
  return copy
}

export function endOfWeekMondayStart(d: Date): Date {
  const s = startOfWeekMonday(d)
  return new Date(s.getFullYear(), s.getMonth(), s.getDate() + 6)
}

export interface PeriodRange {
  start: string
  end: string
}

export function getPeriodRange(preset: OverviewPreset, anchor: Date): PeriodRange {
  if (preset === 'week') {
    const start = startOfWeekMonday(anchor)
    const end = endOfWeekMondayStart(anchor)
    return {
      start: toLocalISODate(start),
      end: toLocalISODate(end),
    }
  }

  if (preset === 'month') {
    const y = anchor.getFullYear()
    const m = anchor.getMonth() + 1
    const start = new Date(y, m - 1, 1)
    const end = new Date(y, m, 0)
    return {
      start: toLocalISODate(start),
      end: toLocalISODate(end),
    }
  }

  const y = anchor.getFullYear()
  return {
    start: `${y}-01-01`,
    end: `${y}-12-31`,
  }
}

export function shiftAnchor(preset: OverviewPreset, anchor: Date, delta: -1 | 1): Date {
  const copy = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate())

  if (preset === 'week') {
    copy.setDate(copy.getDate() + delta * 7)
    return copy
  }

  if (preset === 'month') {
    copy.setMonth(copy.getMonth() + delta)
    return copy
  }

  copy.setFullYear(copy.getFullYear() + delta)
  return copy
}

/** Ordered bucket keys covering the range (empty buckets included). */
export function listBucketKeys(preset: OverviewPreset, start: string, end: string): string[] {
  if (preset === 'year') {
    const y = Number(start.slice(0, 4))
    return Array.from({ length: 12 }, (_, i) => `${y}-${pad2(i + 1)}`)
  }

  const keys: string[] = []
  let cur = parseLocalISODate(start)
  const endD = parseLocalISODate(end)

  while (cur <= endD) {
    keys.push(toLocalISODate(cur))
    cur = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() + 1)
  }

  return keys
}

/** Normalize API dates so bucket keys match listBucketKeys (YYYY-MM-DD). */
export function normalizeTransactionDay(raw: string): string {
  if (!raw || typeof raw !== 'string') return ''
  const dateOnly = raw.includes('T') ? raw.slice(0, 10) : raw.trim().slice(0, 10)
  const m = dateOnly.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  if (m) {
    const y = Number(m[1])
    const mo = Number(m[2])
    const day = Number(m[3])
    return `${y}-${pad2(mo)}-${pad2(day)}`
  }
  const parsed = new Date(raw)
  if (Number.isNaN(parsed.getTime())) return dateOnly
  return toLocalISODate(parsed)
}

export function txBucketKey(date: string, preset: OverviewPreset): string {
  const day = normalizeTransactionDay(date)
  if (!day) return ''
  if (preset === 'year') return day.slice(0, 7)
  return day.slice(0, 10)
}

export function formatBucketLabel(bucketKey: string, preset: OverviewPreset, locale: string): string {
  if (preset === 'year') {
    const [y, m] = bucketKey.split('-').map(Number)
    return new Date(y, m - 1, 1).toLocaleDateString(locale, { month: 'short' })
  }

  const d = parseLocalISODate(bucketKey)
  if (preset === 'week') {
    return d.toLocaleDateString(locale, { weekday: 'short', day: 'numeric' })
  }

  if (preset === 'month') {
    return String(d.getDate())
  }

  return d.toLocaleDateString(locale, { month: 'short', day: 'numeric' })
}
