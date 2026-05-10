<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { categoryIconForName } from '@/lib/categoryIcons'
import { formatMonthYear } from '@/lib/dateDisplay'
import FinanceNav from '@/modules/app/finance-nav.vue'
import FinancePageSkeleton from '@/modules/app/FinancePageSkeleton.vue'
import { fetchAccounts, fetchExpensesByDateRange } from '@/modules/expenses/api/expenses.api'
import type { Account, Expense } from '@/modules/expenses/domain/expenses.types'
import { fetchIncomesByDateRange } from '@/modules/income/api/income.api'
import type { IncomeEntry } from '@/modules/income/domain/income.types'
import type { OverviewPreset } from '@/modules/overview/lib/overviewPeriod'
import {
  formatBucketLabel,
  getPeriodRange,
  listBucketKeys,
  parseLocalISODate,
  shiftAnchor,
  txBucketKey,
} from '@/modules/overview/lib/overviewPeriod'

const { t, locale } = useI18n()

const preset = ref<OverviewPreset>('month')
const anchor = ref(new Date())

const isLoading = ref(true)
const errorMessage = ref<string | null>(null)
const expenses = ref<Expense[]>([])
const incomes = ref<IncomeEntry[]>([])
const accounts = ref<Account[]>([])

const periodRange = computed(() => getPeriodRange(preset.value, anchor.value))

const periodLabel = computed(() => {
  if (preset.value === 'week') {
    const a = parseLocalISODate(periodRange.value.start)
    const b = parseLocalISODate(periodRange.value.end)
    return `${a.toLocaleDateString(locale.value, { month: 'short', day: 'numeric' })} – ${b.toLocaleDateString(locale.value, { month: 'short', day: 'numeric', year: 'numeric' })}`
  }
  if (preset.value === 'month') {
    return formatMonthYear(locale.value, anchor.value.getFullYear(), anchor.value.getMonth() + 1)
  }
  return String(anchor.value.getFullYear())
})

function setPreset(p: OverviewPreset) {
  preset.value = p
}

function prevPeriod() {
  anchor.value = shiftAnchor(preset.value, anchor.value, -1)
}

function nextPeriod() {
  anchor.value = shiftAnchor(preset.value, anchor.value, 1)
}

const totalIncome = computed(() => incomes.value.reduce((s, i) => s + i.amount, 0))
const totalExpenses = computed(() => expenses.value.reduce((s, e) => s + e.amount, 0))
const net = computed(() => totalIncome.value - totalExpenses.value)

const savingsRate = computed(() => {
  if (totalIncome.value <= 0) return 0
  return Math.max(0, net.value / totalIncome.value)
})

const accountsBalance = computed(() => accounts.value.reduce((s, a) => s + a.currentBalance, 0))

const categoryTotals = computed(() => {
  const map = new Map<string, number>()
  for (const x of expenses.value) {
    map.set(x.categoryName, (map.get(x.categoryName) ?? 0) + x.amount)
  }
  const rows = [...map.entries()]
    .map(([name, amount]) => ({
      name,
      amount,
      share: totalExpenses.value > 0 ? amount / totalExpenses.value : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
  return rows
})

const topCategory = computed(() => categoryTotals.value[0] ?? null)

function shouldShowMonthChartLabel(index: number, total: number): boolean {
  if (total <= 12) return true
  const step = Math.max(1, Math.round(total / 7))
  return index === 0 || index === total - 1 || index % step === 0
}

const chartBuckets = computed(() => {
  const { start, end } = periodRange.value
  const keys = listBucketKeys(preset.value, start, end)
  const p = preset.value
  const inc = new Map<string, number>()
  const exp = new Map<string, number>()
  for (const k of keys) {
    inc.set(k, 0)
    exp.set(k, 0)
  }
  for (const i of incomes.value) {
    const k = txBucketKey(i.date, p)
    if (k && inc.has(k)) inc.set(k, (inc.get(k) ?? 0) + i.amount)
  }
  for (const e of expenses.value) {
    const k = txBucketKey(e.date, p)
    if (k && exp.has(k)) exp.set(k, (exp.get(k) ?? 0) + e.amount)
  }
  const n = keys.length
  return keys.map((key, index) => ({
    key,
    label: formatBucketLabel(key, p, locale.value),
    showLabel: p !== 'month' || shouldShowMonthChartLabel(index, n),
    income: inc.get(key) ?? 0,
    expenses: exp.get(key) ?? 0,
  }))
})

const chartMax = computed(() => {
  let m = 1
  for (const b of chartBuckets.value) {
    m = Math.max(m, b.income, b.expenses)
  }
  return m
})

/** SVG geometry — month uses wider canvas + horizontal scroll so bars don’t collapse. */
const vbH = 200
const padL = 36
const padR = 12
const padT = 12
const padB = 52

const barGeometry = computed(() => {
  const n = Math.max(1, chartBuckets.value.length)
  const p = preset.value
  const minSlot = p === 'month' ? 28 : p === 'week' ? 56 : 42
  const vbW = Math.round(Math.max(520, padL + padR + n * minSlot))
  const innerW = vbW - padL - padR
  const innerH = vbH - padT - padB
  const slot = innerW / n
  const barW = Math.max(4, Math.min(18, slot * 0.32))
  const gap = Math.max(2, slot * 0.1)
  return { n, innerW, innerH, slot, barW, gap, padL, padT, vbW }
})

const insights = computed(() => {
  const items: { kind: string; message: string; to?: string }[] = []

  if (!isLoading.value && !errorMessage.value) {
    if (totalIncome.value === 0 && totalExpenses.value === 0) {
      items.push({
        kind: 'empty',
        message: t('overview.insights.emptyPeriod'),
        to: '/app/expenses',
      })
      return items
    }

    if (net.value < 0 && totalExpenses.value > 0) {
      items.push({
        kind: 'deficit',
        message: t('overview.insights.deficit'),
        to: '/app/expenses',
      })
    }

    const top = topCategory.value
    if (top && totalExpenses.value > 0 && top.share >= 0.35) {
      items.push({
        kind: 'concentration',
        message: t('overview.insights.topCategory', {
          name: top.name,
          pct: Math.round(top.share * 100),
        }),
        to: '/app/stats',
      })
    }

    if (net.value > 0 && savingsRate.value >= 0.1 && totalIncome.value > 0) {
      items.push({
        kind: 'save',
        message: t('overview.insights.savingsPositive', {
          pct: Math.round(savingsRate.value * 100),
        }),
      })
    }

    if (items.length === 0 && totalExpenses.value > 0) {
      items.push({ kind: 'ok', message: t('overview.insights.allGood') })
    }
  }

  return items
})

function formatMoney(value: number) {
  const hasCents = !Number.isInteger(value)
  return new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value)
}

async function loadOverview() {
  isLoading.value = true
  errorMessage.value = null
  const { start, end } = periodRange.value

  try {
    const [expData, incData, accData] = await Promise.all([
      fetchExpensesByDateRange(start, end),
      fetchIncomesByDateRange(start, end),
      fetchAccounts(),
    ])
    expenses.value = expData
    incomes.value = incData
    accounts.value = accData
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('common.unexpectedError')
  } finally {
    isLoading.value = false
  }
}

watch([preset, anchor], () => void loadOverview(), { deep: true, immediate: true })
</script>

<template>
  <div class="app-shell">
    <FinanceNav />

    <main class="app-content app-mobile-screen" :aria-busy="isLoading">
      <div class="app-finance-page-inner">
        <header class="mobile-page-header pt-9 lg:pt-0">
          <p class="theme-muted text-xs font-black uppercase tracking-[0.16em]">
            {{ t('appNav.brand') }} · {{ t('appNav.overview') }}
          </p>
          <h1 class="mt-1 text-2xl font-black leading-tight tracking-tight lg:text-[2rem]">
            {{ t('overview.title') }}
          </h1>
          <p class="theme-muted mt-1 max-w-3xl text-sm lg:text-[0.95rem]">
            {{ t('overview.subtitle') }}
          </p>
        </header>

        <div class="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="p in (['week', 'month', 'year'] as OverviewPreset[])"
              :key="p"
              type="button"
              class="rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wide transition-colors"
              :class="
                preset === p
                  ? 'bg-[color-mix(in_srgb,var(--color-primary)_22%,transparent)] text-[var(--color-primary)] ring-2 ring-[color-mix(in_srgb,var(--color-primary)_45%,transparent)]'
                  : 'theme-muted hover:bg-[color-mix(in_srgb,var(--color-border)_55%,transparent)]'
              "
              @click="setPreset(p)"
            >
              {{ t(`overview.period.${p}`) }}
            </button>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="theme-muted flex h-10 w-10 items-center justify-center rounded-xl text-lg font-black hover:bg-[color-mix(in_srgb,var(--color-border)_55%,transparent)]"
              :aria-label="t('overview.periodPrev')"
              @click="prevPeriod"
            >
              ‹
            </button>
            <span class="min-w-[10rem] text-center text-sm font-black">{{ periodLabel }}</span>
            <button
              type="button"
              class="theme-muted flex h-10 w-10 items-center justify-center rounded-xl text-lg font-black hover:bg-[color-mix(in_srgb,var(--color-border)_55%,transparent)]"
              :aria-label="t('overview.periodNext')"
              @click="nextPeriod"
            >
              ›
            </button>
          </div>
        </div>

        <FinancePageSkeleton v-if="isLoading" class="mt-6" variant="overview" />
        <p v-else-if="errorMessage" class="mt-6 text-sm" style="color: var(--color-danger)">
          {{ errorMessage }}
        </p>

        <template v-else>
          <section class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div class="finance-card rounded-2xl p-4">
              <p class="theme-muted text-[0.65rem] font-black uppercase tracking-wide">{{ t('overview.kpiIncome') }}</p>
              <strong class="mt-1 block text-xl font-black" style="color: var(--color-positive)">{{
                formatMoney(totalIncome)
              }}</strong>
            </div>
            <div class="finance-card rounded-2xl p-4">
              <p class="theme-muted text-[0.65rem] font-black uppercase tracking-wide">{{ t('overview.kpiExpenses') }}</p>
              <strong class="mt-1 block text-xl font-black">{{ formatMoney(totalExpenses) }}</strong>
            </div>
            <div class="finance-card rounded-2xl p-4">
              <p class="theme-muted text-[0.65rem] font-black uppercase tracking-wide">{{ t('overview.kpiNet') }}</p>
              <strong
                class="mt-1 block text-xl font-black"
                :style="{ color: net >= 0 ? 'var(--color-positive)' : 'var(--color-danger)' }"
              >
                {{ formatMoney(net) }}
              </strong>
            </div>
            <div class="finance-card rounded-2xl p-4">
              <p class="theme-muted text-[0.65rem] font-black uppercase tracking-wide">{{ t('overview.kpiSavingsRate') }}</p>
              <strong class="mt-1 block text-xl font-black">
                {{ totalIncome > 0 ? `${Math.round(savingsRate * 100)}%` : '—' }}
              </strong>
              <p class="theme-muted mt-1 text-[0.68rem]">{{ t('overview.kpiAccounts') }}: {{ formatMoney(accountsBalance) }}</p>
            </div>
          </section>

          <section class="finance-card mt-5 rounded-2xl p-4 lg:p-6">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <h2 class="theme-muted text-xs font-black uppercase tracking-[0.16em]">{{ t('overview.chartTitle') }}</h2>
              <div class="flex flex-wrap gap-4 text-[0.68rem] font-semibold">
                <span class="flex items-center gap-2">
                  <span class="inline-block h-2.5 w-2.5 rounded-sm" style="background: var(--color-positive)" />
                  {{ t('overview.chartIncome') }}
                </span>
                <span class="flex items-center gap-2">
                  <span class="inline-block h-2.5 w-2.5 rounded-sm" style="background: var(--color-danger)" />
                  {{ t('overview.chartExpenses') }}
                </span>
              </div>
            </div>

            <div v-if="chartBuckets.every((b) => b.income === 0 && b.expenses === 0)" class="theme-muted mt-6 py-8 text-center text-sm">
              {{ t('overview.chartEmpty') }}
            </div>

            <div
              v-else
              class="overview-chart-scroll mt-4 w-full max-w-full overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]"
            >
              <svg
                class="block h-[220px] shrink-0"
                :width="barGeometry.vbW"
                height="220"
                :viewBox="`0 0 ${barGeometry.vbW} ${vbH}`"
                preserveAspectRatio="xMinYMid meet"
              >
                <line
                  :x1="barGeometry.padL"
                  :y1="vbH - padB"
                  :x2="barGeometry.vbW - padR"
                  :y2="vbH - padB"
                  stroke="var(--color-border)"
                  stroke-width="1"
                />

                <g v-for="(b, i) in chartBuckets" :key="b.key">
                  <title>{{ b.label }}: +{{ formatMoney(b.income) }} / −{{ formatMoney(b.expenses) }}</title>

                  <rect
                    v-if="b.income > 0"
                    :x="barGeometry.padL + i * barGeometry.slot + barGeometry.gap"
                    :y="padT + barGeometry.innerH - (b.income / chartMax) * barGeometry.innerH"
                    :width="barGeometry.barW"
                    :height="Math.max(2, (b.income / chartMax) * barGeometry.innerH)"
                    rx="3"
                    fill="var(--color-positive)"
                    opacity="0.88"
                  />

                  <rect
                    v-if="b.expenses > 0"
                    :x="barGeometry.padL + i * barGeometry.slot + barGeometry.gap + barGeometry.barW + barGeometry.gap * 0.5"
                    :y="padT + barGeometry.innerH - (b.expenses / chartMax) * barGeometry.innerH"
                    :width="barGeometry.barW"
                    :height="Math.max(2, (b.expenses / chartMax) * barGeometry.innerH)"
                    rx="3"
                    fill="var(--color-danger)"
                    opacity="0.85"
                  />

                  <text
                    v-if="b.showLabel"
                    :x="barGeometry.padL + i * barGeometry.slot + barGeometry.slot / 2"
                    :y="vbH - padB + 18"
                    text-anchor="middle"
                    fill="var(--color-muted)"
                    style="font-family: system-ui, sans-serif; font-size: 10px; font-weight: 700"
                  >
                    {{ b.label }}
                  </text>
                </g>
              </svg>
            </div>
          </section>

          <section class="finance-card mt-5 rounded-2xl p-4 lg:p-6">
            <h2 class="theme-muted text-xs font-black uppercase tracking-[0.16em]">{{ t('overview.insightsTitle') }}</h2>
            <ul class="mt-4 space-y-3">
              <li
                v-for="item in insights"
                :key="item.kind"
                class="flex flex-col gap-2 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                style="border-color: var(--color-border)"
              >
                <p class="text-sm font-semibold leading-snug">{{ item.message }}</p>
                <RouterLink
                  v-if="item.to"
                  :to="item.to"
                  class="shrink-0 text-xs font-black uppercase tracking-wide text-[var(--color-primary)] hover:underline"
                >
                  {{ t('overview.insightCta') }}
                </RouterLink>
              </li>
            </ul>
          </section>

          <section class="finance-card mt-5 rounded-2xl p-4 lg:p-6">
            <h2 class="theme-muted text-xs font-black uppercase tracking-[0.16em]">{{ t('overview.categoriesTitle') }}</h2>
            <p v-if="!categoryTotals.length" class="theme-muted mt-4 text-sm">{{ t('overview.chartEmpty') }}</p>
            <div v-else class="mt-4 space-y-2.5">
              <div
                v-for="row in categoryTotals.slice(0, 6)"
                :key="row.name"
                class="flex items-center gap-3 rounded-xl px-2 py-2 text-sm"
              >
                <span
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[0.75rem]"
                  style="
                    background: color-mix(in srgb, var(--color-primary) 14%, transparent);
                    color: var(--color-primary);
                  "
                >
                  <FontAwesomeIcon :icon="categoryIconForName(row.name)" />
                </span>
                <div class="min-w-0 flex-1">
                  <div class="flex justify-between gap-2 font-semibold">
                    <span class="truncate">{{ row.name }}</span>
                    <span>{{ formatMoney(row.amount) }}</span>
                  </div>
                  <div class="mt-1 h-1.5 overflow-hidden rounded-full" style="background: var(--color-surface-soft)">
                    <div
                      class="h-full rounded-full transition-all"
                      :style="{
                        width: `${Math.min(100, row.share * 100)}%`,
                        background: 'var(--color-primary)',
                      }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="theme-muted mt-6 text-xs font-black uppercase tracking-[0.16em]">
            {{ t('overview.quickLinks') }}
          </section>
          <div class="mt-3 flex flex-wrap gap-2">
            <RouterLink
              to="/app/expenses"
              class="rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wide ring-1 ring-[color-mix(in_srgb,var(--color-border)_80%,transparent)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)]"
            >
              {{ t('overview.linkExpenses') }}
            </RouterLink>
            <RouterLink
              to="/app/income"
              class="rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wide ring-1 ring-[color-mix(in_srgb,var(--color-border)_80%,transparent)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)]"
            >
              {{ t('overview.linkIncome') }}
            </RouterLink>
            <RouterLink
              to="/app/stats"
              class="rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wide ring-1 ring-[color-mix(in_srgb,var(--color-border)_80%,transparent)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)]"
            >
              {{ t('overview.linkStats') }}
            </RouterLink>
            <RouterLink
              to="/app/accounts"
              class="rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wide ring-1 ring-[color-mix(in_srgb,var(--color-border)_80%,transparent)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)]"
            >
              {{ t('overview.linkAccounts') }}
            </RouterLink>
          </div>
        </template>
      </div>
    </main>
  </div>
</template>
