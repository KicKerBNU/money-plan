<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FinanceNav from '@/modules/app/finance-nav.vue'
import { createIncome, fetchIncomes } from './api/income.api'
import type { IncomeEntry } from './domain/income.types'

const { t, locale } = useI18n()
const incomes = ref<IncomeEntry[]>([])
const loading = ref(false)
const errorMessage = ref('')

const form = ref({
  date: new Date().toISOString().slice(0, 10),
  amount: '',
  note: '',
})

const currencyFormatter = computed(
  () => new Intl.NumberFormat(locale.value, { style: 'currency', currency: 'USD' })
)

async function loadIncomes() {
  loading.value = true
  errorMessage.value = ''
  try {
    incomes.value = await fetchIncomes()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('common.unexpectedError')
  } finally {
    loading.value = false
  }
}

async function submitIncome() {
  try {
    await createIncome({
      date: form.value.date,
      amount: Number(form.value.amount),
      note: form.value.note || undefined,
    })
    form.value.amount = ''
    form.value.note = ''
    await loadIncomes()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('common.unexpectedError')
  }
}

onMounted(loadIncomes)
</script>

<template>
  <div class="theme-page min-h-screen p-6">
    <div class="mx-auto max-w-4xl">
      <FinanceNav />

      <h1 class="text-3xl font-bold">{{ t('income.title') }}</h1>
      <p class="theme-muted mt-1">{{ t('income.subtitle') }}</p>

      <form class="theme-card mt-6 grid gap-3 rounded-xl p-4" @submit.prevent="submitIncome">
        <label class="text-sm">
          {{ t('income.form.date') }}
          <input v-model="form.date" type="date" class="theme-input mt-1 w-full rounded p-2" />
        </label>
        <label class="text-sm">
          {{ t('income.form.amount') }}
          <input
            v-model="form.amount"
            type="number"
            min="0"
            step="0.01"
            class="theme-input mt-1 w-full rounded p-2"
          />
        </label>
        <label class="text-sm">
          {{ t('income.form.note') }}
          <input v-model="form.note" type="text" class="theme-input mt-1 w-full rounded p-2" />
        </label>
        <button class="theme-button-primary rounded px-4 py-2 font-semibold">
          {{ t('income.form.submit') }}
        </button>
      </form>

      <p v-if="errorMessage" class="mt-4 text-red-400">{{ errorMessage }}</p>
      <p v-else-if="loading" class="theme-muted mt-4">{{ t('common.loading') }}</p>

      <ul class="mt-6 space-y-2">
        <li
          v-for="income in incomes"
          :key="income.id"
          class="theme-card flex items-center justify-between rounded-lg px-4 py-3"
        >
          <span>{{ income.date }}</span>
          <span>{{ currencyFormatter.format(income.amount) }}</span>
          <span class="theme-muted">{{ income.note || '-' }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
