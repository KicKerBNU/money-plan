<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { useThemeStore } from '@/modules/theme/store/theme.store'
import { usePwaInstall } from '@/utils/usePwaInstall'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const { canPrompt, isIOS, isInstalled, promptInstall } = usePwaInstall()

const rootRef = ref<HTMLElement | null>(null)
const open = ref(false)
const iosInstructionVisible = ref(false)

const showInstallOption = () => !isInstalled.value && (canPrompt.value || isIOS.value)

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
  if (e.key === 'Escape') {
    closeMenu()
    iosInstructionVisible.value = false
  }
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
  closeMenu()
}

async function handleInstall() {
  closeMenu()
  if (isIOS.value) {
    iosInstructionVisible.value = true
  } else {
    await promptInstall()
  }
}
</script>

<template>
  <div ref="rootRef" class="relative">
    <button
      type="button"
      class="theme-button-secondary flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-sm font-medium"
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
          class="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2.5 text-left text-[0.86rem] font-semibold transition-colors hover:bg-[var(--color-surface-soft)]"
          role="menuitem"
          @click="toggleTheme"
        >
          <FontAwesomeIcon :icon="themeStore.isDark ? 'sun' : 'moon'" class="w-4 opacity-90" />
          {{ themeStore.isDark ? t('theme.light') : t('theme.dark') }}
        </button>

        <template v-if="showInstallOption()">
          <div class="theme-border mx-2 my-0.5 border-t opacity-70" />
          <button
            type="button"
            class="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2.5 text-left text-[0.86rem] font-semibold transition-colors hover:bg-[var(--color-surface-soft)]"
            role="menuitem"
            @click="handleInstall"
          >
            <FontAwesomeIcon icon="download" class="w-4 opacity-90" />
            {{ isIOS ? t('pwa.addToHomeScreen') : t('pwa.install') }}
          </button>
        </template>

        <div class="theme-border mx-2 my-0.5 border-t opacity-70" />
        <button
          type="button"
          class="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2.5 text-left text-[0.86rem] font-semibold transition-colors hover:bg-[color-mix(in_srgb,var(--color-danger)_14%,transparent)]"
          role="menuitem"
          style="color: var(--color-danger)"
          @click="handleLogout"
        >
          <FontAwesomeIcon icon="arrow-right-from-bracket" class="w-4" />
          {{ t('appNav.logout') }}
        </button>
      </div>
    </Transition>

    <!-- iOS "Add to Home Screen" instruction banner -->
    <Teleport to="body">
      <Transition name="ios-banner">
        <div
          v-if="iosInstructionVisible"
          class="fixed right-4 bottom-4 left-4 z-[1001] overflow-hidden rounded-2xl border shadow-xl backdrop-blur-[8px] sm:left-auto sm:w-[min(100vw-2rem,22rem)]"
          style="
            border-color: var(--color-border);
            background: color-mix(in srgb, var(--color-primary) 18%, var(--color-surface-strong));
          "
          role="status"
        >
          <div class="flex items-start gap-3 px-4 pt-4 pb-3">
            <FontAwesomeIcon
              icon="download"
              class="mt-0.5 shrink-0 text-base"
              style="color: var(--color-primary)"
            />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold" style="color: var(--color-text)">
                {{ t('pwa.addToHomeScreen') }}
              </p>
              <p class="mt-0.5 text-xs leading-relaxed" style="color: var(--color-muted)">
                {{ t('pwa.iosInstructions') }}
              </p>
            </div>
          </div>
          <div class="flex justify-end px-4 pb-3">
            <button
              type="button"
              class="theme-button-primary cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold"
              @click="iosInstructionVisible = false"
            >
              {{ t('pwa.gotIt') }}
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
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

.ios-banner-enter-active,
.ios-banner-leave-active {
  transition:
    opacity 200ms ease,
    transform 200ms ease;
}
.ios-banner-enter-from,
.ios-banner-leave-to {
  opacity: 0;
  transform: translateY(0.75rem);
}
</style>
