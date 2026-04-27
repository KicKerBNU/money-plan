<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FinanceNav from '@/modules/app/finance-nav.vue'
import {
  createAccount,
  createCategory,
  createExpense,
  fetchAccounts,
  fetchCategories,
  fetchExpenses,
} from './api/expenses.api'
import type { Account, Category, Expense } from './domain/expenses.types'

const { t, locale } = useI18n()
const expenses = ref<Expense[]>([])
const accounts = ref<Account[]>([])
const categories = ref<Category[]>([])
const errorMessage = ref('')

const form = ref({
  date: new Date().toISOString().slice(0, 10),
  amount: '',
  categoryId: '',
  accountId: '',
  note: '',
})

const newAccountName = ref('')
const newCategoryName = ref('')

const currencyFormatter = computed(
  () => new Intl.NumberFormat(locale.value, { style: 'currency', currency: 'USD' })
)

async function loadData() {
  errorMessage.value = ''
  try {
    const [expensesData, accountsData, categoriesData] = await Promise.all([
      fetchExpenses(),
      fetchAccounts(),
      fetchCategories(),
    ])
    expenses.value = expensesData
    accounts.value = accountsData
    categories.value = categoriesData

    if (!form.value.accountId && accountsData[0]) form.value.accountId = String(accountsData[0].id)
    if (!form.value.categoryId && categoriesData[0]) form.value.categoryId = String(categoriesData[0].id)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('common.unexpectedError')
  }
}

async function submitExpense() {
  try {
    await createExpense({
      date: form.value.date,
      amount: Number(form.value.amount),
      categoryId: Number(form.value.categoryId),
      accountId: Number(form.value.accountId),
      note: form.value.note || undefined,
    })
    form.value.amount = ''
    form.value.note = ''
    await loadData()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('common.unexpectedError')
  }
}

async function submitAccount() {
  if (!newAccountName.value.trim()) return
  try {
    await createAccount(newAccountName.value.trim())
    newAccountName.value = ''
    await loadData()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('common.unexpectedError')
  }
}

async function submitCategory() {
  if (!newCategoryName.value.trim()) return
  try {
    await createCategory(newCategoryName.value.trim())
    newCategoryName.value = ''
    await loadData()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('common.unexpectedError')
  }
}

onMounted(loadData)
</script>

<template>
  <div class="theme-page min-h-screen p-6">
    <div class="mx-auto max-w-5xl">
      <FinanceNav />

      <h1 class="text-3xl font-bold">{{ t('expenses.title') }}</h1>
      <p class="theme-muted mt-1">{{ t('expenses.subtitle') }}</p>

      <form class="theme-card mt-6 grid gap-3 rounded-xl p-4" @submit.prevent="submitExpense">
        <div class="grid gap-3 md:grid-cols-2">
          <label class="text-sm">
            {{ t('expenses.form.date') }}
            <input v-model="form.date" type="date" class="theme-input mt-1 w-full rounded p-2" />
          </label>
          <label class="text-sm">
            {{ t('expenses.form.amount') }}
            <input
              v-model="form.amount"
              type="number"
              min="0"
              step="0.01"
              class="theme-input mt-1 w-full rounded p-2"
            />
          </label>
          <label class="text-sm">
            {{ t('expenses.form.category') }}
            <select v-model="form.categoryId" class="theme-input mt-1 w-full rounded p-2">
              <option v-for="category in categories" :key="category.id" :value="String(category.id)">
                {{ category.name }}
              </option>
            </select>
          </label>
          <label class="text-sm">
            {{ t('expenses.form.account') }}
            <select v-model="form.accountId" class="theme-input mt-1 w-full rounded p-2">
              <option v-for="account in accounts" :key="account.id" :value="String(account.id)">
                {{ account.name }}
              </option>
            </select>
          </label>
        </div>
        <label class="text-sm">
          {{ t('expenses.form.note') }}
          <input v-model="form.note" type="text" class="theme-input mt-1 w-full rounded p-2" />
        </label>
        <button class="theme-button-primary rounded px-4 py-2 font-semibold">
          {{ t('expenses.form.submit') }}
        </button>
      </form>

      <div class="mt-4 grid gap-4 md:grid-cols-2">
        <form class="theme-card rounded-xl p-4" @submit.prevent="submitAccount">
          <h2 class="font-semibold">{{ t('expenses.addAccount.title') }}</h2>
          <div class="mt-2 flex gap-2">
            <input
              v-model="newAccountName"
              type="text"
              class="theme-input w-full rounded p-2"
              :placeholder="t('expenses.addAccount.placeholder')"
            />
            <button class="theme-button-secondary rounded px-3">{{ t('common.add') }}</button>
          </div>
        </form>
        <form class="theme-card rounded-xl p-4" @submit.prevent="submitCategory">
          <h2 class="font-semibold">{{ t('expenses.addCategory.title') }}</h2>
          <div class="mt-2 flex gap-2">
            <input
              v-model="newCategoryName"
              type="text"
              class="theme-input w-full rounded p-2"
              :placeholder="t('expenses.addCategory.placeholder')"
            />
            <button class="theme-button-secondary rounded px-3">{{ t('common.add') }}</button>
          </div>
        </form>
      </div>

      <p v-if="errorMessage" class="mt-4 text-red-400">{{ errorMessage }}</p>

      <ul class="mt-6 space-y-2">
        <li
          v-for="expense in expenses"
          :key="expense.id"
          class="theme-card grid grid-cols-5 gap-3 rounded-lg px-4 py-3 text-sm"
        >
          <span>{{ expense.date }}</span>
          <span>{{ currencyFormatter.format(expense.amount) }}</span>
          <span>{{ expense.categoryName }}</span>
          <span>{{ expense.accountName }}</span>
          <span class="theme-muted">{{ expense.note || '-' }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
