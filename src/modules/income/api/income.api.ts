import { apiFetch } from '@/lib/api'
import { normalizeListMeta, type ListedRows } from '@/lib/list-meta'
import type { RecurrenceFrequency } from '@/modules/expenses/domain/expenses.types'
import type { IncomeEntry } from '../domain/income.types'

interface DataResponse<T> {
  data: T
}

interface ListDataResponse<T> {
  data: T
  meta?: {
    limit: number
    returned: number
    truncated: boolean
  }
}

export async function fetchIncomes(): Promise<ListedRows<IncomeEntry>> {
  const response = await apiFetch<ListDataResponse<IncomeEntry[]>>('/v1/incomes')
  return { rows: response.data, meta: normalizeListMeta(response.data, response.meta) }
}

export async function fetchIncomesByPeriod(
  year: number,
  month: number,
): Promise<ListedRows<IncomeEntry>> {
  const response = await apiFetch<ListDataResponse<IncomeEntry[]>>(
    `/v1/incomes?year=${year}&month=${month}`,
  )
  return { rows: response.data, meta: normalizeListMeta(response.data, response.meta) }
}

export async function fetchIncomesByDateRange(
  startDate: string,
  endDate: string,
): Promise<ListedRows<IncomeEntry>> {
  const q = new URLSearchParams({ startDate, endDate })
  const response = await apiFetch<ListDataResponse<IncomeEntry[]>>(`/v1/incomes?${q.toString()}`)
  return { rows: response.data, meta: normalizeListMeta(response.data, response.meta) }
}

export async function createIncome(payload: {
  date: string
  amount: number
  accountId: number
  note?: string
  recurrenceFrequency?: RecurrenceFrequency
}) {
  const response = await apiFetch<DataResponse<IncomeEntry>>('/v1/incomes', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return response.data
}

export async function updateIncome(
  incomeId: number,
  payload: {
    date: string
    amount: number
    accountId: number
    note?: string
    recurrenceEnabled?: boolean
    recurrenceFrequency?: RecurrenceFrequency
  },
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
