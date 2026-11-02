import { describe, expect, it, vi } from 'vitest'
import {
  getFirebaseAuthErrorCode,
  getFirebaseAuthLoginErrorMessage,
  getLocalDevGoogleOriginHint,
} from './firebase-auth-error'

describe('getFirebaseAuthErrorCode', () => {
  it('reads auth/* from an object with .code', () => {
    expect(getFirebaseAuthErrorCode({ code: 'auth/popup-closed-by-user' })).toBe(
      'auth/popup-closed-by-user',
    )
  })

  it('ignores non-auth codes on objects', () => {
    expect(getFirebaseAuthErrorCode({ code: 'storage/unauthorized' })).toBeNull()
  })

  it('parses auth/* out of an Error message', () => {
    expect(getFirebaseAuthErrorCode(new Error('Firebase: Error (auth/invalid-email).'))).toBe(
      'auth/invalid-email',
    )
  })

  it('returns null for unrelated values', () => {
    expect(getFirebaseAuthErrorCode(null)).toBeNull()
    expect(getFirebaseAuthErrorCode('boom')).toBeNull()
    expect(getFirebaseAuthErrorCode(new Error('network down'))).toBeNull()
  })
})

describe('getLocalDevGoogleOriginHint', () => {
  it('returns null when window is unavailable (node unit tests)', () => {
    expect(getLocalDevGoogleOriginHint()).toBeNull()
  })
})

describe('getFirebaseAuthLoginErrorMessage', () => {
  const t = vi.fn((key: string, params?: Record<string, string>) =>
    params ? `${key}:${JSON.stringify(params)}` : key,
  ) as unknown as Parameters<typeof getFirebaseAuthLoginErrorMessage>[1]

  it('maps known codes to i18n keys', () => {
    expect(getFirebaseAuthLoginErrorMessage({ code: 'auth/popup-closed-by-user' }, t)).toBe(
      'auth.login.errors.popupClosed',
    )
    expect(getFirebaseAuthLoginErrorMessage({ code: 'auth/invalid-email' }, t)).toBe(
      'auth.login.errors.invalidEmail',
    )
  })

  it('uses Apple-specific copy for unauthorized-domain', () => {
    expect(
      getFirebaseAuthLoginErrorMessage({ code: 'auth/unauthorized-domain' }, t, 'apple'),
    ).toBe('auth.login.errors.unauthorizedDomainApple')
  })

  it('returns withCode when the code is unknown but present', () => {
    expect(getFirebaseAuthLoginErrorMessage({ code: 'auth/something-new' }, t)).toBe(
      'auth.login.errors.withCode:{"code":"auth/something-new"}',
    )
  })

  it('returns generic when there is no code', () => {
    expect(getFirebaseAuthLoginErrorMessage(new Error('nope'), t)).toBe('auth.login.errors.generic')
  })
})
