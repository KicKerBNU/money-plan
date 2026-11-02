import type { Page, Route } from '@playwright/test'

export type MockExpense = {
  id: number
  date: string
  amount: number
  categoryId: number
  categoryName: string
  accountId: number
  accountName: string
  note: string | null
  manualSort?: number | null
  recurringExpenseId?: number | null
}

export type MockRecurringExpense = {
  id: number
  amount: number
  categoryId: number
  categoryName: string
  accountId: number
  accountName: string
  note: string | null
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'semiannual' | 'yearly'
  startDate: string
  nextDate: string
  active: boolean
}

export type MockIncome = {
  id: number
  date: string
  amount: number
  accountId: number | null
  accountName: string | null
  note: string | null
  recurringIncomeId?: number | null
}

export type MockRecurringIncome = {
  id: number
  amount: number
  accountId: number
  accountName: string
  note: string | null
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'semiannual' | 'yearly'
  startDate: string
  nextDate: string
  active: boolean
}

function todayIsoDate() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function createDefaultExpense(overrides: Partial<MockExpense> = {}): MockExpense {
  return {
    id: 101,
    date: todayIsoDate(),
    amount: 42.5,
    categoryId: 1,
    categoryName: 'Food',
    accountId: 1,
    accountName: 'Cash',
    note: 'Lunch',
    manualSort: null,
    recurringExpenseId: null,
    ...overrides,
  }
}

export function createDefaultRecurringExpense(
  overrides: Partial<MockRecurringExpense> = {},
): MockRecurringExpense {
  const startDate = todayIsoDate()
  return {
    id: 301,
    amount: 99,
    categoryId: 1,
    categoryName: 'Food',
    accountId: 1,
    accountName: 'Cash',
    note: 'Netflix',
    frequency: 'monthly',
    startDate,
    nextDate: startDate,
    active: true,
    ...overrides,
  }
}

export function createDefaultIncome(overrides: Partial<MockIncome> = {}): MockIncome {
  return {
    id: 501,
    date: todayIsoDate(),
    amount: 3000,
    accountId: 1,
    accountName: 'Cash',
    note: 'Salary',
    recurringIncomeId: null,
    ...overrides,
  }
}

export function createDefaultRecurringIncome(
  overrides: Partial<MockRecurringIncome> = {},
): MockRecurringIncome {
  const startDate = todayIsoDate()
  return {
    id: 601,
    amount: 3000,
    accountId: 1,
    accountName: 'Cash',
    note: 'Monthly salary',
    frequency: 'monthly',
    startDate,
    nextDate: startDate,
    active: true,
    ...overrides,
  }
}

export type FinanceApiMockOptions = {
  expenses?: MockExpense[]
  recurringExpenses?: MockRecurringExpense[]
  incomes?: MockIncome[]
  recurringIncomes?: MockRecurringIncome[]
}

type MockState = {
  expenses: MockExpense[]
  recurringExpenses: MockRecurringExpense[]
  incomes: MockIncome[]
  recurringIncomes: MockRecurringIncome[]
  putBodies: unknown[]
  incomePutBodies: unknown[]
  recurringPutBodies: unknown[]
  recurringIncomePutBodies: unknown[]
  deletedIds: number[]
  deletedIncomeIds: number[]
  deletedRecurringIds: number[]
  deletedRecurringIncomeIds: number[]
}

async function json(route: Route, status: number, body: unknown) {
  await route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  })
}

// Match Vite env (incl. `.env.local`) and common local API ports. Scope mocks to API
// origins only so Firebase Auth emulator traffic is not intercepted.
const API_ORIGINS = [
  ...new Set(
    [
      process.env.VITE_API_BASE_URL,
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
    ]
      .filter((value): value is string => Boolean(value))
      .map((value) => value.replace(/\/$/, '')),
  ),
]

/**
 * Mocks Money Plan finance API so authenticated e2e can exercise UI without a
 * real backend (Auth emulator tokens are not accepted by production Firebase Admin).
 */
export async function installFinanceApiMock(
  page: Page,
  seedOrOptions: MockExpense[] | FinanceApiMockOptions = [createDefaultExpense()],
) {
  const options: FinanceApiMockOptions = Array.isArray(seedOrOptions)
    ? { expenses: seedOrOptions }
    : seedOrOptions

  const state: MockState = {
    expenses: (options.expenses ?? [createDefaultExpense()]).map((e) => ({ ...e })),
    recurringExpenses: (options.recurringExpenses ?? []).map((e) => ({ ...e })),
    incomes: (options.incomes ?? []).map((e) => ({ ...e })),
    recurringIncomes: (options.recurringIncomes ?? []).map((e) => ({ ...e })),
    putBodies: [],
    incomePutBodies: [],
    recurringPutBodies: [],
    recurringIncomePutBodies: [],
    deletedIds: [],
    deletedIncomeIds: [],
    deletedRecurringIds: [],
    deletedRecurringIncomeIds: [],
  }

  const accounts = [{ id: 1, name: 'Cash', isDefault: true, initialBalance: 0, currentBalance: 0 }]
  const categories = [
    { id: 1, name: 'Food', isDefault: true },
    { id: 2, name: 'Transport', isDefault: true },
  ]

  const handleFinanceApi = async (route: Route) => {
    const request = route.request()
    const method = request.method().toUpperCase()
    const url = new URL(request.url())
    const path = url.pathname.replace(/\/$/, '')

    if (method === 'GET' && path.includes('/v1/stats/overview-summary')) {
      return json(route, 200, {
        data: {
          startDate: url.searchParams.get('startDate') ?? '2026-01-01',
          endDate: url.searchParams.get('endDate') ?? '2026-01-31',
          bucket: url.searchParams.get('bucket') ?? 'day',
          totalIncome: 0,
          totalExpenses: 0,
          incomeCount: 0,
          expenseCount: 0,
          categories: [],
          series: [],
        },
      })
    }
    if (method === 'GET' && path.endsWith('/v1/accounts')) {
      return json(route, 200, { data: accounts })
    }
    if (method === 'GET' && path.endsWith('/v1/categories')) {
      return json(route, 200, { data: categories })
    }
    if (method === 'GET' && path.endsWith('/v1/recurring-expenses')) {
      return json(route, 200, { data: state.recurringExpenses })
    }
    if (method === 'GET' && path.endsWith('/v1/recurring-incomes')) {
      return json(route, 200, { data: state.recurringIncomes })
    }
    if (method === 'GET' && path.endsWith('/v1/incomes')) {
      return json(route, 200, { data: state.incomes })
    }
    if (method === 'GET' && path.includes('/v1/expenses') && !path.includes('recurring')) {
      return json(route, 200, { data: state.expenses })
    }

    const recurringExpenseMatch = path.match(/\/v1\/recurring-expenses\/(\d+)$/)
    if (recurringExpenseMatch) {
      const id = Number(recurringExpenseMatch[1])

      if (method === 'PUT') {
        const body = request.postDataJSON() as {
          amount: number
          categoryId: number
          accountId: number
          note?: string
          frequency: MockRecurringExpense['frequency']
          startDate: string
        }
        state.recurringPutBodies.push(body)
        const category = categories.find((c) => c.id === body.categoryId)
        const account = accounts.find((a) => a.id === body.accountId)
        const previous = state.recurringExpenses.find((e) => e.id === id)
        const updated: MockRecurringExpense = {
          id,
          amount: body.amount,
          categoryId: body.categoryId,
          categoryName: category?.name ?? previous?.categoryName ?? 'Food',
          accountId: body.accountId,
          accountName: account?.name ?? previous?.accountName ?? 'Cash',
          note: body.note?.trim() ? body.note.trim() : null,
          frequency: body.frequency,
          startDate: body.startDate,
          nextDate: previous?.nextDate ?? body.startDate,
          active: previous?.active ?? true,
        }
        state.recurringExpenses = state.recurringExpenses.map((e) => (e.id === id ? updated : e))
        return json(route, 200, { data: updated })
      }

      if (method === 'PATCH') {
        const body = request.postDataJSON() as { active?: boolean }
        const previous = state.recurringExpenses.find((e) => e.id === id)
        if (!previous) return json(route, 404, { message: 'Not found' })
        const updated = { ...previous, active: body.active ?? previous.active }
        state.recurringExpenses = state.recurringExpenses.map((e) => (e.id === id ? updated : e))
        return json(route, 200, { data: updated })
      }

      if (method === 'DELETE') {
        state.deletedRecurringIds.push(id)
        state.recurringExpenses = state.recurringExpenses.filter((e) => e.id !== id)
        return route.fulfill({ status: 204, body: '' })
      }

      if (method === 'GET') {
        const item = state.recurringExpenses.find((e) => e.id === id)
        if (!item) return json(route, 404, { message: 'Not found' })
        return json(route, 200, { data: item })
      }
    }

    const recurringIncomeMatch = path.match(/\/v1\/recurring-incomes\/(\d+)$/)
    if (recurringIncomeMatch) {
      const id = Number(recurringIncomeMatch[1])

      if (method === 'PUT') {
        const body = request.postDataJSON() as {
          amount: number
          accountId: number
          note?: string
          frequency: MockRecurringIncome['frequency']
          startDate: string
        }
        state.recurringIncomePutBodies.push(body)
        const account = accounts.find((a) => a.id === body.accountId)
        const previous = state.recurringIncomes.find((e) => e.id === id)
        const updated: MockRecurringIncome = {
          id,
          amount: body.amount,
          accountId: body.accountId,
          accountName: account?.name ?? previous?.accountName ?? 'Cash',
          note: body.note?.trim() ? body.note.trim() : null,
          frequency: body.frequency,
          startDate: body.startDate,
          nextDate: previous?.nextDate ?? body.startDate,
          active: previous?.active ?? true,
        }
        state.recurringIncomes = state.recurringIncomes.map((e) => (e.id === id ? updated : e))
        return json(route, 200, { data: updated })
      }

      if (method === 'PATCH') {
        const body = request.postDataJSON() as { active?: boolean }
        const previous = state.recurringIncomes.find((e) => e.id === id)
        if (!previous) return json(route, 404, { message: 'Not found' })
        const updated = { ...previous, active: body.active ?? previous.active }
        state.recurringIncomes = state.recurringIncomes.map((e) => (e.id === id ? updated : e))
        return json(route, 200, { data: updated })
      }

      if (method === 'DELETE') {
        state.deletedRecurringIncomeIds.push(id)
        state.recurringIncomes = state.recurringIncomes.filter((e) => e.id !== id)
        return route.fulfill({ status: 204, body: '' })
      }

      if (method === 'GET') {
        const item = state.recurringIncomes.find((e) => e.id === id)
        if (!item) return json(route, 404, { message: 'Not found' })
        return json(route, 200, { data: item })
      }
    }

    const incomeMatch = path.match(/\/v1\/incomes\/(\d+)$/)
    if (incomeMatch) {
      const id = Number(incomeMatch[1])

      if (method === 'PUT') {
        const body = request.postDataJSON() as {
          date: string
          amount: number
          accountId: number
          note?: string
        }
        state.incomePutBodies.push(body)
        const account = accounts.find((a) => a.id === body.accountId)
        const previous = state.incomes.find((e) => e.id === id)
        const updated: MockIncome = {
          id,
          date: body.date,
          amount: body.amount,
          accountId: body.accountId,
          accountName: account?.name ?? previous?.accountName ?? 'Cash',
          note: body.note?.trim() ? body.note.trim() : null,
          recurringIncomeId: previous?.recurringIncomeId ?? null,
        }
        state.incomes = state.incomes.map((e) => (e.id === id ? updated : e))
        return json(route, 200, { data: updated })
      }

      if (method === 'DELETE') {
        state.deletedIncomeIds.push(id)
        state.incomes = state.incomes.filter((e) => e.id !== id)
        return route.fulfill({ status: 204, body: '' })
      }
    }

    const expenseMatch = path.match(/\/v1\/expenses\/(\d+)$/)
    if (method === 'PUT' && expenseMatch) {
      const id = Number(expenseMatch[1])
      const body = request.postDataJSON() as {
        date: string
        amount: number
        categoryId: number
        accountId: number
        note?: string
      }
      state.putBodies.push(body)

      const category = categories.find((c) => c.id === body.categoryId)
      const account = accounts.find((a) => a.id === body.accountId)
      const previous = state.expenses.find((e) => e.id === id)
      const updated: MockExpense = {
        id,
        date: body.date,
        amount: body.amount,
        categoryId: body.categoryId,
        categoryName: category?.name ?? previous?.categoryName ?? 'Food',
        accountId: body.accountId,
        accountName: account?.name ?? previous?.accountName ?? 'Cash',
        note: body.note?.trim() ? body.note.trim() : null,
        manualSort: previous?.manualSort ?? null,
        recurringExpenseId: previous?.recurringExpenseId ?? null,
      }
      state.expenses = state.expenses.map((e) => (e.id === id ? updated : e))
      return json(route, 200, { data: updated })
    }

    if (method === 'DELETE' && expenseMatch) {
      const id = Number(expenseMatch[1])
      state.deletedIds.push(id)
      state.expenses = state.expenses.filter((e) => e.id !== id)
      return route.fulfill({ status: 204, body: '' })
    }

    return json(route, 200, { data: [] })
  }

  for (const origin of API_ORIGINS) {
    await page.route(`${origin}/v1/**`, handleFinanceApi)
  }

  return state
}
