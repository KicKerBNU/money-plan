import { describe, expect, it } from 'vitest'
import { detectCurrencyFromLocale } from './money'

describe('detectCurrencyFromLocale', () => {
  it('returns USD for empty or missing locale', () => {
    expect(detectCurrencyFromLocale('')).toBe('USD')
  })

  it('uses an explicit region from the locale tag', () => {
    expect(detectCurrencyFromLocale('pt-BR')).toBe('BRL')
    expect(detectCurrencyFromLocale('en-US')).toBe('USD')
    expect(detectCurrencyFromLocale('en-GB')).toBe('GBP')
    expect(detectCurrencyFromLocale('de-DE')).toBe('EUR')
  })

  it('maximizes language-only tags when possible', () => {
    expect(detectCurrencyFromLocale('pt')).toBe('BRL')
  })

  it('falls back to USD for unknown regions', () => {
    expect(detectCurrencyFromLocale('en-XX')).toBe('USD')
  })

  it('falls back to USD for malformed tags', () => {
    expect(detectCurrencyFromLocale('!!!')).toBe('USD')
  })
})
