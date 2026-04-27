<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useThemeStore } from './store/theme.store'

const { t } = useI18n()
const themeStore = useThemeStore()
</script>

<template>
  <button
    class="theme-button-secondary rounded-xl px-3 py-2 text-sm font-medium"
    type="button"
    @click="themeStore.toggleTheme"
  >
    {{ themeStore.isDark ? t('theme.light') : t('theme.dark') }}
  </button>
</template>
