import { computed, ref } from 'vue'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

// Module-level so the listener is registered as soon as this file is imported,
// ensuring we don't miss the beforeinstallprompt event.
const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
const isInstalled = ref(false)

if (typeof window !== 'undefined') {
  isInstalled.value =
    window.matchMedia('(display-mode: standalone)').matches ||
    (('standalone' in navigator) && (navigator as { standalone?: boolean }).standalone === true)

  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault()
    deferredPrompt.value = e as BeforeInstallPromptEvent
  })

  window.addEventListener('appinstalled', () => {
    deferredPrompt.value = null
    isInstalled.value = true
  })
}

export function usePwaInstall() {
  const isIOS = computed(
    () =>
      typeof navigator !== 'undefined' &&
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !('MSStream' in window),
  )

  const canPrompt = computed(() => deferredPrompt.value !== null)

  async function promptInstall() {
    if (!deferredPrompt.value) return
    await deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice
    if (outcome === 'accepted') {
      deferredPrompt.value = null
      isInstalled.value = true
    }
  }

  return { canPrompt, isIOS, isInstalled, promptInstall }
}
