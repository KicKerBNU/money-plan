import type { ComposerTranslation } from 'vue-i18n'

/** Extract Firebase Auth error code from thrown values (FirebaseError uses `.code`). */
export function getFirebaseAuthErrorCode(error: unknown): string | null {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code: unknown }).code
    if (typeof code === 'string' && code.startsWith('auth/')) {
      return code
    }
  }

  if (error instanceof Error) {
    const match = error.message.match(/auth\/[a-z0-9-]+/i)
    return match?.[0] ?? null
  }

  return null
}

/** Dev-only: non-default localhost port must be in Google OAuth authorized origins. */
export function getLocalDevGoogleOriginHint(): string | null {
  if (typeof window === 'undefined') return null

  const { hostname, port } = window.location
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') return null
  if (!port || port === '80' || port === '443') return null

  return `http://${hostname}:${port}`
}

export type AuthLoginProvider = 'google' | 'apple' | 'email'

export function getFirebaseAuthLoginErrorMessage(
  error: unknown,
  t: ComposerTranslation,
  provider: AuthLoginProvider = 'email',
): string {
  const code = getFirebaseAuthErrorCode(error)

  switch (code) {
    case 'auth/popup-closed-by-user':
      return t('auth.login.errors.popupClosed')
    case 'auth/popup-blocked':
      return t('auth.login.errors.popupBlocked')
    case 'auth/unauthorized-domain':
      return provider === 'apple'
        ? t('auth.login.errors.unauthorizedDomainApple')
        : t('auth.login.errors.unauthorizedDomain')
    case 'auth/operation-not-allowed':
      if (provider === 'apple') return t('auth.login.errors.operationNotAllowedApple')
      if (provider === 'google') return t('auth.login.errors.operationNotAllowedGoogle')
      return t('auth.login.errors.operationNotAllowed')
    case 'auth/network-request-failed':
      return t('auth.login.errors.networkFailed')
    case 'auth/internal-error':
      if (provider === 'apple') return t('auth.login.errors.internalErrorApple')
      if (provider === 'google') {
        const origin = getLocalDevGoogleOriginHint()
        if (origin) return t('auth.login.errors.localDevOrigin', { origin })
      }
      return t('auth.login.errors.internalError')
    case 'auth/argument-error':
      if (provider === 'apple') return t('auth.login.errors.argumentErrorApple')
      if (provider === 'google') {
        const origin = getLocalDevGoogleOriginHint()
        if (origin) return t('auth.login.errors.localDevOrigin', { origin })
      }
      return t('auth.login.errors.argumentErrorGoogle')
    case 'auth/invalid-credential':
      if (provider === 'apple') return t('auth.login.errors.invalidCredentialApple')
      return t('auth.login.errors.invalidCredential')
    case 'auth/account-exists-with-different-credential':
      return t('auth.login.errors.accountExistsDifferentCredential')
    case 'auth/email-already-in-use':
      return t('auth.login.errors.emailInUse')
    case 'auth/weak-password':
      return t('auth.login.errors.weakPassword')
    case 'auth/invalid-email':
      return t('auth.login.errors.invalidEmail')
    default:
      break
  }

  if (code) {
    return t('auth.login.errors.withCode', { code })
  }

  return t('auth.login.errors.generic')
}
