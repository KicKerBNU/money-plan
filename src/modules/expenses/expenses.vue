<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import FinanceNav from '@/modules/app/finance-nav.vue'
import { fetchIncomesByPeriod } from '@/modules/income/api/income.api'
import type { IncomeEntry } from '@/modules/income/domain/income.types'
import {
  createAccount,
  createCategory,
  createExpense,
  deleteAccount,
  deleteCategory,
  deleteExpense,
  fetchAccounts,
  fetchCategories,
  fetchExpensesByPeriod,
  updateAccount,
  updateCategory,
  updateExpense,
} from './api/expenses.api'
import { categoryIconForName } from '@/lib/categoryIcons'
import type { Account, Category, Expense } from './domain/expenses.types'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const searchQuery = ref('')
const selectedCategoryId = ref<'all' | number>('all')
const selectedDateFrom = ref('')
const selectedDateTo = ref('')
const selectedRangePreset = ref<'last3' | 'last7' | 'tripWeek' | null>(null)
const isTripRangeModalOpen = ref(false)
const tripRangeForm = ref({
  startDate: '',
  endDate: '',
})
const isExpenseModalOpen = ref(false)
const isLoading = ref(true)
const errorMessage = ref<string | null>(null)
const expenses = ref<Expense[]>([])
const incomes = ref<IncomeEntry[]>([])
const categories = ref<Category[]>([])
const accounts = ref<Account[]>([])
const today = new Date()
const period = ref({
  year: today.getFullYear(),
  month: today.getMonth() + 1,
})

const form = ref({
  date: toInputDate(new Date()),
  amount: '',
  categoryId: null as number | null,
  accountId: null as number | null,
  note: '',
})

const newAccountName = ref('')
const newCategoryName = ref('')
const editingExpenseId = ref<number | null>(null)

type RenameTarget =
  | { type: 'account'; id: number; initialBalance: number; previousName: string }
  | { type: 'category'; id: number; previousName: string }

const isRenameModalOpen = ref(false)
const renameTarget = ref<RenameTarget | null>(null)
const renameNameInput = ref('')

const currentMonthLabel = computed(() =>
  new Intl.DateTimeFormat(locale.value, { month: 'long', year: 'numeric' }).format(
    new Date(period.value.year, period.value.month - 1, 1)
  )
)

const summary = computed(() => {
  const totalSpent = expenses.value.reduce((sum, item) => sum + item.amount, 0)
  const totalIncome = incomes.value.reduce((sum, item) => sum + item.amount, 0)
  const dailyAverage = totalSpent / Math.max(1, getDaysElapsedInMonth(period.value.year, period.value.month))
  const dailyTotals = expenses.value.reduce(
    (acc, item) => {
      acc[item.date] = (acc[item.date] ?? 0) + item.amount
      return acc
    },
    {} as Record<string, number>
  )
  const largestDay = Math.max(0, ...Object.values(dailyTotals))

  return {
    totalSpent,
    totalIncome,
    dailyAverage,
    largestDay,
    cashFlow: totalIncome - totalSpent,
    entriesCount: expenses.value.length,
  }
})

const cashFlowLabel = computed(() => {
  const value = summary.value.cashFlow
  return `${value >= 0 ? '+' : '-'}${formatMoney(Math.abs(value))}`
})

const expensesSubtitle = computed(() => t('expenses.subtitle', { count: summary.value.entriesCount }))

const expenseModalTitle = computed(() =>
  editingExpenseId.value ? t('expenses.form.editTitle') : t('expenses.form.title')
)

const renameModalTitle = computed(() => {
  if (!renameTarget.value) return ''
  return renameTarget.value.type === 'account'
    ? t('expenses.renameModal.editAccount')
    : t('expenses.renameModal.editCategory')
})

const renameModalNameLabel = computed(() => {
  if (!renameTarget.value) return ''
  return renameTarget.value.type === 'account'
    ? t('expenses.renameModal.accountNameLabel')
    : t('expenses.renameModal.categoryNameLabel')
})

const filteredExpenses = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return expensesList.value.filter((expense) => {
    const matchesCategory = selectedCategoryId.value === 'all' || expense.categoryId === selectedCategoryId.value
    const matchesDateFrom = !selectedDateFrom.value || expense.date >= selectedDateFrom.value
    const matchesDateTo = !selectedDateTo.value || expense.date <= selectedDateTo.value
    const matchesSearch =
      !query ||
      [expense.title, expense.categoryName, expense.accountName, expense.dateLabel].some((value) =>
        value.toLowerCase().includes(query)
      )

    return matchesCategory && matchesDateFrom && matchesDateTo && matchesSearch
  })
})

const selectedRangeSpent = computed(() => {
  if (!selectedDateFrom.value && !selectedDateTo.value) return 0

  return expensesList.value.reduce((sum, expense) => {
    const matchesCategory = selectedCategoryId.value === 'all' || expense.categoryId === selectedCategoryId.value
    const matchesDateFrom = !selectedDateFrom.value || expense.date >= selectedDateFrom.value
    const matchesDateTo = !selectedDateTo.value || expense.date <= selectedDateTo.value
    if (!matchesCategory || !matchesDateFrom || !matchesDateTo) return sum
    return sum + expense.amount
  }, 0)
})

const selectedRangeLabel = computed(() => {
  const formatDate = (value: string) =>
    new Intl.DateTimeFormat(locale.value, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(`${value}T00:00:00`))

  if (selectedDateFrom.value && selectedDateTo.value) {
    return `${formatDate(selectedDateFrom.value)} - ${formatDate(selectedDateTo.value)}`
  }

  if (selectedDateFrom.value) {
    return `${t('expenses.filters.from')} ${formatDate(selectedDateFrom.value)}`
  }

  if (selectedDateTo.value) {
    return `${t('expenses.filters.to')} ${formatDate(selectedDateTo.value)}`
  }

  return ''
})

const mobileExpenses = computed(() => filteredExpenses.value.slice(0, 4))

const categoryTotals = computed(() => {
  const totals = new Map<number, { categoryId: number; name: string; total: number }>()
  for (const expense of expenses.value) {
    const existing = totals.get(expense.categoryId)
    if (existing) {
      existing.total += expense.amount
      continue
    }

    totals.set(expense.categoryId, {
      categoryId: expense.categoryId,
      name: expense.categoryName,
      total: expense.amount,
    })
  }

  return [...totals.values()].sort((a, b) => b.total - a.total)
})

const maxCategoryTotal = computed(() => Math.max(1, ...categoryTotals.value.map((item) => item.total)))
const expensesList = computed(() =>
  expenses.value.map((expense) => {
    const date = new Date(`${expense.date}T00:00:00`)
    return {
      ...expense,
      title: expense.note?.trim() || expense.categoryName,
      dateLabel: new Intl.DateTimeFormat(locale.value, { month: 'short', day: 'numeric' }).format(date),
      dayLabel: new Intl.DateTimeFormat(locale.value, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(date),
    }
  })
)

const categoryColors = ['#8b5cf6', '#14b8a6', '#ef4444', '#ec4899', '#f59e0b', '#38bdf8']

/** Canonical catch-all from seed; keep last in lists regardless of legacy is_default flags on other defaults. */
function isCatchAllOtherCategory(category: { name: string }): boolean {
  return category.name.localeCompare('Other', locale.value, { sensitivity: 'base' }) === 0
}

const sortedCategories = computed(() =>
  [...categories.value].sort((a, b) => {
    const aLast = isCatchAllOtherCategory(a) ? 1 : 0
    const bLast = isCatchAllOtherCategory(b) ? 1 : 0
    if (aLast !== bLast) return aLast - bLast
    return a.name.localeCompare(b.name, locale.value, { sensitivity: 'base' })
  })
)

function getCategoryColor(index: number) {
  return categoryColors[index % categoryColors.length]
}

function getExpenseColor(expense: { categoryId: number }) {
  const categoryIndex = categories.value.findIndex((category) => category.id === expense.categoryId)
  return getCategoryColor(Math.max(0, categoryIndex))
}

function formatMoney(value: number) {
  const absoluteValue = Math.abs(value)
  const hasCents = !Number.isInteger(absoluteValue)

  return new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(absoluteValue)
}

function toInputDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function clearDateFilter() {
  selectedDateFrom.value = ''
  selectedDateTo.value = ''
  selectedRangePreset.value = null
}

function normalizeDateRange() {
  if (selectedDateFrom.value && selectedDateTo.value && selectedDateFrom.value > selectedDateTo.value) {
    const currentFrom = selectedDateFrom.value
    selectedDateFrom.value = selectedDateTo.value
    selectedDateTo.value = currentFrom
  }
}

function openTripRangeModal() {
  tripRangeForm.value.startDate = selectedDateFrom.value
  tripRangeForm.value.endDate = selectedDateTo.value
  isTripRangeModalOpen.value = true
}

function closeTripRangeModal() {
  isTripRangeModalOpen.value = false
}

function applyTripRangeFromModal() {
  if (!tripRangeForm.value.startDate || !tripRangeForm.value.endDate) return

  selectedDateFrom.value = tripRangeForm.value.startDate
  selectedDateTo.value = tripRangeForm.value.endDate
  normalizeDateRange()
  selectedRangePreset.value = 'tripWeek'
  closeTripRangeModal()
}

function getPeriodAnchorDate() {
  const now = new Date()
  const isCurrentPeriod = now.getFullYear() === period.value.year && now.getMonth() + 1 === period.value.month
  return isCurrentPeriod ? now : new Date(period.value.year, period.value.month, 0)
}

function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

function applyRangePreset(preset: 'last3' | 'last7' | 'tripWeek') {
  if (preset === 'tripWeek') {
    openTripRangeModal()
    return
  }

  const anchor = getPeriodAnchorDate()
  const days = preset === 'last3' ? 3 : 7
  const startDate = addDays(anchor, -(days - 1))
  selectedDateFrom.value = toInputDate(startDate)
  selectedDateTo.value = toInputDate(anchor)

  normalizeDateRange()
  selectedRangePreset.value = preset
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

function getDaysElapsedInMonth(year: number, month: number) {
  const now = new Date()
  const isCurrentMonth = now.getFullYear() === year && now.getMonth() + 1 === month
  return isCurrentMonth ? now.getDate() : getDaysInMonth(year, month)
}

async function loadExpensesData() {
  isLoading.value = true
  errorMessage.value = null

  try {
    const settled = await Promise.allSettled([
      fetchExpensesByPeriod(period.value.year, period.value.month),
      fetchIncomesByPeriod(period.value.year, period.value.month),
      fetchCategories(),
      fetchAccounts(),
    ])

    const failures: string[] = []

    const expensesResult = settled[0]
    if (expensesResult.status === 'fulfilled') {
      expenses.value = expensesResult.value
    } else {
      failures.push(
        expensesResult.reason instanceof Error
          ? expensesResult.reason.message
          : t('common.unexpectedError'),
      )
    }

    const incomesResult = settled[1]
    if (incomesResult.status === 'fulfilled') {
      incomes.value = incomesResult.value
    } else {
      failures.push(
        incomesResult.reason instanceof Error
          ? incomesResult.reason.message
          : t('common.unexpectedError'),
      )
    }

    const categoriesResult = settled[2]
    if (categoriesResult.status === 'fulfilled') {
      const categoriesData = categoriesResult.value
      categories.value = categoriesData
      if (!form.value.categoryId && categoriesData.length > 0) {
        form.value.categoryId = categoriesData[0].id
      }
    } else {
      failures.push(
        categoriesResult.reason instanceof Error
          ? categoriesResult.reason.message
          : t('common.unexpectedError'),
      )
    }

    const accountsResult = settled[3]
    if (accountsResult.status === 'fulfilled') {
      const accountsData = accountsResult.value
      accounts.value = accountsData
      if (!form.value.accountId && accountsData.length > 0) {
        form.value.accountId = accountsData[0].id
      }
    } else {
      failures.push(
        accountsResult.reason instanceof Error
          ? accountsResult.reason.message
          : t('common.unexpectedError'),
      )
    }

    errorMessage.value = failures.length > 0 ? failures.join(' · ') : null
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('common.unexpectedError')
  } finally {
    isLoading.value = false
  }
}

async function submitExpense() {
  if (!form.value.amount || !form.value.categoryId || !form.value.accountId) return

  const amount = Number(form.value.amount)
  if (!Number.isFinite(amount) || amount <= 0) return

  try {
    if (editingExpenseId.value) {
      await updateExpense(editingExpenseId.value, {
        date: form.value.date,
        amount,
        categoryId: form.value.categoryId,
        accountId: form.value.accountId,
        note: form.value.note.trim() || undefined,
      })
    } else {
      await createExpense({
        date: form.value.date,
        amount,
        categoryId: form.value.categoryId,
        accountId: form.value.accountId,
        note: form.value.note.trim() || undefined,
      })
    }

    await loadExpensesData()
    resetExpenseForm()
  } catch {
    /* Errors shown via global toast from apiFetch */
  }
}

async function submitAccount() {
  if (!newAccountName.value.trim()) return
  try {
    await createAccount(newAccountName.value.trim())
    newAccountName.value = ''
    await loadExpensesData()
  } catch {
    /* Errors shown via global toast from apiFetch */
  }
}

async function submitCategory() {
  if (!newCategoryName.value.trim()) return
  try {
    await createCategory(newCategoryName.value.trim())
    newCategoryName.value = ''
    await loadExpensesData()
  } catch {
    /* Errors shown via global toast from apiFetch */
  }
}

function resetExpenseForm() {
  editingExpenseId.value = null
  form.value.date = toInputDate(new Date())
  form.value.amount = ''
  form.value.note = ''
  if (categories.value.length > 0) {
    form.value.categoryId = categories.value[0].id
  }
  if (accounts.value.length > 0) {
    form.value.accountId = accounts.value[0].id
  }
  isExpenseModalOpen.value = false
}

function openNewExpenseModal() {
  editingExpenseId.value = null
  form.value.date = toInputDate(new Date())
  form.value.amount = ''
  form.value.note = ''
  if (categories.value.length > 0) {
    form.value.categoryId = categories.value[0].id
  }
  if (accounts.value.length > 0) {
    form.value.accountId = accounts.value[0].id
  }
  isExpenseModalOpen.value = true
}

function consumeNewExpenseQuery() {
  if (route.query.new !== '1') return
  openNewExpenseModal()
  const rest = { ...route.query }
  delete rest.new
  void router.replace({ path: route.path, query: rest })
}

function closeExpenseModal() {
  resetExpenseForm()
}

function startEditExpense(expense: Expense) {
  editingExpenseId.value = expense.id
  form.value.date = expense.date
  form.value.amount = String(expense.amount)
  form.value.categoryId = expense.categoryId
  form.value.accountId = expense.accountId
  form.value.note = expense.note ?? ''
  isExpenseModalOpen.value = true
}

async function removeExpense(expenseId: number) {
  if (!window.confirm('Delete this expense?')) return

  try {
    await deleteExpense(expenseId)
    if (editingExpenseId.value === expenseId) {
      resetExpenseForm()
    }
    await loadExpensesData()
  } catch {
    /* Errors shown via global toast from apiFetch */
  }
}

function openRenameAccountModal(account: Account) {
  renameTarget.value = {
    type: 'account',
    id: account.id,
    initialBalance: account.initialBalance,
    previousName: account.name,
  }
  renameNameInput.value = account.name
  isRenameModalOpen.value = true
}

function openRenameCategoryModal(category: Category) {
  renameTarget.value = {
    type: 'category',
    id: category.id,
    previousName: category.name,
  }
  renameNameInput.value = category.name
  isRenameModalOpen.value = true
}

function closeRenameModal() {
  isRenameModalOpen.value = false
  renameTarget.value = null
  renameNameInput.value = ''
}

async function submitRenameModal() {
  const target = renameTarget.value
  if (!target) return

  const trimmed = renameNameInput.value.trim()
  if (!trimmed) return

  if (trimmed === target.previousName) {
    closeRenameModal()
    return
  }

  try {
    if (target.type === 'account') {
      await updateAccount(target.id, { name: trimmed, initialBalance: target.initialBalance })
    } else {
      await updateCategory(target.id, trimmed)
    }

    closeRenameModal()
    await loadExpensesData()
  } catch {
    /* Errors shown via global toast from apiFetch */
  }
}

async function removeAccount(accountId: number) {
  if (!window.confirm('Delete this account?')) return

  try {
    await deleteAccount(accountId)
    await loadExpensesData()
  } catch {
    /* Errors shown via global toast from apiFetch */
  }
}

async function removeCategory(categoryId: number) {
  if (!window.confirm('Delete this category?')) return

  try {
    await deleteCategory(categoryId)
    await loadExpensesData()
  } catch {
    /* Errors shown via global toast from apiFetch */
  }
}

onMounted(() => {
  void loadExpensesData()
  consumeNewExpenseQuery()
})

watch(
  () => route.query.new,
  () => consumeNewExpenseQuery()
)
</script>

<template>
  <div class="app-shell">
    <FinanceNav />

    <main class="app-content app-mobile-screen">
      <div class="mx-auto max-w-7xl">
        <header class="mobile-page-header flex flex-wrap items-start justify-between gap-4 pt-9 lg:pt-0">
          <div>
            <p class="theme-muted text-xs font-bold uppercase tracking-wide lg:text-sm lg:normal-case lg:tracking-normal">
              {{ currentMonthLabel }}
            </p>
            <h1 class="mt-0.5 text-xl font-black leading-tight tracking-tight lg:text-[2rem]">
              {{ t('expenses.title') }}
            </h1>
            <p class="theme-muted mt-1 hidden text-sm lg:block">{{ expensesSubtitle }}</p>
          </div>
        </header>

        <section class="mobile-hero-card mt-4 rounded-2xl p-5 lg:hidden">
          <p class="text-xs font-black uppercase tracking-wide opacity-80">{{ t('expenses.mobile.spentInApril') }}</p>
          <strong class="mt-1 block text-[2rem] font-black leading-none">{{ formatMoney(summary.totalSpent) }}</strong>
          <p class="mt-2 text-xs opacity-80">{{ t('expenses.mobile.earnedAmount', { amount: formatMoney(summary.totalIncome) }) }}</p>
          <div class="mt-4 h-1.5 overflow-hidden rounded-full bg-white/25">
            <div class="h-full w-[62%] rounded-full bg-amber-400" />
          </div>
        </section>

        <section class="mt-6 hidden gap-4 sm:grid-cols-2 lg:grid xl:grid-cols-4">
          <article class="finance-card rounded-2xl p-4">
            <p class="theme-muted text-xs font-semibold">{{ t('expenses.summary.totalSpent') }}</p>
            <strong class="mt-1.5 block text-[1.7rem] font-black leading-tight">
              {{ formatMoney(summary.totalSpent) }}
            </strong>
          </article>
          <article class="finance-card rounded-2xl p-4">
            <p class="theme-muted text-xs font-semibold">{{ t('expenses.summary.dailyAverage') }}</p>
            <strong class="mt-1.5 block text-[1.7rem] font-black leading-tight">
              {{ formatMoney(summary.dailyAverage) }}
            </strong>
          </article>
          <article class="finance-card rounded-2xl p-4">
            <p class="theme-muted text-xs font-semibold">{{ t('expenses.summary.largestDay') }}</p>
            <strong class="mt-1.5 block text-[1.7rem] font-black leading-tight">
              {{ formatMoney(summary.largestDay) }}
            </strong>
          </article>
          <article class="finance-card rounded-2xl p-4">
            <p class="theme-muted text-xs font-semibold">{{ t('expenses.summary.cashFlow') }}</p>
            <strong class="mt-1.5 block text-[1.7rem] font-black leading-tight">{{ cashFlowLabel }}</strong>
          </article>
        </section>

        <section class="mt-4 grid gap-5 lg:mt-6">
          <div class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_18.5rem] xl:items-stretch xl:gap-5">
            <div class="flex min-h-0 min-w-0 flex-col gap-5 xl:h-full">
          <div class="finance-card hidden min-h-0 overflow-hidden rounded-2xl lg:flex lg:flex-col lg:min-h-0 xl:h-full xl:flex-1">
            <div class="theme-border flex flex-col gap-3 border-b p-4 md:flex-row md:items-center">
              <input
                v-model="searchQuery"
                class="theme-input min-h-10 flex-1 rounded-xl px-4 text-sm"
                type="search"
                :placeholder="t('expenses.searchPlaceholder')"
              />
              <button
                class="theme-button-primary flex min-h-10 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold"
                type="button"
                @click="openNewExpenseModal"
              >
                <FontAwesomeIcon icon="plus" />
                {{ t('expenses.actions.addExpense') }}
              </button>
            </div>

            <div class="theme-border flex items-center justify-between gap-3 border-b px-4 py-2.5">
              <div class="flex gap-2 overflow-x-auto">
                <button
                  :class="[
                    'finance-chip flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold',
                    { 'is-active': selectedCategoryId === 'all' },
                  ]"
                  type="button"
                  @click="selectedCategoryId = 'all'"
                >
                  <FontAwesomeIcon icon="layer-group" class="text-[0.7rem] opacity-90" />
                  {{ t('expenses.filters.all') }}
                </button>
                <button
                  v-for="(category, index) in sortedCategories"
                  :key="category.id"
                  :class="[
                    'finance-chip flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-bold',
                    { 'is-active': selectedCategoryId === category.id },
                  ]"
                  @click="selectedCategoryId = category.id"
                >
                  <FontAwesomeIcon
                    class="text-[0.65rem]"
                    :icon="categoryIconForName(category.name)"
                    :style="{ color: getCategoryColor(index) }"
                  />
                  {{ category.name }}
                </button>
              </div>
            </div>
            <div class="theme-border flex items-center gap-2 border-b px-4 py-2">
              <span class="theme-muted mr-1 text-xs font-semibold">{{ t('expenses.filters.quickRange') }}</span>
              <button
                :class="['finance-chip rounded-full px-3 py-1 text-[0.68rem] font-bold', { 'is-active': selectedRangePreset === 'last3' }]"
                type="button"
                @click="applyRangePreset('last3')"
              >
                {{ t('expenses.filters.last3Days') }}
              </button>
              <button
                :class="['finance-chip rounded-full px-3 py-1 text-[0.68rem] font-bold', { 'is-active': selectedRangePreset === 'last7' }]"
                type="button"
                @click="applyRangePreset('last7')"
              >
                {{ t('expenses.filters.last7Days') }}
              </button>
              <button
                :class="[
                  'finance-chip rounded-full px-3 py-1 text-[0.68rem] font-bold',
                  { 'is-active': selectedRangePreset === 'tripWeek' },
                ]"
                type="button"
                @click="applyRangePreset('tripWeek')"
              >
                {{ t('expenses.filters.tripWeek') }}
              </button>
              <button
                v-if="selectedDateFrom || selectedDateTo"
                class="theme-muted ml-auto text-[0.68rem] font-bold"
                type="button"
                @click="clearDateFilter"
              >
                {{ t('expenses.filters.clearDate') }}
              </button>
            </div>
            <div v-if="selectedDateFrom || selectedDateTo" class="theme-border border-b px-4 py-2 text-xs">
              <span class="theme-muted">
                {{ t('expenses.filters.selectedDateRangeSpend', { date: selectedRangeLabel, amount: formatMoney(selectedRangeSpent) }) }}
              </span>
            </div>

            <div class="expense-list flex min-h-0 flex-col xl:flex-1 xl:overflow-y-auto">
              <p v-if="isLoading" class="theme-muted p-6 text-center text-sm">
                {{ t('common.loading') }}
              </p>
              <p v-else-if="errorMessage" class="p-6 text-center text-sm" style="color: var(--color-danger)">
                {{ errorMessage }}
              </p>
              <div
                v-else-if="!expenses.length"
                class="flex flex-col items-center justify-center px-6 py-12 text-center xl:flex-1 xl:justify-center xl:py-8"
              >
                <div
                  class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                  style="background: color-mix(in srgb, var(--color-primary) 14%, transparent)"
                >
                  <FontAwesomeIcon icon="receipt" style="color: var(--color-primary)" />
                </div>
                <h3 class="text-lg font-black">{{ t('expenses.emptyMonth.title') }}</h3>
                <p class="theme-muted mt-2 max-w-md text-sm">
                  {{ t('expenses.emptyMonth.description') }}
                </p>
                <button
                  class="theme-button-primary mt-5 rounded-xl px-4 py-2.5 text-sm font-bold"
                  @click="openNewExpenseModal"
                >
                  {{ t('expenses.emptyMonth.cta') }}
                </button>
              </div>
              <article
                v-for="expense in filteredExpenses"
                :key="expense.id"
                class="expense-row grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-4 py-3.5"
              >
                <div
                  class="flex h-9 w-9 items-center justify-center rounded-xl"
                  :style="{ backgroundColor: `${getExpenseColor(expense)}18`, color: getExpenseColor(expense) }"
                >
                  <FontAwesomeIcon :icon="categoryIconForName(expense.categoryName)" />
                </div>
                <div>
                  <h2 class="text-sm font-black">{{ expense.title }}</h2>
                  <p class="theme-muted mt-0.5 text-xs">
                    {{ expense.dateLabel }} · {{ expense.categoryName }} · {{ expense.accountName }}
                  </p>
                </div>
                <strong class="text-sm font-black" style="color: var(--color-danger)">
                  -{{ formatMoney(expense.amount) }}
                </strong>
                <div class="flex items-center gap-2">
                  <button class="theme-muted text-xs font-bold" @click="startEditExpense(expense)">
                    {{ t('common.edit') }}
                  </button>
                  <button class="text-xs font-bold" style="color: var(--color-danger)" @click="removeExpense(expense.id)">
                    {{ t('common.delete') }}
                  </button>
                </div>
              </article>

              <p
                v-if="!isLoading && !errorMessage && !!expenses.length && !filteredExpenses.length"
                class="theme-muted p-6 text-center text-sm"
              >
                {{ t('expenses.empty') }}
              </p>
            </div>
          </div>

          <section class="mobile-entry-list space-y-3 lg:hidden">
            <article v-for="expense in mobileExpenses" :key="expense.id" class="mobile-entry-card rounded-xl p-3">
              <div class="mb-2 flex items-center justify-between">
                <span class="text-xs font-black">{{ expense.dayLabel }}</span>
                <span class="theme-muted text-xs">{{ formatMoney(expense.amount) }}</span>
              </div>
              <div class="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                <div
                  class="flex h-9 w-9 items-center justify-center rounded-xl"
                  :style="{ backgroundColor: `${getExpenseColor(expense)}18`, color: getExpenseColor(expense) }"
                >
                  <FontAwesomeIcon :icon="categoryIconForName(expense.categoryName)" />
                </div>
                <div>
                  <h2 class="text-sm font-black">{{ expense.title }}</h2>
                  <p class="theme-muted mt-0.5 text-[0.68rem]">
                    {{ expense.categoryName }} · {{ expense.accountName }}
                  </p>
                </div>
                <strong class="text-xs font-black" style="color: var(--color-danger)">
                  -{{ formatMoney(expense.amount) }}
                </strong>
              </div>
              <div class="mt-2 flex justify-end gap-2">
                <button class="theme-muted text-xs font-bold" @click="startEditExpense(expense)">
                  {{ t('common.edit') }}
                </button>
                <button class="text-xs font-bold" style="color: var(--color-danger)" @click="removeExpense(expense.id)">
                  {{ t('common.delete') }}
                </button>
              </div>
            </article>
            <div
              v-if="!isLoading && !errorMessage && !expenses.length"
              class="mobile-entry-card flex flex-col items-center rounded-xl p-5 text-center"
            >
              <div
                class="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl"
                style="background: color-mix(in srgb, var(--color-primary) 14%, transparent)"
              >
                <FontAwesomeIcon icon="receipt" style="color: var(--color-primary)" />
              </div>
              <h3 class="text-sm font-black">{{ t('expenses.emptyMonth.title') }}</h3>
              <p class="theme-muted mt-2 text-xs">{{ t('expenses.emptyMonth.description') }}</p>
              <button
                class="theme-button-primary mt-4 rounded-xl px-4 py-2 text-xs font-bold"
                @click="openNewExpenseModal"
              >
                {{ t('expenses.emptyMonth.cta') }}
              </button>
            </div>
            <p v-if="!isLoading && !errorMessage && !!expenses.length && !mobileExpenses.length" class="theme-muted px-2 text-center text-xs">
              {{ t('expenses.empty') }}
            </p>
          </section>
            </div>

          <aside class="hidden min-h-0 w-full max-w-[18.5rem] shrink-0 lg:flex lg:flex-col lg:gap-5 xl:h-full xl:min-h-0">
            <section class="finance-card flex min-h-0 flex-col overflow-hidden rounded-2xl xl:flex-1">
              <div class="shrink-0 px-4 pb-2 pt-4">
                <h2 class="theme-muted text-xs font-black uppercase tracking-wide">
                  {{ t('expenses.panels.byCategory') }}
                </h2>
              </div>
              <div class="flex min-h-0 flex-1 flex-col px-4 pb-4">
                <div
                  v-if="isLoading"
                  class="flex min-h-0 flex-1 flex-col justify-center py-8"
                >
                  <p class="theme-muted text-center text-sm">{{ t('common.loading') }}</p>
                </div>
                <div
                  v-else-if="!categoryTotals.length"
                  class="flex min-h-0 min-w-0 flex-1 basis-0 flex-col items-center justify-center rounded-xl px-4 py-8 text-center sm:px-5 sm:py-10"
                  style="
                    background: var(--color-surface-soft);
                    box-shadow: inset 0 1px 0 color-mix(in srgb, var(--color-border) 55%, transparent);
                  "
                >
                  <div
                    class="mb-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                    style="background: color-mix(in srgb, var(--color-primary) 14%, transparent)"
                  >
                    <FontAwesomeIcon icon="chart-pie" class="text-lg" style="color: var(--color-primary)" />
                  </div>
                  <p class="max-w-[15rem] text-sm font-black leading-snug">{{ t('expenses.panels.byCategoryEmptyTitle') }}</p>
                  <p class="theme-muted mt-2 max-w-[15rem] text-xs leading-relaxed">
                    {{ t('expenses.panels.byCategoryEmptyDescription') }}
                  </p>
                  <div class="mt-6 flex w-full max-w-[12rem] shrink-0 flex-col gap-2 opacity-[0.38]" aria-hidden="true">
                    <div class="h-2 rounded-full bg-[var(--color-border)]" style="width: 92%" />
                    <div class="h-2 rounded-full bg-[var(--color-border)]" style="width: 58%" />
                    <div class="h-2 rounded-full bg-[var(--color-border)]" style="width: 74%" />
                  </div>
                </div>
                <div v-else class="min-h-0 flex-1 space-y-3.5 overflow-y-auto pr-0.5">
                  <div v-for="(category, index) in categoryTotals" :key="category.name">
                    <div class="mb-1 flex justify-between text-sm">
                      <span class="flex items-center gap-2">
                        <span
                          class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[0.7rem]"
                          :style="{
                            backgroundColor: `${getCategoryColor(index)}22`,
                            color: getCategoryColor(index),
                          }"
                        >
                          <FontAwesomeIcon :icon="categoryIconForName(category.name)" />
                        </span>
                        {{ category.name }}
                      </span>
                      <strong>{{ formatMoney(category.total) }}</strong>
                    </div>
                    <div class="h-2 rounded-full" style="background: var(--color-surface-soft)">
                      <div
                        class="h-2 rounded-full"
                        :style="{
                          width: `${(category.total / maxCategoryTotal) * 100}%`,
                          backgroundColor: getCategoryColor(index),
                        }"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section class="finance-card flex min-h-0 flex-col rounded-2xl p-4 xl:flex-1">
              <h2 class="theme-muted shrink-0 text-xs font-black uppercase tracking-wide">
                {{ t('expenses.panels.byAccount') }}
              </h2>
              <div class="mt-4 flex min-h-0 flex-1 flex-col">
                <div
                  v-if="isLoading"
                  class="flex flex-1 flex-col justify-center py-6"
                >
                  <p class="theme-muted text-center text-sm">{{ t('common.loading') }}</p>
                </div>
                <div v-else class="flex flex-1 flex-col justify-start space-y-3 overflow-y-auto">
                  <div
                    v-for="account in accounts"
                    :key="account.id"
                    class="flex justify-between border-b pb-2 text-sm last:border-b-0 last:pb-0"
                    style="border-color: var(--color-border)"
                  >
                    <span class="theme-muted flex items-center gap-2">
                      <FontAwesomeIcon icon="building-columns" class="text-xs" />
                      {{ account.name }}
                    </span>
                    <strong :style="{ color: account.currentBalance < 0 ? 'var(--color-danger)' : undefined }">
                      {{ account.currentBalance < 0 ? '-' : '' }}{{ formatMoney(account.currentBalance) }}
                    </strong>
                  </div>
                </div>
              </div>
            </section>
          </aside>
          </div>

          <div class="finance-card overflow-hidden rounded-2xl">
            <div class="grid lg:grid-cols-2">
              <form
                class="flex flex-col border-b p-5 sm:p-6 lg:border-r lg:border-b-0"
                style="border-color: var(--color-border)"
                @submit.prevent="submitAccount"
              >
                <div class="mb-4 flex items-center gap-3">
                  <span
                    class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-[1.05rem]"
                    style="
                      background: color-mix(in srgb, var(--color-primary) 18%, transparent);
                      color: var(--color-primary);
                    "
                  >
                    <FontAwesomeIcon icon="building-columns" />
                  </span>
                  <h2 class="min-w-0 text-base font-black leading-tight tracking-tight">
                    {{ t('expenses.addAccount.title') }}
                  </h2>
                </div>

                <div
                  class="flex gap-2 rounded-2xl p-1.5 ring-1 ring-inset"
                  style="
                    background: var(--color-surface-soft);
                    box-shadow: inset 0 1px 0 color-mix(in srgb, var(--color-border) 65%, transparent);
                    --tw-ring-color: color-mix(in srgb, var(--color-border) 80%, transparent);
                  "
                >
                  <input
                    v-model="newAccountName"
                    type="text"
                    class="theme-input min-h-10 min-w-0 flex-1 rounded-xl border-0 bg-transparent px-3 py-2 text-sm shadow-none ring-0 focus:ring-0"
                    :placeholder="t('expenses.addAccount.placeholder')"
                  />
                  <button
                    type="submit"
                    class="theme-button-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base font-bold"
                    :aria-label="t('common.add')"
                  >
                    <FontAwesomeIcon icon="plus" />
                  </button>
                </div>

                <ul class="mt-4 flex max-h-[14rem] flex-col gap-1 overflow-y-auto pr-0.5">
                  <li
                    v-for="account in accounts"
                    :key="account.id"
                    class="group flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)]"
                  >
                    <span class="flex min-w-0 flex-1 items-center gap-2 truncate">
                      <span
                        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[0.7rem] opacity-90"
                        style="
                          background: color-mix(in srgb, var(--color-primary) 14%, transparent);
                          color: var(--color-primary);
                        "
                      >
                        <FontAwesomeIcon icon="wallet" />
                      </span>
                      <span class="truncate font-semibold">{{ account.name }}</span>
                    </span>
                    <div
                      class="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
                    >
                      <button
                        type="button"
                        class="theme-muted group/tooltip relative cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg text-[0.8rem] transition-colors hover:bg-[color-mix(in_srgb,var(--color-border)_80%,transparent)]"
                        :aria-label="t('common.edit')"
                        @click="openRenameAccountModal(account)"
                      >
                        <FontAwesomeIcon icon="pen-to-square" />
                        <span
                          class="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-[60] -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-[0.65rem] font-bold opacity-0 shadow-md transition-opacity duration-150 group-hover/tooltip:opacity-100 group-focus-visible/tooltip:opacity-100"
                          style="background: var(--color-text); color: var(--color-surface-strong)"
                          role="tooltip"
                        >
                          {{ t('common.edit') }}
                        </span>
                      </button>
                      <button
                        type="button"
                        class="group/tooltip relative cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg text-[0.8rem] transition-colors hover:bg-[color-mix(in_srgb,var(--color-danger)_14%,transparent)]"
                        style="color: var(--color-danger)"
                        :aria-label="t('common.delete')"
                        @click="removeAccount(account.id)"
                      >
                        <FontAwesomeIcon icon="trash-can" />
                        <span
                          class="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-[60] -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-[0.65rem] font-bold opacity-0 shadow-md transition-opacity duration-150 group-hover/tooltip:opacity-100 group-focus-visible/tooltip:opacity-100"
                          style="background: var(--color-text); color: var(--color-surface-strong)"
                          role="tooltip"
                        >
                          {{ t('common.delete') }}
                        </span>
                      </button>
                    </div>
                  </li>
                </ul>
              </form>

              <form class="flex flex-col p-5 sm:p-6" @submit.prevent="submitCategory">
                <div class="mb-4 flex items-center gap-3">
                  <span
                    class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-[1.05rem]"
                    style="background: color-mix(in srgb, #8b5cf6 22%, transparent); color: #a78bfa"
                  >
                    <FontAwesomeIcon icon="layer-group" />
                  </span>
                  <h2 class="min-w-0 text-base font-black leading-tight tracking-tight">
                    {{ t('expenses.addCategory.title') }}
                  </h2>
                </div>

                <div
                  class="flex gap-2 rounded-2xl p-1.5 ring-1 ring-inset"
                  style="
                    background: var(--color-surface-soft);
                    box-shadow: inset 0 1px 0 color-mix(in srgb, var(--color-border) 65%, transparent);
                    --tw-ring-color: color-mix(in srgb, var(--color-border) 80%, transparent);
                  "
                >
                  <input
                    v-model="newCategoryName"
                    type="text"
                    class="theme-input min-h-10 min-w-0 flex-1 rounded-xl border-0 bg-transparent px-3 py-2 text-sm shadow-none ring-0 focus:ring-0"
                    :placeholder="t('expenses.addCategory.placeholder')"
                  />
                  <button
                    type="submit"
                    class="theme-button-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base font-bold"
                    :aria-label="t('common.add')"
                  >
                    <FontAwesomeIcon icon="plus" />
                  </button>
                </div>

                <ul class="mt-4 flex min-h-0 max-h-[18rem] flex-col gap-1 overflow-y-auto overscroll-contain pr-0.5">
                  <li
                    v-for="(category, catIndex) in sortedCategories"
                    :key="category.id"
                    class="group flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-[color-mix(in_srgb,#8b5cf6_10%,transparent)]"
                  >
                    <span class="flex min-w-0 flex-1 items-center gap-2 truncate">
                      <span
                        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[0.65rem]"
                        :style="{
                          backgroundColor: `${getCategoryColor(catIndex)}22`,
                          color: getCategoryColor(catIndex),
                        }"
                      >
                        <FontAwesomeIcon :icon="categoryIconForName(category.name)" />
                      </span>
                      <span class="truncate font-semibold">{{ category.name }}</span>
                    </span>
                    <div
                      class="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
                    >
                      <button
                        type="button"
                        class="theme-muted group/tooltip relative cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg text-[0.8rem] transition-colors hover:bg-[color-mix(in_srgb,var(--color-border)_80%,transparent)]"
                        :aria-label="t('common.edit')"
                        @click="openRenameCategoryModal(category)"
                      >
                        <FontAwesomeIcon icon="pen-to-square" />
                        <span
                          class="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-[60] -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-[0.65rem] font-bold opacity-0 shadow-md transition-opacity duration-150 group-hover/tooltip:opacity-100 group-focus-visible/tooltip:opacity-100"
                          style="background: var(--color-text); color: var(--color-surface-strong)"
                          role="tooltip"
                        >
                          {{ t('common.edit') }}
                        </span>
                      </button>
                      <button
                        type="button"
                        class="group/tooltip relative cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg text-[0.8rem] transition-colors hover:bg-[color-mix(in_srgb,var(--color-danger)_14%,transparent)]"
                        style="color: var(--color-danger)"
                        :aria-label="t('common.delete')"
                        @click="removeCategory(category.id)"
                      >
                        <FontAwesomeIcon icon="trash-can" />
                        <span
                          class="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-[60] -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-[0.65rem] font-bold opacity-0 shadow-md transition-opacity duration-150 group-hover/tooltip:opacity-100 group-focus-visible/tooltip:opacity-100"
                          style="background: var(--color-text); color: var(--color-surface-strong)"
                          role="tooltip"
                        >
                          {{ t('common.delete') }}
                        </span>
                      </button>
                    </div>
                  </li>
                </ul>
              </form>
            </div>
          </div>
        </section>
      </div>

      <div
        v-if="isTripRangeModalOpen"
        class="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4"
        @click.self="closeTripRangeModal"
      >
        <div class="finance-card w-full max-w-md rounded-2xl p-5">
          <h2 class="text-lg font-black">{{ t('expenses.filters.tripWeekModalTitle') }}</h2>
          <p class="theme-muted mt-1 text-sm">{{ t('expenses.filters.tripWeekModalDescription') }}</p>

          <div class="mt-4 grid gap-3">
            <label class="text-sm font-semibold">
              {{ t('expenses.filters.from') }}
              <input
                v-model="tripRangeForm.startDate"
                type="date"
                class="theme-input mt-1 w-full rounded-xl p-3"
              />
            </label>
            <label class="text-sm font-semibold">
              {{ t('expenses.filters.to') }}
              <input
                v-model="tripRangeForm.endDate"
                type="date"
                class="theme-input mt-1 w-full rounded-xl p-3"
              />
            </label>
          </div>

          <div class="mt-5 flex justify-end gap-2">
            <button type="button" class="theme-button-secondary rounded-xl px-4 py-2.5 text-sm font-bold" @click="closeTripRangeModal">
              {{ t('common.cancel') }}
            </button>
            <button
              type="button"
              class="theme-button-primary rounded-xl px-4 py-2.5 text-sm font-bold"
              :disabled="!tripRangeForm.startDate || !tripRangeForm.endDate"
              @click="applyTripRangeFromModal"
            >
              {{ t('expenses.filters.applyRange') }}
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="isExpenseModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="expense-modal-title"
        @click.self="closeExpenseModal"
      >
        <div class="finance-card max-h-[min(90vh,44rem)] w-full max-w-md overflow-y-auto rounded-2xl p-5 shadow-xl">
          <h2 id="expense-modal-title" class="text-lg font-black">{{ expenseModalTitle }}</h2>
          <form class="mt-4 grid gap-3" @submit.prevent="submitExpense">
            <div class="grid gap-3 sm:grid-cols-2">
              <label class="text-sm font-semibold">
                {{ t('expenses.form.date') }}
                <input v-model="form.date" type="date" class="theme-input mt-1 w-full rounded-xl p-3" required />
              </label>
              <label class="text-sm font-semibold">
                {{ t('expenses.form.amount') }}
                <input
                  v-model="form.amount"
                  type="number"
                  min="0"
                  step="0.01"
                  class="theme-input mt-1 w-full rounded-xl p-3"
                  required
                />
              </label>
            </div>
            <fieldset class="min-w-0 border-0 p-0">
              <legend class="text-sm font-semibold">{{ t('expenses.form.category') }}</legend>
              <div
                class="theme-border mt-2 flex max-h-[11rem] flex-wrap gap-2 overflow-y-auto rounded-xl border p-2"
              >
                <button
                  v-for="category in sortedCategories"
                  :key="category.id"
                  type="button"
                  :class="[
                    'finance-chip flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold',
                    { 'is-active': form.categoryId === category.id },
                  ]"
                  @click="form.categoryId = category.id"
                  :aria-pressed="form.categoryId === category.id"
                >
                  <FontAwesomeIcon :icon="categoryIconForName(category.name)" class="text-[0.65rem] opacity-95" />
                  <span class="max-w-[9rem] truncate">{{ category.name }}</span>
                </button>
              </div>
            </fieldset>
            <label class="text-sm font-semibold">
              {{ t('expenses.form.account') }}
              <select v-model="form.accountId" class="theme-input mt-1 w-full rounded-xl p-3" required>
                <option v-for="account in accounts" :key="account.id" :value="account.id">
                  {{ account.name }}
                </option>
              </select>
            </label>
            <label class="text-sm font-semibold">
              {{ t('expenses.form.note') }}
              <input v-model="form.note" type="text" class="theme-input mt-1 w-full rounded-xl p-3" />
            </label>
            <div class="flex flex-wrap gap-2 pt-1">
              <button type="button" class="theme-button-secondary rounded-xl px-4 py-3 font-bold" @click="closeExpenseModal">
                {{ t('common.cancel') }}
              </button>
              <button type="submit" class="theme-button-primary min-w-[8rem] flex-1 rounded-xl px-4 py-3 font-bold">
                {{ editingExpenseId ? t('common.save') : t('expenses.form.submit') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div
        v-if="isRenameModalOpen && renameTarget"
        class="fixed inset-0 z-[52] flex items-center justify-center bg-black/40 px-4 py-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rename-modal-title"
        @click.self="closeRenameModal"
      >
        <div class="finance-card w-full max-w-md rounded-2xl p-5 shadow-xl">
          <h2 id="rename-modal-title" class="text-lg font-black">{{ renameModalTitle }}</h2>
          <form class="mt-4 grid gap-3" @submit.prevent="submitRenameModal">
            <label class="text-sm font-semibold">
              {{ renameModalNameLabel }}
              <input
                v-model="renameNameInput"
                type="text"
                class="theme-input mt-1 w-full rounded-xl p-3"
                autofocus
              />
            </label>
            <div class="flex flex-wrap gap-2 pt-1">
              <button type="button" class="theme-button-secondary rounded-xl px-4 py-3 font-bold" @click="closeRenameModal">
                {{ t('common.cancel') }}
              </button>
              <button
                type="submit"
                class="theme-button-primary min-w-[8rem] flex-1 rounded-xl px-4 py-3 font-bold"
                :disabled="!renameNameInput.trim()"
              >
                {{ t('common.save') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>
