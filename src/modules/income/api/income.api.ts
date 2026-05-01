import { apiFetch } from '@/lib/api'
import type { IncomeEntry } from '../domain/income.types'

interface DataResponse<T> {
  data: T
}

export async function fetchIncomes() {
  const response = await apiFetch<DataResponse<IncomeEntry[]>>('/v1/incomes')
  return response.data
}

export async function fetchIncomesByPeriod(year: number, month: number) {
  const response = await apiFetch<DataResponse<IncomeEntry[]>>(`/v1/incomes?year=${year}&month=${month}`)
  return response.data
}

export async function createIncome(payload: { date: string; amount: number; accountId: number; note?: string }) {
  const response = await apiFetch<DataResponse<IncomeEntry>>('/v1/incomes', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return response.data
}

export async function updateIncome(
  incomeId: number,
  payload: { date: string; amount: number; accountId: number; note?: string }
) {
  const response = await apiFetch<DataResponse<IncomeEntry>>(`/v1/incomes/${incomeId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  return response.data
}

export async function deleteIncome(incomeId: number) {
  await apiFetch<void>(`/v1/incomes/${incomeId}`, {
    method: 'DELETE',
    headers: {},
  })
}
