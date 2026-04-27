import { apiFetch } from '@/lib/api'
import type { IncomeEntry } from '../domain/income.types'

interface DataResponse<T> {
  data: T
}

export async function fetchIncomes() {
  const response = await apiFetch<DataResponse<IncomeEntry[]>>('/v1/incomes')
  return response.data
}

export async function createIncome(payload: { date: string; amount: number; note?: string }) {
  const response = await apiFetch<DataResponse<IncomeEntry>>('/v1/incomes', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return response.data
}
