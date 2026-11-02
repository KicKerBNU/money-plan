import { describe, expect, it } from 'vitest'
import type { Account } from '@/modules/expenses/domain/expenses.types'
import { getDefaultAccountId } from './defaultAccount'

function account(partial: Partial<Account> & Pick<Account, 'id' | 'name'>): Account {
  return {
    isDefault: false,
    initialBalance: 0,
    currentBalance: 0,
    ...partial,
  }
}

describe('getDefaultAccountId', () => {
  it('returns undefined for an empty list', () => {
    expect(getDefaultAccountId([])).toBeUndefined()
  })

  it('prefers the account flagged isDefault', () => {
    const accounts = [
      account({ id: 1, name: 'Cash' }),
      account({ id: 2, name: 'Card', isDefault: true }),
      account({ id: 3, name: 'Bank Accounts' }),
    ]
    expect(getDefaultAccountId(accounts)).toBe(2)
  })

  it('falls back to seeded Bank Accounts by name', () => {
    const accounts = [
      account({ id: 1, name: 'Cash' }),
      account({ id: 3, name: 'Bank Accounts' }),
    ]
    expect(getDefaultAccountId(accounts)).toBe(3)
  })

  it('accepts singular Bank Account name', () => {
    const accounts = [account({ id: 9, name: 'Bank Account' })]
    expect(getDefaultAccountId(accounts)).toBe(9)
  })

  it('falls back to the first account when nothing matches', () => {
    const accounts = [
      account({ id: 4, name: 'Wallet' }),
      account({ id: 5, name: 'Savings' }),
    ]
    expect(getDefaultAccountId(accounts)).toBe(4)
  })
})
