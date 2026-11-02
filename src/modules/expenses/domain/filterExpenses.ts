import type { Expense } from './expenses.types'

/** UI row built from an Expense for list filtering / display. */
export interface ExpenseListRow extends Expense {
  title: string
  dateLabel: string
}

export interface ExpenseListFilters {
  searchQuery?: string
  categoryId?: number | 'all'
  dateFrom?: string
  dateTo?: string
}

/** Pure filter used by the expenses screen (kept out of the Vue SFC for unit tests). */
export function filterExpenseRows(
  rows: ExpenseListRow[],
  filters: ExpenseListFilters = {},
): ExpenseListRow[] {
  const query = filters.searchQuery?.trim().toLowerCase() ?? ''
  const categoryId = filters.categoryId ?? 'all'
  const dateFrom = filters.dateFrom ?? ''
  const dateTo = filters.dateTo ?? ''

  return rows.filter((expense) => {
    const matchesCategory = categoryId === 'all' || expense.categoryId === categoryId
    const matchesDateFrom = !dateFrom || expense.date >= dateFrom
    const matchesDateTo = !dateTo || expense.date <= dateTo
    const matchesSearch =
      !query ||
      [expense.title, expense.categoryName, expense.accountName, expense.dateLabel].some((value) =>
        value.toLowerCase().includes(query),
      )

    return matchesCategory && matchesDateFrom && matchesDateTo && matchesSearch
  })
}

export function isExpenseReorderEligible(
  filters: ExpenseListFilters,
  filteredCount: number,
): boolean {
  const query = filters.searchQuery?.trim() ?? ''
  const categoryId = filters.categoryId ?? 'all'
  return (
    !query &&
    categoryId === 'all' &&
    !filters.dateFrom &&
    !filters.dateTo &&
    filteredCount > 1
  )
}
