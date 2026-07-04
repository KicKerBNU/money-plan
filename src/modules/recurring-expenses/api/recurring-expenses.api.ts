import { apiFetch } from '@/lib/api'
import type { RecurrenceFrequency, RecurringExpense } from '@/modules/expenses/domain/expenses.types'

interface DataResponse<T> {
  data: T
}

export async function fetchRecurringExpenses() {
  const response = await apiFetch<DataResponse<RecurringExpense[]>>('/v1/recurring-expenses')
  return response.data
}

export async function fetchRecurringExpense(id: number) {
  const response = await apiFetch<DataResponse<RecurringExpense>>(`/v1/recurring-expenses/${id}`)
  return response.data
}

export async function setRecurringExpenseActive(id: number, active: boolean) {
  const response = await apiFetch<DataResponse<RecurringExpense>>(`/v1/recurring-expenses/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ active }),
  })
  return response.data
}

export async function updateRecurringExpense(
  id: number,
  payload: {
    amount: number
    categoryId: number
    accountId: number
    note?: string
    frequency: RecurrenceFrequency
    startDate: string
  },
) {
  const response = await apiFetch<DataResponse<RecurringExpense>>(`/v1/recurring-expenses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  return response.data
}

export async function deleteRecurringExpense(id: number) {
  await apiFetch<void>(`/v1/recurring-expenses/${id}`, {
    method: 'DELETE',
    headers: {},
  })
}
