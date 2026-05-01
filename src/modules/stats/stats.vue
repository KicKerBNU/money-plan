<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { categoryIconForName } from '@/lib/categoryIcons'
import { formatMonthYear } from '@/lib/dateDisplay'
import FinanceNav from '@/modules/app/finance-nav.vue'
import { fetchMonthlyExpensesStats } from './api/stats.api'
import type { MonthlyCategoryTotal } from './domain/stats.types'

const { t, locale } = useI18n()
const isLoading = ref(true)
const errorMessage = ref<string | null>(null)
const today = new Date()
const period = ref({
  year: today.getFullYear(),
  month: today.getMonth() + 1,
})
const totalSpent = ref(0)
const statsCategories = ref<MonthlyCategoryTotal[]>([])

const periodMonthLabel = computed(() =>
  formatMonthYear(locale.value, period.value.year, period.value.month)
)

const colorPalette = ['#a855f7', '#45c6b5', '#ef4444', '#ec4899', '#f59e0b', '#38bdf8', '#8b5cf6', '#94a3b8']
const categories = computed(() =>
  statsCategories.value.map((category, index) => {
    const percent = totalSpent.value > 0 ? (category.totalAmount / totalSpent.value) * 100 : 0

    return {
      rank: index + 1,
      name: category.categoryName,
      amount: category.totalAmount,
      entries: category.entryCount,
      percent,
      color: colorPalette[index % colorPalette.length],
      icon: categoryIconForName(category.categoryName),
    }
  })
)
const maxAmount = computed(() => Math.max(1, ...categories.value.map((category) => category.amount)))

function formatMoney(value: number) {
  const hasCents = !Number.isInteger(value)

  return new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatCompactMoney(value: number) {
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`
  return formatMoney(value)
}

function brickHeight(amount: number, entries: number) {
  if (entries <= 0) return '3%'
  return `${Math.max(3, (amount / maxAmount.value / entries) * 100)}%`
}

function lineWidth(percent: number) {
  return `${Math.max(3, percent)}%`
}

async function loadStats() {
  isLoading.value = true
  errorMessage.value = null

  try {
    const response = await fetchMonthlyExpensesStats(period.value.year, period.value.month)
    totalSpent.value = response.total
    statsCategories.value = response.categories
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('common.unexpectedError')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  void loadStats()
})
</script>

<template>
  <div class="app-shell">
    <FinanceNav />

    <main class="app-content app-mobile-screen">
      <div class="mx-auto max-w-7xl">
        <header class="mobile-page-header flex items-start justify-between gap-4 pt-9 lg:pt-0">
          <div>
            <p class="theme-muted text-xs font-black uppercase tracking-[0.16em]">
              {{ t('appNav.brand') }} · {{ periodMonthLabel }}
            </p>
            <h1 class="mt-1 text-2xl font-black leading-tight tracking-tight lg:text-[2rem]">
              {{ t('stats.title') }}
            </h1>
            <p class="theme-muted mt-1 max-w-3xl text-sm lg:text-[0.95rem]">
              {{ t('stats.subtitle') }}
            </p>
          </div>

          <div class="stats-total hidden text-right lg:block">
            <strong class="block text-xl font-black">{{ formatMoney(totalSpent) }}</strong>
            <span class="theme-muted text-xs">{{ t('stats.totalCaption', { count: categories.length }) }}</span>
          </div>
        </header>

        <div class="stats-total absolute right-10 top-20 text-right lg:hidden">
          <strong class="block text-xl font-black">{{ formatMoney(totalSpent) }}</strong>
          <span class="theme-muted text-xs">{{ t('stats.mobileTotalCaption', { count: categories.length }) }}</span>
        </div>

        <section class="stats-card mt-5 rounded-2xl p-4 lg:mt-6 lg:p-8">
          <p v-if="isLoading" class="theme-muted text-sm">{{ t('common.loading') }}</p>
          <p v-else-if="errorMessage" class="text-sm" style="color: var(--color-danger)">
            {{ errorMessage }}
          </p>
          <div class="stats-pillars">
            <article
              v-for="category in categories"
              :key="category.name"
              class="stats-pillar"
              :style="{ '--category-color': category.color }"
            >
              <strong class="stats-pillar-value">
                {{ category.amount >= 1000 ? formatCompactMoney(category.amount) : formatMoney(category.amount) }}
              </strong>
              <div class="stats-pillar-track">
                <div
                  v-for="brick in category.entries"
                  :key="brick"
                  class="stats-brick"
                  :style="{ height: brickHeight(category.amount, category.entries) }"
                />
              </div>
              <div class="stats-category-icon">
                <FontAwesomeIcon :icon="category.icon" />
              </div>
              <strong class="stats-category-name">{{ category.name }}</strong>
              <span class="stats-category-entries">{{ category.entries }} {{ t('stats.entryLabel') }}</span>
            </article>
          </div>

          <div class="theme-border mt-5 flex justify-between border-t pt-3 text-xs">
            <span class="theme-muted">{{ t('stats.brickHint') }}</span>
            <span class="theme-muted hidden lg:inline">{{ t('stats.hoverHint') }}</span>
          </div>
        </section>

        <section class="stats-card mt-5 rounded-2xl p-4 lg:p-6">
          <h2 class="theme-muted text-xs font-black uppercase tracking-[0.16em]">{{ t('stats.lineupTitle') }}</h2>

          <div class="mt-4 space-y-3 lg:space-y-2.5">
            <p v-if="!isLoading && !errorMessage && !categories.length" class="theme-muted text-sm">
              {{ t('expenses.empty') }}
            </p>
            <article
              v-for="category in categories"
              :key="category.name"
              class="stats-lineup-row"
              :style="{ '--category-color': category.color }"
            >
              <span class="theme-muted font-black">#{{ category.rank }}</span>
              <div class="stats-lineup-icon">
                <FontAwesomeIcon :icon="category.icon" />
              </div>
              <strong class="stats-lineup-name">{{ category.name }}</strong>
              <div class="stats-lineup-track">
                <div :style="{ width: lineWidth(category.percent) }" />
              </div>
              <span class="theme-muted text-right text-xs">{{ category.percent.toFixed(1) }}%</span>
              <strong class="text-right">{{ formatMoney(category.amount) }}</strong>
            </article>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>
