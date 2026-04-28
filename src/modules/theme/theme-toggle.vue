<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useThemeStore } from './store/theme.store'

const { t } = useI18n()
const themeStore = useThemeStore()
</script>

<template>
  <button
    class="theme-button-secondary flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium"
    type="button"
    :aria-label="themeStore.isDark ? t('theme.light') : t('theme.dark')"
    :title="themeStore.isDark ? t('theme.light') : t('theme.dark')"
    @click="themeStore.toggleTheme"
  >
    <FontAwesomeIcon icon="gear" />
  </button>
</template>
