import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ListMeta } from '@/lib/list-meta'
import { fetchExpensesByPeriod } from '@/modules/expenses/api/expenses.api'
import type { Expense } from '@/modules/expenses/domain/expenses.types'
import { fetchIncomesByPeriod } from '@/modules/income/api/income.api'
import type { IncomeEntry } from '@/modules/income/domain/income.types'

type PeriodKey = `${number}-${number}`

function periodKey(year: number, month: number): PeriodKey {
  return `${year}-${month}`
}

function sumAmounts(rows: Array<{ amount: number }>) {
  return rows.reduce((sum, row) => sum + row.amount, 0)
}

/**
 * Shared current-month cash-flow + period caches for expenses/income lists.
 * Concurrent callers for the same `{year,month}` share one in-flight request.
 */
export const useCashFlowStore = defineStore('cashFlow', () => {
  const cashFlowNet = ref<number | null>(null)
  const loading = ref(true)

  const expensesByPeriod = new Map<PeriodKey, Expense[]>()
  const incomesByPeriod = new Map<PeriodKey, IncomeEntry[]>()
  const expensesMetaByPeriod = new Map<PeriodKey, ListMeta>()
  const incomesMetaByPeriod = new Map<PeriodKey, ListMeta>()
  const expensesInflight = new Map<PeriodKey, Promise<Expense[]>>()
  const incomesInflight = new Map<PeriodKey, Promise<IncomeEntry[]>>()

  function calendarYearMonth() {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() + 1 }
  }

  function syncNetFromCache(year: number, month: number) {
    const key = periodKey(year, month)
    const expenses = expensesByPeriod.get(key)
    const incomes = incomesByPeriod.get(key)
    if (!expenses || !incomes) return false
    cashFlowNet.value = sumAmounts(incomes) - sumAmounts(expenses)
    return true
  }

  function syncCalendarNetFromCache() {
    const { year, month } = calendarYearMonth()
    return syncNetFromCache(year, month)
  }

  function invalidatePeriod(year: number, month: number) {
    const key = periodKey(year, month)
    expensesByPeriod.delete(key)
    incomesByPeriod.delete(key)
    expensesMetaByPeriod.delete(key)
    incomesMetaByPeriod.delete(key)
  }

  /** Seed cache after a local mutation / page load so sidebar net stays in sync without a refetch. */
  function seedPeriod(
    year: number,
    month: number,
    data: { expenses?: Expense[]; incomes?: IncomeEntry[] },
  ) {
    const key = periodKey(year, month)
    if (data.expenses) expensesByPeriod.set(key, data.expenses)
    if (data.incomes) incomesByPeriod.set(key, data.incomes)

    const { year: calYear, month: calMonth } = calendarYearMonth()
    if (year === calYear && month === calMonth) {
      syncNetFromCache(year, month)
    }
  }

  function isExpensesTruncated(year: number, month: number) {
    return expensesMetaByPeriod.get(periodKey(year, month))?.truncated === true
  }

  function isIncomesTruncated(year: number, month: number) {
    return incomesMetaByPeriod.get(periodKey(year, month))?.truncated === true
  }

  async function getExpensesForPeriod(
    year: number,
    month: number,
    options?: { force?: boolean },
  ): Promise<Expense[]> {
    const key = periodKey(year, month)
    if (options?.force) {
      expensesByPeriod.delete(key)
      expensesMetaByPeriod.delete(key)
    } else {
      const cached = expensesByPeriod.get(key)
      if (cached) return cached
      const inflight = expensesInflight.get(key)
      if (inflight) return inflight
    }

    const request = fetchExpensesByPeriod(year, month)
      .then((listed) => {
        expensesByPeriod.set(key, listed.rows)
        expensesMetaByPeriod.set(key, listed.meta)
        return listed.rows
      })
      .finally(() => {
        expensesInflight.delete(key)
      })

    expensesInflight.set(key, request)
    return request
  }

  async function getIncomesForPeriod(
    year: number,
    month: number,
    options?: { force?: boolean },
  ): Promise<IncomeEntry[]> {
    const key = periodKey(year, month)
    if (options?.force) {
      incomesByPeriod.delete(key)
      incomesMetaByPeriod.delete(key)
    } else {
      const cached = incomesByPeriod.get(key)
      if (cached) return cached
      const inflight = incomesInflight.get(key)
      if (inflight) return inflight
    }

    const request = fetchIncomesByPeriod(year, month)
      .then((listed) => {
        incomesByPeriod.set(key, listed.rows)
        incomesMetaByPeriod.set(key, listed.meta)
        return listed.rows
      })
      .finally(() => {
        incomesInflight.delete(key)
      })

    incomesInflight.set(key, request)
    return request
  }

  async function refresh(options?: { force?: boolean }) {
    loading.value = true
    const { year, month } = calendarYearMonth()
    try {
      if (options?.force) {
        invalidatePeriod(year, month)
      } else if (syncNetFromCache(year, month)) {
        return
      }

      const [expenses, incomes] = await Promise.all([
        getExpensesForPeriod(year, month, options),
        getIncomesForPeriod(year, month, options),
      ])
      cashFlowNet.value = sumAmounts(incomes) - sumAmounts(expenses)
    } catch {
      cashFlowNet.value = null
    } finally {
      loading.value = false
    }
  }

  return {
    cashFlowNet,
    loading,
    refresh,
    calendarYearMonth,
    getExpensesForPeriod,
    getIncomesForPeriod,
    isExpensesTruncated,
    isIncomesTruncated,
    seedPeriod,
    invalidatePeriod,
    syncCalendarNetFromCache,
  }
})
