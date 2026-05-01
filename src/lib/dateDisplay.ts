/** Calendar month label for filters / nav (month is 1–12). */
export function formatMonthYear(locale: string, year: number, month: number): string {
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
    new Date(year, month - 1, 1)
  )
}
