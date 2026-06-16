<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from './store/auth.store'
import ThemeToggle from '@/modules/theme/theme-toggle.vue'
import { getFirebaseAuthLoginErrorMessage, type AuthLoginProvider } from '@/lib/firebase-auth-error'

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()

const mode = ref<'login' | 'signup'>('login')
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const isLoading = computed(() => !authStore.ready || isSubmitting.value)
const submitLabel = computed(() =>
  mode.value === 'login' ? t('auth.login.emailSubmit') : t('auth.login.createSubmit')
)
const appleButtonLabel = computed(() =>
  mode.value === 'login' ? t('auth.login.appleButton') : t('auth.login.appleCreateButton')
)

function getFriendlyError(error: unknown, provider: AuthLoginProvider = 'email') {
  return getFirebaseAuthLoginErrorMessage(error, t, provider)
}

async function redirectToApp() {
  await router.push('/app/expenses')
}

async function handleEmailSubmit() {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    if (mode.value === 'login') {
      await authStore.loginWithEmail(email.value, password.value)
    } else {
      await authStore.createAccountWithEmail(email.value, password.value)
    }

    await redirectToApp()
  } catch (error) {
    errorMessage.value = getFriendlyError(error)
  } finally {
    isSubmitting.value = false
  }
}

async function handleGoogleLogin() {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    await authStore.loginWithGoogle()
    await redirectToApp()
  } catch (error) {
    errorMessage.value = getFriendlyError(error, 'google')
  } finally {
    isSubmitting.value = false
  }
}

async function handleAppleLogin() {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    await authStore.loginWithApple()
    await redirectToApp()
  } catch (error) {
    errorMessage.value = getFriendlyError(error, 'apple')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  await authStore.init()
  if (authStore.isAuthenticated) {
    await redirectToApp()
  }
})

function toggleMode() {
  mode.value = mode.value === 'login' ? 'signup' : 'login'
  errorMessage.value = ''
}
</script>

<template>
  <div class="theme-page min-h-screen px-6 py-8">
    <div class="mx-auto flex max-w-lg justify-end">
      <ThemeToggle />
    </div>

    <div class="theme-card mx-auto mt-16 max-w-lg rounded-3xl p-8">
      <div class="text-center">
        <span class="theme-badge inline-flex rounded-full px-3 py-1 text-xs font-semibold">
          {{ t('auth.login.badge') }}
        </span>
        <h1 class="mt-4 text-3xl font-semibold">
          {{ mode === 'login' ? t('auth.login.title') : t('auth.login.createTitle') }}
        </h1>
        <p class="theme-muted mt-3">{{ t('auth.login.description') }}</p>
      </div>

      <form class="mt-8 space-y-4" @submit.prevent="handleEmailSubmit">
        <label class="block text-sm font-medium">
          {{ t('auth.login.emailLabel') }}
          <input
            v-model="email"
            autocomplete="email"
            class="theme-input mt-2 w-full rounded-xl px-4 py-3"
            required
            type="email"
            :placeholder="t('auth.login.emailPlaceholder')"
          />
        </label>

        <label class="block text-sm font-medium">
          {{ t('auth.login.passwordLabel') }}
          <input
            v-model="password"
            autocomplete="current-password"
            class="theme-input mt-2 w-full rounded-xl px-4 py-3"
            minlength="6"
            required
            type="password"
            :placeholder="t('auth.login.passwordPlaceholder')"
          />
        </label>

        <p v-if="errorMessage" class="rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
          {{ errorMessage }}
        </p>

        <button
          class="theme-button-primary w-full rounded-xl px-6 py-3 font-semibold disabled:opacity-60"
          :disabled="isLoading"
          type="submit"
        >
          {{ submitLabel }}
        </button>
      </form>

      <div class="my-6 flex items-center gap-3">
        <div class="theme-border h-px flex-1 border-t" />
        <span class="theme-subtle text-xs">{{ t('auth.login.or') }}</span>
        <div class="theme-border h-px flex-1 border-t" />
      </div>

      <div class="space-y-3">
        <button
          type="button"
          class="theme-button-apple flex w-full items-center justify-center gap-3 rounded-xl px-6 py-3 font-medium disabled:opacity-60"
          :disabled="isLoading"
          @click="handleAppleLogin"
        >
          <svg aria-hidden="true" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.36-1.31 2.73-2.54 3.84zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
            />
          </svg>
          {{ appleButtonLabel }}
        </button>

        <button
          type="button"
          class="theme-button-google flex w-full items-center justify-center gap-3 rounded-xl px-6 py-3 font-medium disabled:opacity-60"
          :disabled="isLoading"
          @click="handleGoogleLogin"
        >
          <svg aria-hidden="true" class="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z"
            />
          </svg>
          {{ t('auth.login.googleButton') }}
        </button>
      </div>

      <p class="theme-muted mt-6 text-center text-sm">
        {{ mode === 'login' ? t('auth.login.noAccount') : t('auth.login.hasAccount') }}
        <button class="font-semibold" style="color: var(--color-accent)" type="button" @click="toggleMode">
          {{ mode === 'login' ? t('auth.login.createLink') : t('auth.login.loginLink') }}
        </button>
      </p>
    </div>
  </div>
</template>
