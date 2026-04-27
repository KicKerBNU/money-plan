export interface MonthlyCategoryTotal {
  categoryId: number
  categoryName: string
  totalAmount: number
}

export interface MonthlyExpensesStats {
  period: { year: number; month: number }
  total: number
  categories: MonthlyCategoryTotal[]
}
