<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import ThemeToggle from '@/modules/theme/theme-toggle.vue'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

async function handleLogout() {
  await authStore.logout()
  await router.push('/login')
}
</script>

<template>
  <nav class="theme-border mb-6 flex flex-wrap items-center justify-between gap-3 border-b pb-4">
    <div class="flex gap-2">
      <RouterLink class="theme-nav-link rounded-lg px-3 py-2 text-sm" to="/app/income">
        {{ t('appNav.income') }}
      </RouterLink>
      <RouterLink class="theme-nav-link rounded-lg px-3 py-2 text-sm" to="/app/expenses">
        {{ t('appNav.expenses') }}
      </RouterLink>
      <RouterLink class="theme-nav-link rounded-lg px-3 py-2 text-sm" to="/app/stats">
        {{ t('appNav.stats') }}
      </RouterLink>
    </div>
    <div class="flex items-center gap-2">
      <ThemeToggle />
      <button class="theme-button-secondary rounded-lg px-3 py-2 text-sm" @click="handleLogout">
        {{ t('appNav.logout') }}
      </button>
    </div>
  </nav>
</template>
