<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FinanceNav from '@/modules/app/finance-nav.vue'
import { fetchMonthlyExpensesStats } from './api/stats.api'
import type { MonthlyExpensesStats } from './domain/stats.types'

const { t, locale } = useI18n()
const loading = ref(false)
const errorMessage = ref('')
const stats = ref<MonthlyExpensesStats | null>(null)

const now = new Date()
const year = ref(now.getFullYear())
const month = ref(now.getMonth() + 1)

const currencyFormatter = computed(
  () => new Intl.NumberFormat(locale.value, { style: 'currency', currency: 'USD' })
)

const maxCategoryAmount = computed(() =>
  Math.max(1, ...(stats.value?.categories.map((item) => item.totalAmount) ?? [1]))
)

async function loadStats() {
  loading.value = true
  errorMessage.value = ''
  try {
    stats.value = await fetchMonthlyExpensesStats(year.value, month.value)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('common.unexpectedError')
  } finally {
    loading.value = false
  }
}

onMounted(loadStats)
</script>

<template>
  <div class="app-shell">
    <FinanceNav />

    <main class="app-content">
      <div class="mx-auto max-w-5xl">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-3xl font-bold">{{ t('stats.title') }}</h1>
          <p class="theme-muted mt-1">{{ t('stats.subtitle') }}</p>
        </div>
        <button class="theme-button-secondary rounded px-3 py-2 text-sm" @click="loadStats">
          {{ t('stats.refresh') }}
        </button>
      </div>

      <p v-if="errorMessage" class="mt-4 text-red-400">{{ errorMessage }}</p>
      <p v-else-if="loading" class="theme-muted mt-4">{{ t('common.loading') }}</p>

      <template v-else-if="stats">
        <p class="mt-6 text-lg">
          {{ t('stats.total') }}:
          <strong>{{ currencyFormatter.format(stats.total) }}</strong>
        </p>

        <div class="mt-5 flex flex-wrap gap-2">
          <span
            v-for="item in stats.categories"
            :key="item.categoryId"
            class="theme-button-secondary rounded-full px-3 py-1 text-sm"
          >
            {{ item.categoryName }} - {{ currencyFormatter.format(item.totalAmount) }}
          </span>
        </div>

        <div class="theme-card mt-6 space-y-3 rounded-xl p-4">
          <div v-for="item in stats.categories" :key="item.categoryId">
            <div class="mb-1 flex justify-between text-sm">
              <span>{{ item.categoryName }}</span>
              <span>{{ currencyFormatter.format(item.totalAmount) }}</span>
            </div>
            <div class="h-3 rounded" style="background: var(--color-surface-soft)">
              <div
                class="h-3 rounded bg-gradient-to-r from-amber-400 to-teal-400"
                :style="{ width: `${(item.totalAmount / maxCategoryAmount) * 100}%` }"
              />
            </div>
          </div>
        </div>
      </template>
      </div>
    </main>
  </div>
</template>
