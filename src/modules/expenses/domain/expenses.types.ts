export interface Account {
  id: number
  name: string
  isDefault: boolean
  initialBalance: number
  currentBalance: number
}

export interface Category {
  id: number
  name: string
  isDefault: boolean
}

export interface Expense {
  id: number
  date: string
  amount: number
  categoryId: number
  categoryName: string
  accountId: number
  accountName: string
  note: string | null
  /** Present after user reorders list for a month; drives API sort order with date fallback. */
  manualSort?: number | null
}
