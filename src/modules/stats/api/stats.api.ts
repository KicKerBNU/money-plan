import { apiFetch } from '@/lib/api'
import type { MonthlyExpensesStats, OverviewBucket, OverviewSummary } from '../domain/stats.types'

interface DataResponse<T> {
  data: T
}

export async function fetchMonthlyExpensesStats(year: number, month: number) {
  const response = await apiFetch<DataResponse<MonthlyExpensesStats>>(
    `/v1/stats/monthly-expenses?year=${year}&month=${month}`,
  )
  return response.data
}

export async function fetchOverviewSummary(
  startDate: string,
  endDate: string,
  bucket: OverviewBucket,
) {
  const q = new URLSearchParams({ startDate, endDate, bucket })
  const response = await apiFetch<DataResponse<OverviewSummary>>(
    `/v1/stats/overview-summary?${q.toString()}`,
  )
  return response.data
}
