import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'money-plan-theme'

function getPreferredTheme(): Theme {
  const storedTheme = localStorage.getItem(STORAGE_KEY)
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  localStorage.setItem(STORAGE_KEY, theme)
}

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>('dark')

  function init() {
    theme.value = getPreferredTheme()
    applyTheme(theme.value)
  }

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    applyTheme(theme.value)
  }

  return {
    theme,
    isDark: computed(() => theme.value === 'dark'),
    init,
    toggleTheme,
  }
})
