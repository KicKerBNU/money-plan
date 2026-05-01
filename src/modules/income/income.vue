<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FinanceNav from '@/modules/app/finance-nav.vue'
import { fetchAccounts } from '@/modules/expenses/api/expenses.api'
import type { Account } from '@/modules/expenses/domain/expenses.types'
import { createIncome, deleteIncome, fetchIncomesByPeriod, updateIncome } from './api/income.api'
import type { IncomeEntry } from './domain/income.types'

const { t, locale } = useI18n()
const isLoading = ref(true)
const errorMessage = ref<string | null>(null)
const accounts = ref<Account[]>([])
const incomeEntries = ref<IncomeEntry[]>([])
const today = new Date()
const period = ref({
  year: today.getFullYear(),
  month: today.getMonth() + 1,
})

const form = ref({
  date: toInputDate(new Date()),
  amount: '',
  accountId: null as number | null,
  note: '',
})
const editingIncomeId = ref<number | null>(null)

const totalIncome = computed(() => incomeEntries.value.reduce((sum, entry) => sum + entry.amount, 0))
const lastEntryLabel = computed(() => {
  if (!incomeEntries.value.length) return '-'
  const latest = incomeEntries.value.reduce((max, current) => (current.date > max.date ? current : max))
  return new Intl.DateTimeFormat(locale.value, {
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${latest.date}T00:00:00`))
})
const incomeRows = computed(() =>
  incomeEntries.value.map((entry) => {
    const date = new Date(`${entry.date}T00:00:00`)
    return {
      ...entry,
      dateLabel: new Intl.DateTimeFormat(locale.value, {
        month: 'short',
        day: 'numeric',
      }).format(date).toUpperCase(),
      title: entry.note?.trim() || entry.accountName || 'Income',
    }
  })
)

function formatMoney(value: number) {
  const hasCents = !Number.isInteger(value)

  return new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value)
}

function toInputDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

async function loadIncomeData() {
  isLoading.value = true
  errorMessage.value = null

  try {
    const [incomesData, accountsData] = await Promise.all([
      fetchIncomesByPeriod(period.value.year, period.value.month),
      fetchAccounts(),
    ])

    incomeEntries.value = incomesData
    accounts.value = accountsData

    if (!form.value.accountId && accountsData.length > 0) {
      form.value.accountId = accountsData[0].id
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('common.unexpectedError')
  } finally {
    isLoading.value = false
  }
}

async function submitIncome() {
  if (!form.value.amount || !form.value.accountId) return

  const amount = Number(form.value.amount)
  if (!Number.isFinite(amount) || amount <= 0) return

  try {
    if (editingIncomeId.value) {
      await updateIncome(editingIncomeId.value, {
        date: form.value.date,
        amount,
        accountId: form.value.accountId,
        note: form.value.note.trim() || undefined,
      })
    } else {
      await createIncome({
        date: form.value.date,
        amount,
        accountId: form.value.accountId,
        note: form.value.note.trim() || undefined,
      })
    }

    await loadIncomeData()
    resetIncomeForm()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('common.unexpectedError')
  }
}

function resetIncomeForm() {
  editingIncomeId.value = null
  form.value.amount = ''
  form.value.note = ''
}

function startEditIncome(entry: IncomeEntry) {
  editingIncomeId.value = entry.id
  form.value.date = entry.date
  form.value.amount = String(entry.amount)
  form.value.accountId = entry.accountId ?? accounts.value[0]?.id ?? null
  form.value.note = entry.note ?? ''
}

async function removeIncome(incomeId: number) {
  if (!window.confirm('Delete this income?')) return

  try {
    await deleteIncome(incomeId)
    if (editingIncomeId.value === incomeId) {
      resetIncomeForm()
    }
    await loadIncomeData()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('common.unexpectedError')
  }
}

onMounted(() => {
  void loadIncomeData()
})
</script>

<template>
  <div class="app-shell">
    <FinanceNav />

    <main class="app-content app-mobile-screen">
      <div class="mx-auto max-w-5xl">
        <header class="mobile-page-header pt-9 lg:pt-0">
          <p class="theme-muted text-xs font-bold uppercase tracking-wide lg:text-sm lg:normal-case lg:tracking-normal">
            {{ t('appNav.period') }}
          </p>
          <h1 class="mt-0.5 text-xl font-black leading-tight tracking-tight lg:text-[2rem]">
            {{ t('income.title') }}
          </h1>
          <p class="theme-muted mt-1 hidden text-sm lg:block">{{ t('income.subtitle') }}</p>
        </header>

        <section class="mt-4 grid gap-4 lg:mt-6 lg:grid-cols-[1fr_1fr]">
          <article class="income-hero-card rounded-2xl p-5 lg:p-6">
            <p class="theme-muted text-xs font-semibold">{{ t('income.summary.totalIncome') }}</p>
            <strong class="mt-2 block text-[2.2rem] font-black leading-none" style="color: var(--color-positive)">
              +{{ formatMoney(totalIncome) }}
            </strong>
            <p class="theme-muted mt-3 text-xs">
              {{ t('income.summary.details', { count: incomeEntries.length, date: lastEntryLabel }) }}
            </p>
          </article>

          <form class="finance-card hidden rounded-2xl p-5 lg:block" @submit.prevent="submitIncome">
            <h2 class="text-xs font-bold">{{ t('income.quickAdd.title') }}</h2>
            <div class="mt-3 grid grid-cols-[1fr_auto] gap-2">
              <input
                v-model="form.amount"
                type="number"
                min="0"
                step="0.01"
                class="theme-input min-h-9 min-w-0 rounded-lg px-3 text-sm"
                :placeholder="t('income.form.amount')"
              />
              <input v-model="form.date" type="date" class="theme-input min-h-9 rounded-lg px-3 text-sm" />
            </div>
            <input
              v-model="form.note"
              type="text"
              class="theme-input mt-2 min-h-9 w-full rounded-lg px-3 text-sm"
              :placeholder="t('income.form.notePlaceholder')"
            />
            <select v-model="form.accountId" class="theme-input mt-2 min-h-9 w-full rounded-lg px-3 text-sm">
              <option v-for="account in accounts" :key="account.id" :value="account.id">
                {{ account.name }}
              </option>
            </select>
            <button class="theme-button-primary mt-3 min-h-9 w-full rounded-lg px-4 text-sm font-bold">
              {{ editingIncomeId ? t('common.save') : t('income.form.submit') }}
            </button>
            <button
              v-if="editingIncomeId"
              type="button"
              class="theme-button-secondary mt-2 min-h-9 w-full rounded-lg px-4 text-sm font-bold"
              @click="resetIncomeForm"
            >
              {{ t('common.cancel') }}
            </button>
          </form>
        </section>

        <section class="finance-card mt-4 hidden overflow-hidden rounded-2xl lg:mt-6 lg:block">
          <div class="theme-border flex items-center justify-between border-b px-4 py-3">
            <h2 class="theme-muted text-xs font-black uppercase tracking-wide">
              {{ t('income.recent.title') }}
            </h2>
            <strong class="text-xs font-black" style="color: var(--color-positive)">
              +{{ formatMoney(totalIncome) }}
            </strong>
          </div>

          <div class="income-list">
            <p v-if="isLoading" class="theme-muted p-6 text-center text-sm">{{ t('common.loading') }}</p>
            <p v-else-if="errorMessage" class="p-6 text-center text-sm" style="color: var(--color-danger)">
              {{ errorMessage }}
            </p>
            <article
              v-for="entry in incomeRows"
              :key="entry.id"
              class="grid grid-cols-[4.5rem_1fr_auto_auto] items-center gap-4 px-4 py-3.5 text-sm"
            >
              <span class="theme-muted text-[0.68rem] font-bold tracking-wide">{{ entry.dateLabel }}</span>
              <span class="font-bold">{{ entry.title }}</span>
              <strong class="font-black" style="color: var(--color-positive)">
                +{{ formatMoney(entry.amount) }}
              </strong>
              <div class="flex items-center gap-2">
                <button class="theme-muted text-xs font-bold" @click="startEditIncome(entry)">
                  {{ t('common.edit') }}
                </button>
                <button class="text-xs font-bold" style="color: var(--color-danger)" @click="removeIncome(entry.id)">
                  {{ t('common.delete') }}
                </button>
              </div>
            </article>
          </div>
        </section>

        <section class="mobile-entry-list mt-4 space-y-3 lg:hidden">
          <article v-for="entry in incomeRows" :key="entry.id" class="mobile-entry-card rounded-xl p-4">
            <div class="flex items-center justify-between gap-3">
              <div>
                <h2 class="text-sm font-black">{{ entry.title }}</h2>
                <p class="theme-muted mt-1 text-[0.68rem]">{{ entry.dateLabel }}</p>
              </div>
              <strong class="text-xs font-black" style="color: var(--color-positive)">
                +{{ formatMoney(entry.amount) }}
              </strong>
            </div>
            <div class="mt-2 flex justify-end gap-2">
              <button class="theme-muted text-xs font-bold" @click="startEditIncome(entry)">
                {{ t('common.edit') }}
              </button>
              <button class="text-xs font-bold" style="color: var(--color-danger)" @click="removeIncome(entry.id)">
                {{ t('common.delete') }}
              </button>
            </div>
          </article>
        </section>
      </div>
    </main>
  </div>
</template>
