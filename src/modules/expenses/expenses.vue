<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FinanceNav from '@/modules/app/finance-nav.vue'

const { t, locale } = useI18n()
const searchQuery = ref('')
const selectedCategoryId = ref('all')
const isExpenseFormOpen = ref(false)

interface MockCategory {
  id: string
  name: string
}

interface MockExpense {
  id: number
  title: string
  dateLabel: string
  categoryId: string
  categoryName: string
  accountName: string
  amount: number
}

interface MockCategoryTotal {
  name: string
  total: number
}

interface MockAccount {
  name: string
  balance: number
}

const summary = {
  totalSpent: 3065.48,
  dailyAverage: 122.62,
  largestDay: 1690.4,
  cashFlow: '+$2,010',
  entriesCount: 28,
}

const categories: MockCategory[] = [
  { id: 'rent', name: 'Rent' },
  { id: 'groceries', name: 'Groceries' },
  { id: 'health', name: 'Health' },
  { id: 'shopping', name: 'Shopping' },
  { id: 'dining', name: 'Dining' },
  { id: 'utilities', name: 'Utilities' },
]

const expenses: MockExpense[] = [
  {
    id: 1,
    title: 'Grocery',
    dateLabel: 'Apr 25',
    categoryId: 'groceries',
    categoryName: 'Groceries',
    accountName: 'Checking',
    amount: 96.4,
  },
  {
    id: 2,
    title: 'Bouldering pass',
    dateLabel: 'Apr 24',
    categoryId: 'entertainment',
    categoryName: 'Entertainment',
    accountName: 'Cash',
    amount: 14.2,
  },
  {
    id: 3,
    title: 'Lunch',
    dateLabel: 'Apr 23',
    categoryId: 'dining',
    categoryName: 'Dining',
    accountName: 'Credit Card',
    amount: 33.2,
  },
  {
    id: 4,
    title: 'Books',
    dateLabel: 'Apr 22',
    categoryId: 'shopping',
    categoryName: 'Shopping',
    accountName: 'Credit Card',
    amount: 58,
  },
  {
    id: 5,
    title: 'Spotify duo',
    dateLabel: 'Apr 21',
    categoryId: 'subscriptions',
    categoryName: 'Subscriptions',
    accountName: 'Credit Card',
    amount: 12.5,
  },
  {
    id: 6,
    title: 'Grocery',
    dateLabel: 'Apr 20',
    categoryId: 'groceries',
    categoryName: 'Groceries',
    accountName: 'Checking',
    amount: 102.8,
  },
]

const categoryTotals: MockCategoryTotal[] = [
  { name: 'Rent', total: 1450 },
  { name: 'Groceries', total: 531 },
  { name: 'Health', total: 240 },
  { name: 'Shopping', total: 235 },
  { name: 'Dining', total: 217 },
  { name: 'Utilities', total: 208 },
]

const accounts: MockAccount[] = [
  { name: 'Checking', balance: 4281 },
  { name: 'Cash', balance: 215 },
  { name: 'Credit Card', balance: -842 },
  { name: 'Savings', balance: 8410 },
]

const form = ref({
  date: '2026-04-25',
  amount: '',
  categoryId: 'groceries',
  accountName: 'Checking',
  note: '',
})

const newAccountName = ref('')
const newCategoryName = ref('')

const currentMonthLabel = computed(() => t('appNav.period'))

const expensesSubtitle = computed(() => t('expenses.subtitle', { count: summary.entriesCount }))

const filteredExpenses = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return expenses.filter((expense) => {
    const matchesCategory = selectedCategoryId.value === 'all' || expense.categoryId === selectedCategoryId.value
    const matchesSearch =
      !query ||
      [expense.title, expense.categoryName, expense.accountName, expense.dateLabel].some((value) =>
        value.toLowerCase().includes(query)
      )

    return matchesCategory && matchesSearch
  })
})

const maxCategoryTotal = computed(() => Math.max(1, ...categoryTotals.map((item) => item.total)))

const categoryColors = ['#8b5cf6', '#14b8a6', '#ef4444', '#ec4899', '#f59e0b', '#38bdf8']

function getCategoryColor(index: number) {
  return categoryColors[index % categoryColors.length]
}

function getExpenseColor(expense: MockExpense) {
  const categoryIndex = categories.findIndex((category) => category.id === expense.categoryId)
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

function submitExpense() {
  form.value.amount = ''
  form.value.note = ''
  isExpenseFormOpen.value = false
}

function submitAccount() {
  if (!newAccountName.value.trim()) return
  newAccountName.value = ''
}

function submitCategory() {
  if (!newCategoryName.value.trim()) return
  newCategoryName.value = ''
}
</script>

<template>
  <div class="app-shell">
    <FinanceNav />

    <main class="app-content">
      <div class="mx-auto max-w-7xl">
        <header class="flex flex-wrap items-start justify-between gap-4 pt-9 lg:pt-0">
          <div>
            <p class="theme-muted text-sm font-bold">{{ t('appNav.brand') }} · {{ currentMonthLabel }}</p>
            <h1 class="mt-0.5 text-[2rem] font-black leading-tight tracking-tight">{{ t('expenses.title') }}</h1>
            <p class="theme-muted mt-1 text-sm">{{ expensesSubtitle }}</p>
          </div>
        </header>

        <section class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
            <strong class="mt-1.5 block text-[1.7rem] font-black leading-tight">{{ summary.cashFlow }}</strong>
          </article>
        </section>

        <section class="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_18.5rem]">
          <div class="finance-card overflow-hidden rounded-2xl">
            <div class="theme-border flex flex-col gap-3 border-b p-4 md:flex-row md:items-center">
              <input
                v-model="searchQuery"
                class="theme-input min-h-10 flex-1 rounded-xl px-4 text-sm"
                type="search"
                :placeholder="t('expenses.searchPlaceholder')"
              />
              <button
                class="theme-button-primary flex min-h-10 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold"
                @click="isExpenseFormOpen = !isExpenseFormOpen"
              >
                <FontAwesomeIcon icon="plus" />
                {{ t('expenses.actions.addExpense') }}
              </button>
            </div>

            <div class="theme-border flex gap-2 overflow-x-auto border-b px-4 py-2.5">
              <button
                :class="[
                  'finance-chip shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold',
                  { 'is-active': selectedCategoryId === 'all' },
                ]"
                @click="selectedCategoryId = 'all'"
              >
                {{ t('expenses.filters.all') }}
              </button>
              <button
                v-for="(category, index) in categories"
                :key="category.id"
                :class="[
                  'finance-chip flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-bold',
                  { 'is-active': selectedCategoryId === category.id },
                ]"
                @click="selectedCategoryId = category.id"
              >
                <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: getCategoryColor(index) }" />
                {{ category.name }}
              </button>
            </div>

            <div class="expense-list">
              <article
                v-for="expense in filteredExpenses"
                :key="expense.id"
                class="expense-row grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-4 py-3.5"
              >
                <div
                  class="flex h-9 w-9 items-center justify-center rounded-xl"
                  :style="{ backgroundColor: `${getExpenseColor(expense)}18`, color: getExpenseColor(expense) }"
                >
                  <FontAwesomeIcon icon="receipt" />
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
                <span class="theme-muted text-lg">&rsaquo;</span>
              </article>

              <p v-if="!filteredExpenses.length" class="theme-muted p-6 text-center text-sm">
                {{ t('expenses.empty') }}
              </p>
            </div>
          </div>

          <aside class="space-y-5">
            <form
              v-if="isExpenseFormOpen"
              class="finance-card grid gap-3 rounded-2xl p-5"
              @submit.prevent="submitExpense"
            >
              <h2 class="text-lg font-black">{{ t('expenses.form.title') }}</h2>
              <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <label class="text-sm font-semibold">
                  {{ t('expenses.form.date') }}
                  <input v-model="form.date" type="date" class="theme-input mt-1 w-full rounded-xl p-3" />
                </label>
                <label class="text-sm font-semibold">
                  {{ t('expenses.form.amount') }}
                  <input
                    v-model="form.amount"
                    type="number"
                    min="0"
                    step="0.01"
                    class="theme-input mt-1 w-full rounded-xl p-3"
                  />
                </label>
                <label class="text-sm font-semibold">
                  {{ t('expenses.form.category') }}
                  <select v-model="form.categoryId" class="theme-input mt-1 w-full rounded-xl p-3">
                    <option v-for="category in categories" :key="category.id" :value="String(category.id)">
                      {{ category.name }}
                    </option>
                  </select>
                </label>
                <label class="text-sm font-semibold">
                  {{ t('expenses.form.account') }}
                  <select v-model="form.accountName" class="theme-input mt-1 w-full rounded-xl p-3">
                    <option v-for="account in accounts" :key="account.name" :value="account.name">
                      {{ account.name }}
                    </option>
                  </select>
                </label>
              </div>
              <label class="text-sm font-semibold">
                {{ t('expenses.form.note') }}
                <input v-model="form.note" type="text" class="theme-input mt-1 w-full rounded-xl p-3" />
              </label>
              <button class="theme-button-primary rounded-2xl px-4 py-3 font-bold">
                {{ t('expenses.form.submit') }}
              </button>
            </form>

            <section class="finance-card rounded-2xl p-4">
              <h2 class="theme-muted text-xs font-black uppercase tracking-wide">
                {{ t('expenses.panels.byCategory') }}
              </h2>
              <div class="mt-4 space-y-3.5">
                <div v-for="(category, index) in categoryTotals" :key="category.name">
                  <div class="mb-1 flex justify-between text-sm">
                    <span class="flex items-center gap-2">
                      <span
                        class="h-2.5 w-2.5 rounded-full"
                        :style="{ backgroundColor: getCategoryColor(index) }"
                      />
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
            </section>

            <section class="finance-card rounded-2xl p-4">
              <h2 class="theme-muted text-xs font-black uppercase tracking-wide">
                {{ t('expenses.panels.byAccount') }}
              </h2>
              <div class="mt-4 space-y-3">
                <div
                  v-for="account in accounts"
                  :key="account.name"
                  class="flex justify-between border-b pb-2 text-sm last:border-b-0 last:pb-0"
                  style="border-color: var(--color-border)"
                >
                  <span class="theme-muted flex items-center gap-2">
                    <FontAwesomeIcon icon="building-columns" class="text-xs" />
                    {{ account.name }}
                  </span>
                  <strong :style="{ color: account.balance < 0 ? 'var(--color-danger)' : undefined }">
                    {{ account.balance < 0 ? '-' : '' }}{{ formatMoney(account.balance) }}
                  </strong>
                </div>
              </div>
            </section>

            <div v-if="isExpenseFormOpen" class="grid gap-4">
              <form class="finance-card rounded-[2rem] p-5" @submit.prevent="submitAccount">
                <h2 class="font-bold">{{ t('expenses.addAccount.title') }}</h2>
                <div class="mt-3 flex gap-2">
                  <input
                    v-model="newAccountName"
                    type="text"
                    class="theme-input min-w-0 flex-1 rounded-xl p-3"
                    :placeholder="t('expenses.addAccount.placeholder')"
                  />
                  <button class="theme-button-secondary rounded-xl px-4 font-bold">{{ t('common.add') }}</button>
                </div>
              </form>
              <form class="finance-card rounded-[2rem] p-5" @submit.prevent="submitCategory">
                <h2 class="font-bold">{{ t('expenses.addCategory.title') }}</h2>
                <div class="mt-3 flex gap-2">
                  <input
                    v-model="newCategoryName"
                    type="text"
                    class="theme-input min-w-0 flex-1 rounded-xl p-3"
                    :placeholder="t('expenses.addCategory.placeholder')"
                  />
                  <button class="theme-button-secondary rounded-xl px-4 font-bold">{{ t('common.add') }}</button>
                </div>
              </form>
            </div>
          </aside>
        </section>
      </div>
    </main>
  </div>
</template>
