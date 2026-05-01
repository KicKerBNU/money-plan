export interface IncomeEntry {
  id: number
  date: string
  amount: number
  accountId: number | null
  accountName: string | null
  note: string | null
}
