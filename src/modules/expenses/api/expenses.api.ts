import { apiFetch } from '@/lib/api'
import type { Account, Category, Expense } from '../domain/expenses.types'

interface DataResponse<T> {
  data: T
}

export async function fetchExpenses() {
  const response = await apiFetch<DataResponse<Expense[]>>('/v1/expenses')
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

export async function createAccount(name: string) {
  const response = await apiFetch<DataResponse<Account>>('/v1/accounts', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
  return response.data
}

export async function createCategory(name: string) {
  const response = await apiFetch<DataResponse<Category>>('/v1/categories', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
  return response.data
}
