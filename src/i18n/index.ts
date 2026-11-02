import { createI18n } from 'vue-i18n'
import { syncDocumentLang } from './document-lang'
import enUS from './locales/en-US'
import ptBR from './locales/pt-BR'

export const SUPPORTED_LOCALES = ['en-US', 'pt-BR'] as const

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

const LOCALE_KEY = 'money-plan-locale'

export function isSupportedLocale(value: string): value is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value)
}

function readStoredLocale(): SupportedLocale | null {
  try {
    const raw = localStorage.getItem(LOCALE_KEY)
    if (!raw) return null
    return isSupportedLocale(raw) ? raw : null
  } catch {
    return null
  }
}

function detectLocale(): SupportedLocale {
  const stored = readStoredLocale()
  if (stored) return stored

  const browserLocales = navigator.languages?.length ? navigator.languages : [navigator.language]

  for (const browserLocale of browserLocales) {
    // exact match (e.g. "pt-BR" → "pt-BR")
    const exact = SUPPORTED_LOCALES.find((l) => l === browserLocale)
    if (exact) return exact

    // language-only match (e.g. "pt" or "pt-PT" → "pt-BR")
    const lang = browserLocale.split('-')[0]
    const partial = SUPPORTED_LOCALES.find((l) => l.startsWith(lang + '-'))
    if (partial) return partial
  }

  return 'en-US'
}

export const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'en-US',
  messages: {
    'en-US': enUS,
    'pt-BR': ptBR,
  },
})

/** Persist locale preference and update vue-i18n + `<html lang>`. */
export function setAppLocale(locale: SupportedLocale) {
  i18n.global.locale.value = locale
  try {
    localStorage.setItem(LOCALE_KEY, locale)
  } catch {
    /* private mode / blocked storage */
  }
  syncDocumentLang(locale)
}

export { syncDocumentLang }

/** Call once at app boot so the initial locale is reflected on `<html>`. */
export function initDocumentLang() {
  syncDocumentLang(String(i18n.global.locale.value))
}
