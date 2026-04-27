import { defineStore } from 'pinia'
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth'
import { computed, ref } from 'vue'
import { firebaseAuth } from '@/plugins/firebase'

const googleProvider = new GoogleAuthProvider()

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const ready = ref(false)
  let initialized = false

  function init() {
    if (initialized) return
    initialized = true

    onAuthStateChanged(firebaseAuth, (currentUser) => {
      user.value = currentUser
      ready.value = true
    })
  }

  async function loginWithGoogle() {
    await signInWithPopup(firebaseAuth, googleProvider)
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
