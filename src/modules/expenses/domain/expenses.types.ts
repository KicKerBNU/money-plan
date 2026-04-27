export interface Account {
  id: number
  name: string
  isDefault: boolean
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
}
