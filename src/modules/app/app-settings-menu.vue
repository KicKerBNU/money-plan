<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { useThemeStore } from '@/modules/theme/store/theme.store'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const rootRef = ref<HTMLElement | null>(null)
const open = ref(false)

function closeMenu() {
  open.value = false
}

function toggleMenu(e: MouseEvent) {
  e.stopPropagation()
  open.value = !open.value
}

function onDocumentClick(e: MouseEvent) {
  if (!open.value || !rootRef.value) return
  if (!rootRef.value.contains(e.target as Node)) closeMenu()
}

function onDocumentKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeMenu()
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onDocumentKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onDocumentKeydown)
})

async function handleLogout() {
  closeMenu()
  await authStore.logout()
  await router.push('/login')
}

function toggleTheme() {
  themeStore.toggleTheme()
}
</script>

<template>
  <div ref="rootRef" class="relative">
    <button
      type="button"
      class="theme-button-secondary flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium"
      :aria-expanded="open"
      aria-haspopup="menu"
      :aria-label="t('appNav.settingsMenu')"
      @click="toggleMenu"
    >
      <FontAwesomeIcon icon="gear" />
    </button>

    <Transition name="app-settings-fade">
      <div
        v-show="open"
        class="theme-card theme-border absolute right-0 z-50 mt-2 min-w-[12rem] overflow-hidden rounded-xl border py-1 shadow-xl"
        role="menu"
      >
        <button
          type="button"
          class="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-[0.86rem] font-bold transition-colors hover:bg-[var(--color-surface-soft)]"
          role="menuitem"
          @click="toggleTheme"
        >
          <FontAwesomeIcon :icon="themeStore.isDark ? 'sun' : 'moon'" class="w-4 opacity-90" />
          {{ themeStore.isDark ? t('theme.light') : t('theme.dark') }}
        </button>
        <div class="theme-border mx-2 my-0.5 border-t opacity-70" />
        <button
          type="button"
          class="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-[0.86rem] font-bold transition-colors hover:bg-[color-mix(in_srgb,var(--color-danger)_14%,transparent)]"
          role="menuitem"
          style="color: var(--color-danger)"
          @click="handleLogout"
        >
          <FontAwesomeIcon icon="arrow-right-from-bracket" class="w-4" />
          {{ t('appNav.logout') }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.app-settings-fade-enter-active,
.app-settings-fade-leave-active {
  transition: opacity 0.12s ease;
}
.app-settings-fade-enter-from,
.app-settings-fade-leave-to {
  opacity: 0;
}
</style>
