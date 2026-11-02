export interface MonthlyCategoryTotal {
  categoryId: number
  categoryName: string
  totalAmount: number
  entryCount: number
}

export interface MonthlyExpensesStats {
  period: { year: number; month: number }
  total: number
  categories: MonthlyCategoryTotal[]
}

export type OverviewBucket = 'day' | 'month'

export interface OverviewCategoryTotal {
  categoryId: number
  categoryName: string
  totalAmount: number
}

export interface OverviewSeriesPoint {
  key: string
  income: number
  expenses: number
}

export interface OverviewSummary {
  startDate: string
  endDate: string
  bucket: OverviewBucket
  totalIncome: number
  totalExpenses: number
  incomeCount: number
  expenseCount: number
  categories: OverviewCategoryTotal[]
  series: OverviewSeriesPoint[]
}
