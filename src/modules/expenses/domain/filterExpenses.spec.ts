import { describe, expect, it } from 'vitest'
import type { ExpenseListRow } from './filterExpenses'
import { filterExpenseRows, isExpenseReorderEligible } from './filterExpenses'

function row(partial: Partial<ExpenseListRow> & Pick<ExpenseListRow, 'id'>): ExpenseListRow {
  return {
    date: '2026-10-10',
    amount: 10,
    categoryId: 1,
    categoryName: 'Food',
    accountId: 1,
    accountName: 'Bank Accounts',
    note: null,
    title: 'Groceries',
    dateLabel: 'Oct 10',
    ...partial,
  }
}

describe('filterExpenseRows', () => {
  const rows = [
    row({ id: 1, categoryId: 1, categoryName: 'Food', title: 'Groceries', date: '2026-10-05' }),
    row({ id: 2, categoryId: 2, categoryName: 'Rent', title: 'Apartment', date: '2026-10-12' }),
    row({ id: 3, categoryId: 1, categoryName: 'Food', title: 'Lunch', date: '2026-10-20', accountName: 'Cash' }),
  ]

  it('returns all rows with default filters', () => {
    expect(filterExpenseRows(rows)).toHaveLength(3)
  })

  it('filters by category', () => {
    expect(filterExpenseRows(rows, { categoryId: 1 }).map((r) => r.id)).toEqual([1, 3])
  })

  it('filters by date range (inclusive ISO strings)', () => {
    expect(filterExpenseRows(rows, { dateFrom: '2026-10-10', dateTo: '2026-10-15' }).map((r) => r.id)).toEqual([
      2,
    ])
  })

  it('filters by search across title, category, account, and date label', () => {
    expect(filterExpenseRows(rows, { searchQuery: 'cash' }).map((r) => r.id)).toEqual([3])
    expect(filterExpenseRows(rows, { searchQuery: 'rent' }).map((r) => r.id)).toEqual([2])
  })
})

describe('isExpenseReorderEligible', () => {
  it('is true only with default filters and more than one row', () => {
    expect(isExpenseReorderEligible({}, 2)).toBe(true)
    expect(isExpenseReorderEligible({}, 1)).toBe(false)
    expect(isExpenseReorderEligible({ searchQuery: 'food' }, 5)).toBe(false)
    expect(isExpenseReorderEligible({ categoryId: 1 }, 5)).toBe(false)
    expect(isExpenseReorderEligible({ dateFrom: '2026-10-01' }, 5)).toBe(false)
  })
})
