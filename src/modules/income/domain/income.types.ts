import type { RecurrenceFrequency } from '@/modules/expenses/domain/expenses.types'

export interface IncomeEntry {
  id: number
  date: string
  amount: number
  accountId: number | null
  accountName: string | null
  note: string | null
  recurringIncomeId?: number | null
}

export interface RecurringIncome {
  id: number
  amount: number
  accountId: number
  accountName: string
  note: string | null
  frequency: RecurrenceFrequency
  startDate: string
  nextDate: string
  active: boolean
}
