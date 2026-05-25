import { defineStore } from 'pinia'
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User,
} from 'firebase/auth'
import { computed, ref } from 'vue'
import { preferRedirectAuth } from '@/lib/auth-platform'
import { firebaseAuth } from '@/plugins/firebase'

const googleProvider = new GoogleAuthProvider()

async function ensureLocalPersistence() {
  await setPersistence(firebaseAuth, browserLocalPersistence)
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const ready = ref(false)
  let initialized = false

  function init() {
    if (initialized) return
    initialized = true

    void (async () => {
      try {
        await ensureLocalPersistence()
        await getRedirectResult(firebaseAuth)
      } catch {
        // Redirect or persistence setup failed; auth listener still resolves state.
      }

      onAuthStateChanged(firebaseAuth, (currentUser) => {
        user.value = currentUser
        ready.value = true
      })
    })()

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState !== 'visible') return
        const currentUser = firebaseAuth.currentUser
        if (!currentUser) return
        void currentUser.getIdToken(true)
      })
    }
  }

  async function loginWithGoogle() {
    await ensureLocalPersistence()

    if (preferRedirectAuth()) {
      await signInWithRedirect(firebaseAuth, googleProvider)
      return
    }

    await signInWithPopup(firebaseAuth, googleProvider)
  }

  async function loginWithEmail(email: string, password: string) {
    await ensureLocalPersistence()
    await signInWithEmailAndPassword(firebaseAuth, email, password)
  }

  async function createAccountWithEmail(email: string, password: string) {
    await ensureLocalPersistence()
    await createUserWithEmailAndPassword(firebaseAuth, email, password)
  }

  async function logout() {
    await signOut(firebaseAuth)
  }

  return {
    user,
    ready,
    isAuthenticated: computed(() => Boolean(user.value)),
    init,
    loginWithGoogle,
    loginWithEmail,
    createAccountWithEmail,
    logout,
  }
})
