<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useRoute, type RouteLocationRaw } from 'vue-router'
import MoneyPlanMark from '@/modules/app/money-plan-mark.vue'
import AppSettingsMenu from '@/modules/app/app-settings-menu.vue'
import { formatMonthYear } from '@/lib/dateDisplay'
import { useCashFlowStore } from '@/modules/app/store/cash-flow.store'

const { t, locale } = useI18n()
const route = useRoute()
const cashFlowStore = useCashFlowStore()
const { cashFlowNet, loading: cashFlowLoading } = storeToRefs(cashFlowStore)

const navMonthLabel = computed(() => {
  const { year, month } = cashFlowStore.calendarYearMonth()
  return formatMonthYear(locale.value, year, month)
})

function formatCashFlowMoney(value: number) {
  const absoluteValue = Math.abs(value)
  const hasCents = !Number.isInteger(absoluteValue)
  const formatted = new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(absoluteValue)
  return `${value >= 0 ? '+' : '-'}${formatted}`
}

onMounted(() => void cashFlowStore.refresh())

watch(locale, () => void cashFlowStore.refresh())

interface NavItem {
  key: string
  label: string
  icon: string
  to: RouteLocationRaw
  disabled?: boolean
  isAction?: boolean
}

const navItems: NavItem[] = [
  { key: 'overview', label: 'appNav.overview', icon: 'chart-pie', to: '/app/expenses', disabled: true },
  { key: 'expenses', label: 'appNav.expenses', icon: 'receipt', to: '/app/expenses' },
  { key: 'income', label: 'appNav.income', icon: 'arrow-trend-up', to: '/app/income' },
  { key: 'stats', label: 'appNav.stats', icon: 'chart-column', to: '/app/stats' },
  { key: 'accounts', label: 'appNav.accounts', icon: 'building-columns', to: '/app/expenses', disabled: true },
]

const mobileNavItems: NavItem[] = [
  navItems[1],
  navItems[2],
  { key: 'add', label: 'appNav.add', icon: 'plus', to: { path: '/app/expenses', query: { new: '1' } }, isAction: true },
  navItems[3],
  { key: 'me', label: 'appNav.me', icon: 'user', to: '/app/expenses', disabled: true },
]

function itemPath(to: RouteLocationRaw): string {
  return typeof to === 'string' ? to : to.path ?? '/'
}

function isActive(item: NavItem) {
  if (item.disabled || item.isAction) return false
  return route.path === itemPath(item.to)
}

function handleNavClick(event: MouseEvent, item: NavItem) {
  if (item.disabled) event.preventDefault()
}
</script>

<template>
  <aside
    class="app-sidebar theme-border fixed inset-y-0 left-0 z-30 hidden w-60 border-r px-6 py-7 lg:flex lg:flex-col"
  >
    <RouterLink class="mb-9 flex items-center gap-3" to="/app/expenses">
      <span class="brand-mark flex h-9 w-9 items-center justify-center">
        <MoneyPlanMark />
      </span>
      <span>
        <strong class="block text-[0.95rem] font-black leading-tight">{{ t('appNav.brand') }}</strong>
        <span class="theme-muted text-[0.7rem] font-semibold">{{ navMonthLabel }}</span>
      </span>
    </RouterLink>

    <nav class="flex flex-1 flex-col gap-1.5">
      <RouterLink
        v-for="item in navItems"
        :key="item.key"
        :aria-disabled="item.disabled"
        :class="[
          'app-nav-item flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.86rem] font-bold',
          { 'is-active': isActive(item), 'is-disabled': item.disabled },
        ]"
        :to="item.to"
        @click="handleNavClick($event, item)"
      >
        <FontAwesomeIcon :icon="item.icon" class="w-4" />
        {{ t(item.label) }}
      </RouterLink>
    </nav>

    <div class="app-net-card rounded-xl p-3.5">
      <p class="theme-muted text-[0.7rem] font-bold">{{ t('appNav.cashFlow') }}</p>
      <strong
        class="mt-0.5 block text-lg font-black"
        :style="{
          color:
            cashFlowNet !== null && cashFlowNet < 0 ? 'var(--color-danger)' : 'var(--color-positive)',
        }"
      >
        {{
          cashFlowLoading
            ? '…'
            : cashFlowNet === null
              ? '—'
              : formatCashFlowMoney(cashFlowNet)
        }}
      </strong>
    </div>
  </aside>

  <div class="fixed right-4 top-4 z-30">
    <AppSettingsMenu />
  </div>

  <nav
    class="mobile-bottom-nav theme-card fixed inset-x-4 bottom-4 z-30 grid grid-cols-5 items-center rounded-[1.6rem] px-3 py-2 shadow-2xl lg:hidden"
  >
    <RouterLink
      v-for="item in mobileNavItems"
      :key="item.key"
      :aria-label="item.isAction ? t(item.label) : undefined"
      :aria-disabled="item.disabled"
      :class="[
        'mobile-nav-item flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[0.68rem] font-semibold',
        { 'is-active': isActive(item), 'is-disabled': item.disabled, 'is-action': item.isAction },
      ]"
      :to="item.to"
      @click="handleNavClick($event, item)"
    >
      <span class="mobile-nav-icon flex items-center justify-center">
        <FontAwesomeIcon :icon="item.icon" />
      </span>
      <span v-if="!item.isAction">{{ t(item.label) }}</span>
    </RouterLink>
  </nav>
</template>
