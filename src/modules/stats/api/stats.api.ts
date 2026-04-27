import { apiFetch } from '@/lib/api'
import type { MonthlyExpensesStats } from '../domain/stats.types'

interface DataResponse<T> {
  data: T
}

export async function fetchMonthlyExpensesStats(year: number, month: number) {
  const response = await apiFetch<DataResponse<MonthlyExpensesStats>>(
    `/v1/stats/monthly-expenses?year=${year}&month=${month}`
  )
  return response.data
}
