/** True when Google sign-in should use redirect (popup is unreliable on iOS / installed PWA). */
export function preferRedirectAuth() {
  if (typeof window === 'undefined') return false

  const standalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true

  const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  return standalone || mobile
}
