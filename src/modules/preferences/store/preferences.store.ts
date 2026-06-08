import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const CURRENCY_KEY = 'money-plan-currency'

/**
 * Lightweight user preferences persisted in localStorage.
 *
 * Today only stores the currency override. Anything that should sync across devices
 * eventually needs to move to a backend user-preferences endpoint (see Scalability
 * roadmap in money-plan-backend/README.md).
 */
export const usePreferencesStore = defineStore('preferences', () => {
  const currency = ref<string | null>(readCurrency())

  watch(currency, (value) => {
    if (value) localStorage.setItem(CURRENCY_KEY, value)
    else localStorage.removeItem(CURRENCY_KEY)
  })

  /** `null` resets to the auto-detected currency from the user's locale. */
  function setCurrency(next: string | null) {
    currency.value = next && next.trim() ? next.toUpperCase() : null
  }

  return {
    currency,
    setCurrency,
  }
})

function readCurrency(): string | null {
  try {
    const raw = localStorage.getItem(CURRENCY_KEY)
    if (!raw) return null
    const trimmed = raw.trim().toUpperCase()
    return /^[A-Z]{3}$/.test(trimmed) ? trimmed : null
  } catch {
    return null
  }
}
