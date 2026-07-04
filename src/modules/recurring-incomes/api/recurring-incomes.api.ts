import { apiFetch } from '@/lib/api'
import type { RecurrenceFrequency } from '@/modules/expenses/domain/expenses.types'
import type { RecurringIncome } from '@/modules/income/domain/income.types'

interface DataResponse<T> {
  data: T
}

export async function fetchRecurringIncomes() {
  const response = await apiFetch<DataResponse<RecurringIncome[]>>('/v1/recurring-incomes')
  return response.data
}

export async function fetchRecurringIncome(id: number) {
  const response = await apiFetch<DataResponse<RecurringIncome>>(`/v1/recurring-incomes/${id}`)
  return response.data
}

export async function setRecurringIncomeActive(id: number, active: boolean) {
  const response = await apiFetch<DataResponse<RecurringIncome>>(`/v1/recurring-incomes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ active }),
  })
  return response.data
}

export async function updateRecurringIncome(
  id: number,
  payload: {
    amount: number
    accountId: number
    note?: string
    frequency: RecurrenceFrequency
    startDate: string
  },
) {
  const response = await apiFetch<DataResponse<RecurringIncome>>(`/v1/recurring-incomes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  return response.data
}

export async function deleteRecurringIncome(id: number) {
  await apiFetch<void>(`/v1/recurring-incomes/${id}`, {
    method: 'DELETE',
    headers: {},
  })
}
