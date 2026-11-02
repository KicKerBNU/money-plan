/** Sync `<html lang>` with the active vue-i18n locale (a11y / screen readers). */
export function syncDocumentLang(locale: string) {
  if (typeof document === 'undefined') return
  document.documentElement.lang = locale || 'en-US'
}
