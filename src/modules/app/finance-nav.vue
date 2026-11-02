<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRoute, type RouteLocationRaw } from 'vue-router'
import MoneyPlanMark from '@/modules/app/money-plan-mark.vue'
import AppSettingsMenu from '@/modules/app/app-settings-menu.vue'
import { formatMonthYear } from '@/lib/dateDisplay'
import { useMoney } from '@/lib/money'
import { useCashFlowStore } from '@/modules/app/store/cash-flow.store'
import { useDialogA11y } from '@/utils/useDialogA11y'

const { t, locale } = useI18n()
const route = useRoute()
const cashFlowStore = useCashFlowStore()
const { cashFlowNet, loading: cashFlowLoading } = storeToRefs(cashFlowStore)
const { formatSigned: formatCashFlowMoney } = useMoney()

const isMoreOpen = ref(false)
const moreDialogRef = ref<HTMLElement | null>(null)

useDialogA11y({
  open: isMoreOpen,
  dialogRef: moreDialogRef,
  onDismiss: () => {
    isMoreOpen.value = false
  },
})

const navMonthLabel = computed(() => {
  const { year, month } = cashFlowStore.calendarYearMonth()
  return formatMonthYear(locale.value, year, month)
})

onMounted(() => void cashFlowStore.refresh())

watch(
  () => route.fullPath,
  () => {
    isMoreOpen.value = false
  },
)

interface NavItem {
  key: string
  label: string
  icon: string
  to: RouteLocationRaw
  disabled?: boolean
  isAction?: boolean
}

const navItems: NavItem[] = [
  { key: 'overview', label: 'appNav.overview', icon: 'chart-pie', to: '/app/overview' },
  { key: 'expenses', label: 'appNav.expenses', icon: 'receipt', to: '/app/expenses' },
  { key: 'recurring', label: 'appNav.recurring', icon: 'arrows-rotate', to: '/app/recurring-expenses' },
  { key: 'chatbot', label: 'appNav.chatbot', icon: 'comments', to: '/app/chatbot' },
  { key: 'income', label: 'appNav.income', icon: 'arrow-trend-up', to: '/app/income' },
  { key: 'recurringIncome', label: 'appNav.recurringIncome', icon: 'coins', to: '/app/recurring-incomes' },
  { key: 'stats', label: 'appNav.stats', icon: 'chart-column', to: '/app/stats' },
  { key: 'accounts', label: 'appNav.accounts', icon: 'building-columns', to: '/app/accounts' },
]

function navByKey(key: NavItem['key']): NavItem {
  const item = navItems.find((x) => x.key === key)
  if (!item) throw new Error(`Missing nav item: ${key}`)
  return item
}

const addExpenseAction: NavItem = {
  key: 'add',
  label: 'appNav.add',
  icon: 'plus',
  to: { path: '/app/expenses', query: { new: '1' } },
  isAction: true,
}

/**
 * Mobile bottom dock: primary destinations + Add FAB + More sheet trigger.
 * Destinations only in the desktop sidebar (Overview, Income, Recurring ×2, Stats)
 * live in the More sheet so the dock stays usable on small screens.
 */
const mobileNavItems: NavItem[] = [
  navByKey('expenses'),
  addExpenseAction,
  navByKey('chatbot'),
  navByKey('accounts'),
]

const moreNavItems: NavItem[] = [
  navByKey('overview'),
  navByKey('income'),
  navByKey('recurring'),
  navByKey('recurringIncome'),
  navByKey('stats'),
]

const isMoreRouteActive = computed(() => moreNavItems.some((item) => isActive(item)))

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

function openMore() {
  isMoreOpen.value = true
}

function closeMore() {
  isMoreOpen.value = false
}
</script>

<template>
  <a href="#main-content" class="skip-to-main" data-testid="skip-to-main">
    {{ t('common.skipToMain') }}
  </a>
  <aside
    data-testid="finance-nav"
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
          'app-nav-item flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.86rem] font-semibold',
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
      <p class="theme-muted text-[0.7rem] font-semibold">{{ t('appNav.cashFlow') }}</p>
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
    data-testid="finance-mobile-nav"
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

    <button
      type="button"
      data-testid="finance-nav-more"
      :aria-expanded="isMoreOpen"
      aria-haspopup="dialog"
      :aria-label="t('appNav.more')"
      :class="[
        'mobile-nav-item flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[0.68rem] font-semibold',
        { 'is-active': isMoreRouteActive || isMoreOpen },
      ]"
      @click="openMore"
    >
      <span class="mobile-nav-icon flex items-center justify-center">
        <FontAwesomeIcon icon="ellipsis" />
      </span>
      <span>{{ t('appNav.more') }}</span>
    </button>
  </nav>

  <Teleport to="body">
    <div
      v-if="isMoreOpen"
      ref="moreDialogRef"
      class="fixed inset-0 z-[52] flex items-end justify-center bg-black/40 lg:hidden"
      role="dialog"
      aria-modal="true"
      :aria-label="t('appNav.moreTitle')"
      data-testid="finance-nav-more-sheet"
      @click.self="closeMore"
    >
      <div
        class="finance-card flex w-full max-w-lg flex-col rounded-t-2xl shadow-xl"
        style="padding-bottom: max(1rem, env(safe-area-inset-bottom))"
      >
        <div
          class="flex shrink-0 items-center justify-between gap-3 border-b px-5 py-4"
          style="border-color: var(--color-border)"
        >
          <h2 class="text-lg font-black">{{ t('appNav.moreTitle') }}</h2>
          <button
            type="button"
            class="theme-muted flex h-9 w-9 items-center justify-center rounded-xl"
            :aria-label="t('common.close')"
            data-testid="finance-nav-more-close"
            @click="closeMore"
          >
            <FontAwesomeIcon icon="xmark" />
          </button>
        </div>

        <nav class="flex flex-col gap-1 px-3 py-3" :aria-label="t('appNav.moreTitle')">
          <RouterLink
            v-for="item in moreNavItems"
            :key="item.key"
            :data-testid="`finance-nav-more-${item.key}`"
            :aria-disabled="item.disabled"
            :class="[
              'app-nav-item flex items-center gap-3 rounded-xl px-3 py-3 text-[0.9rem] font-semibold',
              { 'is-active': isActive(item), 'is-disabled': item.disabled },
            ]"
            :to="item.to"
            @click="handleNavClick($event, item)"
          >
            <FontAwesomeIcon :icon="item.icon" class="w-4" />
            {{ t(item.label) }}
          </RouterLink>
        </nav>
      </div>
    </div>
  </Teleport>
</template>
