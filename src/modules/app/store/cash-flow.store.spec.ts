import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useCashFlowStore } from './cash-flow.store'

const fetchExpensesByPeriod = vi.fn()
const fetchIncomesByPeriod = vi.fn()

vi.mock('@/modules/expenses/api/expenses.api', () => ({
  fetchExpensesByPeriod: (...args: unknown[]) => fetchExpensesByPeriod(...args),
}))

vi.mock('@/modules/income/api/income.api', () => ({
  fetchIncomesByPeriod: (...args: unknown[]) => fetchIncomesByPeriod(...args),
}))

describe('useCashFlowStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    fetchExpensesByPeriod.mockReset()
    fetchIncomesByPeriod.mockReset()
  })

  it('dedupes concurrent getExpensesForPeriod calls for the same month', async () => {
    let resolveFetch!: (value: {
      rows: Array<{ amount: number }>
      meta: { limit: number; returned: number; truncated: boolean }
    }) => void
    fetchExpensesByPeriod.mockReturnValue(
      new Promise((resolve) => {
        resolveFetch = resolve
      }),
    )

    const store = useCashFlowStore()
    const a = store.getExpensesForPeriod(2026, 11)
    const b = store.getExpensesForPeriod(2026, 11)

    expect(fetchExpensesByPeriod).toHaveBeenCalledTimes(1)

    resolveFetch({
      rows: [{ amount: 10 }, { amount: 5 }],
      meta: { limit: 500, returned: 2, truncated: false },
    })
    const [rowsA, rowsB] = await Promise.all([a, b])
    expect(rowsA).toEqual(rowsB)
    expect(rowsA).toHaveLength(2)

    const cached = await store.getExpensesForPeriod(2026, 11)
    expect(fetchExpensesByPeriod).toHaveBeenCalledTimes(1)
    expect(cached).toEqual(rowsA)
  })

  it('shares period data so refresh can derive net without a second pair of fetches', async () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1

    fetchExpensesByPeriod.mockResolvedValue({
      rows: [{ amount: 40 }],
      meta: { limit: 500, returned: 1, truncated: false },
    })
    fetchIncomesByPeriod.mockResolvedValue({
      rows: [{ amount: 100 }, { amount: 20 }],
      meta: { limit: 500, returned: 2, truncated: false },
    })

    const store = useCashFlowStore()
    await Promise.all([
      store.getExpensesForPeriod(year, month),
      store.getIncomesForPeriod(year, month),
      store.refresh(),
    ])

    expect(fetchExpensesByPeriod).toHaveBeenCalledTimes(1)
    expect(fetchIncomesByPeriod).toHaveBeenCalledTimes(1)
    expect(store.cashFlowNet).toBe(80)
  })

  it('force refresh bypasses the cache', async () => {
    fetchExpensesByPeriod
      .mockResolvedValueOnce({
        rows: [{ amount: 10 }],
        meta: { limit: 500, returned: 1, truncated: false },
      })
      .mockResolvedValueOnce({
        rows: [{ amount: 25 }],
        meta: { limit: 500, returned: 1, truncated: false },
      })
    fetchIncomesByPeriod
      .mockResolvedValueOnce({
        rows: [{ amount: 50 }],
        meta: { limit: 500, returned: 1, truncated: false },
      })
      .mockResolvedValueOnce({
        rows: [{ amount: 50 }],
        meta: { limit: 500, returned: 1, truncated: false },
      })

    const store = useCashFlowStore()
    await store.refresh()
    expect(store.cashFlowNet).toBe(40)

    await store.refresh({ force: true })
    expect(fetchExpensesByPeriod).toHaveBeenCalledTimes(2)
    expect(fetchIncomesByPeriod).toHaveBeenCalledTimes(2)
    expect(store.cashFlowNet).toBe(25)
  })

  it('seedPeriod updates sidebar net for the calendar month', () => {
    const store = useCashFlowStore()
    const { year, month } = store.calendarYearMonth()

    store.seedPeriod(year, month, {
      expenses: [{ amount: 30 } as never],
      incomes: [{ amount: 90 } as never],
    })

    expect(store.cashFlowNet).toBe(60)
  })

  it('tracks list truncation meta from the API', async () => {
    fetchExpensesByPeriod.mockResolvedValue({
      rows: [{ amount: 1 }],
      meta: { limit: 500, returned: 500, truncated: true },
    })

    const store = useCashFlowStore()
    await store.getExpensesForPeriod(2026, 11)

    expect(store.isExpensesTruncated(2026, 11)).toBe(true)
    expect(store.isIncomesTruncated(2026, 11)).toBe(false)
  })
})
