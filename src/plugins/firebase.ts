import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import { connectAuthEmulator, getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyC8SlRdxkXVwWkwgiNOyrAcBygTlJWxGAw',
  authDomain: 'money-plan-23efb.firebaseapp.com',
  projectId: 'money-plan-23efb',
  storageBucket: 'money-plan-23efb.firebasestorage.app',
  messagingSenderId: '21904977338',
  appId: '1:21904977338:web:8e01a9c17cf09c45cc4183',
  measurementId: 'G-MPZBKWRNJZ',
}

export const firebaseApp = initializeApp(firebaseConfig)
export const firebaseAuth = getAuth(firebaseApp)

if (import.meta.env.VITE_USE_FIREBASE_AUTH_EMULATOR === 'true') {
  connectAuthEmulator(firebaseAuth, `http://${window.location.hostname}:9099`, {
    disableWarnings: true,
  })
}

export async function initializeFirebaseAnalytics() {
  if (typeof window === 'undefined') return

  if (await isSupported()) {
    getAnalytics(firebaseApp)
  }
}
