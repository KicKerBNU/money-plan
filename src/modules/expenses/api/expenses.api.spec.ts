import { beforeEach, describe, expect, it, vi } from 'vitest'

const apiFetch = vi.fn()

vi.mock('@/lib/api', () => ({
  apiFetch: (...args: unknown[]) => apiFetch(...args),
}))

describe('expenses.api', () => {
  beforeEach(() => {
    vi.resetModules()
    apiFetch.mockReset()
  })

  it('fetchExpensesByPeriod unwraps data and builds the query string', async () => {
    apiFetch.mockResolvedValue({ data: [{ id: 1, amount: 12 }] })
    const { fetchExpensesByPeriod } = await import('./expenses.api')

    const rows = await fetchExpensesByPeriod(2026, 10)

    expect(rows).toEqual([{ id: 1, amount: 12 }])
    expect(apiFetch).toHaveBeenCalledWith('/v1/expenses?year=2026&month=10')
  })

  it('fetchExpensesByDateRange sends startDate and endDate', async () => {
    apiFetch.mockResolvedValue({ data: [] })
    const { fetchExpensesByDateRange } = await import('./expenses.api')

    await fetchExpensesByDateRange('2026-10-01', '2026-10-31')

    expect(apiFetch).toHaveBeenCalledWith('/v1/expenses?startDate=2026-10-01&endDate=2026-10-31')
  })

  it('createExpense POSTs the payload and returns data', async () => {
    const created = { id: 9, amount: 22, categoryId: 1, accountId: 1, date: '2026-10-08', note: null }
    apiFetch.mockResolvedValue({ data: created })
    const { createExpense } = await import('./expenses.api')

    const result = await createExpense({
      date: '2026-10-08',
      amount: 22,
      categoryId: 1,
      accountId: 1,
    })

    expect(result).toEqual(created)
    expect(apiFetch).toHaveBeenCalledWith('/v1/expenses', {
      method: 'POST',
      body: JSON.stringify({
        date: '2026-10-08',
        amount: 22,
        categoryId: 1,
        accountId: 1,
      }),
    })
  })

  it('deleteExpense issues DELETE', async () => {
    apiFetch.mockResolvedValue(undefined)
    const { deleteExpense } = await import('./expenses.api')

    await deleteExpense(42)

    expect(apiFetch).toHaveBeenCalledWith('/v1/expenses/42', {
      method: 'DELETE',
      headers: {},
    })
  })

  it('reorderExpensesForMonth PATCHes ordered ids', async () => {
    apiFetch.mockResolvedValue({ data: [{ id: 2 }, { id: 1 }] })
    const { reorderExpensesForMonth } = await import('./expenses.api')

    const rows = await reorderExpensesForMonth(2026, 10, [2, 1])

    expect(rows).toEqual([{ id: 2 }, { id: 1 }])
    expect(apiFetch).toHaveBeenCalledWith('/v1/expenses/order', {
      method: 'PATCH',
      body: JSON.stringify({ year: 2026, month: 10, orderedIds: [2, 1] }),
    })
  })
})
