import type { Account } from '@/modules/expenses/domain/expenses.types'

/** Matches seeded default account name (backend migration targets this exact label). */
const BANK_ACCOUNTS_NAMES = ['Bank Accounts', 'Bank Account']

export function getDefaultAccountId(accounts: Account[]): number | undefined {
  if (!accounts.length) return undefined
  const flagged = accounts.find((a) => a.isDefault)
  if (flagged) return flagged.id
  for (const name of BANK_ACCOUNTS_NAMES) {
    const match = accounts.find(
      (a) => a.name.localeCompare(name, undefined, { sensitivity: 'accent' }) === 0,
    )
    if (match) return match.id
  }
  return accounts[0].id
}
