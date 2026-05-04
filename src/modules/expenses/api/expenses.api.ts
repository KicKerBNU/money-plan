import { apiFetch } from '@/lib/api'
import type { Account, Category, Expense } from '../domain/expenses.types'

interface DataResponse<T> {
  data: T
}

export async function fetchExpenses() {
  const response = await apiFetch<DataResponse<Expense[]>>('/v1/expenses')
  return response.data
}

export async function fetchExpensesByPeriod(year: number, month: number) {
  const response = await apiFetch<DataResponse<Expense[]>>(`/v1/expenses?year=${year}&month=${month}`)
  return response.data
}

export async function reorderExpensesForMonth(year: number, month: number, orderedIds: number[]) {
  const response = await apiFetch<DataResponse<Expense[]>>('/v1/expenses/order', {
    method: 'PATCH',
    body: JSON.stringify({ year, month, orderedIds }),
  })
  return response.data
}

export async function fetchExpensesByDateRange(startDate: string, endDate: string) {
  const q = new URLSearchParams({ startDate, endDate })
  const response = await apiFetch<DataResponse<Expense[]>>(`/v1/expenses?${q.toString()}`)
  return response.data
}

export async function fetchAccounts() {
  const response = await apiFetch<DataResponse<Account[]>>('/v1/accounts')
  return response.data
}

export async function fetchCategories() {
  const response = await apiFetch<DataResponse<Category[]>>('/v1/categories')
  return response.data
}

export async function createExpense(payload: {
  date: string
  amount: number
  categoryId: number
  accountId: number
  note?: string
}) {
  const response = await apiFetch<DataResponse<Expense>>('/v1/expenses', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return response.data
}

export async function updateExpense(
  expenseId: number,
  payload: { date: string; amount: number; categoryId: number; accountId: number; note?: string }
) {
  const response = await apiFetch<DataResponse<Expense>>(`/v1/expenses/${expenseId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  return response.data
}

export async function deleteExpense(expenseId: number) {
  await apiFetch<void>(`/v1/expenses/${expenseId}`, {
    method: 'DELETE',
    headers: {},
  })
}

export async function createAccount(name: string) {
  const response = await apiFetch<DataResponse<Account>>('/v1/accounts', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
  return response.data
}

export async function updateAccount(accountId: number, payload: { name: string; initialBalance?: number }) {
  const response = await apiFetch<DataResponse<Account>>(`/v1/accounts/${accountId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  return response.data
}

export async function setAccountDefault(accountId: number) {
  const response = await apiFetch<DataResponse<Account>>(`/v1/accounts/${accountId}/default`, {
    method: 'PATCH',
    body: JSON.stringify({}),
  })
  return response.data
}

export async function deleteAccount(accountId: number) {
  await apiFetch<void>(`/v1/accounts/${accountId}`, {
    method: 'DELETE',
    headers: {},
  })
}

export async function createCategory(name: string) {
  const response = await apiFetch<DataResponse<Category>>('/v1/categories', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
  return response.data
}

export async function updateCategory(categoryId: number, name: string) {
  const response = await apiFetch<DataResponse<Category>>(`/v1/categories/${categoryId}`, {
    method: 'PUT',
    body: JSON.stringify({ name }),
  })
  return response.data
}

export async function deleteCategory(categoryId: number) {
  await apiFetch<void>(`/v1/categories/${categoryId}`, {
    method: 'DELETE',
    headers: {},
  })
}
