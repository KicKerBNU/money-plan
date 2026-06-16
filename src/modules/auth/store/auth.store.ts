import { defineStore } from 'pinia'
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User,
} from 'firebase/auth'
import { computed, ref } from 'vue'
import { preferRedirectAuth } from '@/lib/auth-platform'
import { firebaseAuth } from '@/plugins/firebase'
import { deleteUserAccount } from '@/modules/auth/api/auth.api'

const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

const appleProvider = new OAuthProvider('apple.com')
appleProvider.addScope('email')
appleProvider.addScope('name')

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const ready = ref(false)
  let bootstrapPromise: Promise<void> | null = null
  let visibilityListenerAttached = false

  function init(): Promise<void> {
    if (bootstrapPromise) return bootstrapPromise

    bootstrapPromise = (async () => {
      try {
        await getRedirectResult(firebaseAuth)
      } catch {
        // No pending redirect result.
      }

      await new Promise<void>((resolve) => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
          user.value = currentUser
          ready.value = true
          unsubscribe()
          resolve()
        })
      })
    })()

    if (typeof document !== 'undefined' && !visibilityListenerAttached) {
      visibilityListenerAttached = true
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState !== 'visible') return
        const currentUser = firebaseAuth.currentUser
        if (!currentUser) return
        void currentUser.getIdToken(true)
      })
    }

    return bootstrapPromise
  }

  async function loginWithGoogle() {
    if (preferRedirectAuth()) {
      await signInWithRedirect(firebaseAuth, googleProvider)
      return
    }
    await signInWithPopup(firebaseAuth, googleProvider)
  }

  async function loginWithApple() {
    if (preferRedirectAuth()) {
      await signInWithRedirect(firebaseAuth, appleProvider)
      return
    }
    await signInWithPopup(firebaseAuth, appleProvider)
  }

  async function loginWithEmail(email: string, password: string) {
    await signInWithEmailAndPassword(firebaseAuth, email, password)
  }

  async function createAccountWithEmail(email: string, password: string) {
    await createUserWithEmailAndPassword(firebaseAuth, email, password)
  }

  async function logout() {
    await signOut(firebaseAuth)
  }

  async function deleteAccount() {
    await deleteUserAccount()
    await signOut(firebaseAuth)
  }

  return {
    user,
    ready,
    isAuthenticated: computed(() => Boolean(user.value)),
    init,
    loginWithGoogle,
    loginWithApple,
    loginWithEmail,
    createAccountWithEmail,
    logout,
    deleteAccount,
  }
})
