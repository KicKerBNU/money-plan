const STORAGE_PREFIX = 'money-plan-expense-chat-ai-consent'

function storageKey(uid: string) {
  return `${STORAGE_PREFIX}:${uid}`
}

export function hasExpenseChatAIConsent(uid: string): boolean {
  if (typeof localStorage === 'undefined') return false
  return localStorage.getItem(storageKey(uid)) === '1'
}

export function grantExpenseChatAIConsent(uid: string): void {
  localStorage.setItem(storageKey(uid), '1')
}

export function revokeExpenseChatAIConsent(uid: string): void {
  localStorage.removeItem(storageKey(uid))
}
