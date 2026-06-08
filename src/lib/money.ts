import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePreferencesStore } from '@/modules/preferences/store/preferences.store'

/**
 * ISO 3166-1 alpha-2 region → ISO 4217 currency.
 * Covers the regions most relevant to this app's users; everything else falls back to USD.
 * Update as new markets adopt the product.
 */
const REGION_CURRENCY: Record<string, string> = {
  // Eurozone
  AT: 'EUR', BE: 'EUR', CY: 'EUR', DE: 'EUR', EE: 'EUR', ES: 'EUR', FI: 'EUR',
  FR: 'EUR', GR: 'EUR', HR: 'EUR', IE: 'EUR', IT: 'EUR', LT: 'EUR', LU: 'EUR',
  LV: 'EUR', MT: 'EUR', NL: 'EUR', PT: 'EUR', SI: 'EUR', SK: 'EUR',
  // Americas
  US: 'USD', CA: 'CAD', BR: 'BRL', MX: 'MXN', AR: 'ARS', CL: 'CLP', CO: 'COP', PE: 'PEN',
  // UK & other Europe
  GB: 'GBP', CH: 'CHF', SE: 'SEK', NO: 'NOK', DK: 'DKK', PL: 'PLN', CZ: 'CZK',
  HU: 'HUF', RO: 'RON', BG: 'BGN', UA: 'UAH', RU: 'RUB', TR: 'TRY',
  // Asia-Pacific
  JP: 'JPY', CN: 'CNY', HK: 'HKD', TW: 'TWD', KR: 'KRW', SG: 'SGD', MY: 'MYR',
  TH: 'THB', VN: 'VND', PH: 'PHP', ID: 'IDR', IN: 'INR', AU: 'AUD', NZ: 'NZD',
  // Middle East & Africa
  AE: 'AED', SA: 'SAR', IL: 'ILS', EG: 'EGP', ZA: 'ZAR', NG: 'NGN', KE: 'KES',
}

export const SUPPORTED_CURRENCIES = [
  'USD', 'EUR', 'BRL', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'CNY', 'INR', 'MXN',
] as const

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number]

/**
 * Resolve the currency that best matches a BCP-47 locale tag.
 *
 * Strategy:
 *   1. If the locale carries a region (`pt-PT` → `PT`), use the lookup table.
 *   2. Else, try `Intl.Locale(...).maximize()` to expand a language-only tag
 *      (e.g. `pt` → `pt-Latn-BR`) and use that region.
 *   3. Fall back to USD if nothing matches.
 */
export function detectCurrencyFromLocale(locale: string): string {
  if (!locale) return 'USD'

  try {
    const parts = new Intl.Locale(locale)
    const explicit = parts.region
    if (explicit && REGION_CURRENCY[explicit]) return REGION_CURRENCY[explicit]

    const maximized = parts.maximize().region
    if (maximized && REGION_CURRENCY[maximized]) return REGION_CURRENCY[maximized]
  } catch {
    /* Intl.Locale may throw on malformed tags — fall through to USD. */
  }

  return 'USD'
}

export interface MoneyFormatOptions {
  /** Force absolute value; default true so callers can format signed numbers themselves. */
  absolute?: boolean
  /** When the value is a whole number we drop the decimals; pass `true` to keep them. */
  alwaysCents?: boolean
}

export interface UseMoney {
  /** Reactive currency (preference override → locale default). */
  currency: ComputedRef<string>
  /** Reactive BCP-47 locale tag from `vue-i18n`. */
  locale: ComputedRef<string>
  format: (value: number, options?: MoneyFormatOptions) => string
  /** `+$10.50` / `−$10.50`. */
  formatSigned: (value: number, options?: MoneyFormatOptions) => string
}

/**
 * Single source of truth for money formatting across the app.
 * Always import this instead of building a local `Intl.NumberFormat`.
 */
export function useMoney(): UseMoney {
  const { locale } = useI18n()
  const prefs = usePreferencesStore()

  const currency = computed(() => prefs.currency ?? detectCurrencyFromLocale(locale.value))

  function format(value: number, options: MoneyFormatOptions = {}) {
    const { absolute = true, alwaysCents = false } = options
    const raw = absolute ? Math.abs(value) : value
    const hasCents = alwaysCents || !Number.isInteger(Math.abs(value))
    return new Intl.NumberFormat(locale.value, {
      style: 'currency',
      currency: currency.value,
      minimumFractionDigits: hasCents ? 2 : 0,
      maximumFractionDigits: 2,
    }).format(raw)
  }

  function formatSigned(value: number, options: MoneyFormatOptions = {}) {
    const formatted = format(value, { ...options, absolute: true })
    if (value === 0) return formatted
    return `${value >= 0 ? '+' : '−'}${formatted}`
  }

  return {
    currency: computed(() => currency.value),
    locale: computed(() => locale.value),
    format,
    formatSigned,
  }
}
