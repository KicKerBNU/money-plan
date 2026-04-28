<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FinanceNav from '@/modules/app/finance-nav.vue'

const { t, locale } = useI18n()

const form = ref({
  date: '2026-04-27',
  amount: '',
  note: '',
})

const incomeEntries = [
  { id: 1, date: 'APR 22', note: 'Side gig — workshop', amount: 480 },
  { id: 2, date: 'APR 15', note: 'Refund — flight', amount: 75 },
  { id: 3, date: 'APR 8', note: 'Freelance — landing page', amount: 320 },
  { id: 4, date: 'APR 1', note: 'Salary — April', amount: 4200 },
]

const totalIncome = 5075

function formatMoney(value: number) {
  const hasCents = !Number.isInteger(value)

  return new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value)
}

function submitIncome() {
  form.value.amount = ''
  form.value.note = ''
}
</script>

<template>
  <div class="app-shell">
    <FinanceNav />

    <main class="app-content">
      <div class="mx-auto max-w-5xl">
        <header class="pt-9 lg:pt-0">
          <p class="theme-muted text-sm font-bold">{{ t('appNav.brand') }} · {{ t('appNav.period') }}</p>
          <h1 class="mt-0.5 text-[2rem] font-black leading-tight tracking-tight">{{ t('income.title') }}</h1>
          <p class="theme-muted mt-1 text-sm">{{ t('income.subtitle') }}</p>
        </header>

        <section class="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <article class="finance-card rounded-2xl p-6">
            <p class="theme-muted text-xs font-semibold">{{ t('income.summary.totalIncome') }}</p>
            <strong class="mt-2 block text-[2.2rem] font-black leading-none" style="color: var(--color-positive)">
              +{{ formatMoney(totalIncome) }}
            </strong>
            <p class="theme-muted mt-3 text-xs">{{ t('income.summary.details') }}</p>
          </article>

          <form class="finance-card rounded-2xl p-5" @submit.prevent="submitIncome">
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
            <button class="theme-button-primary mt-3 min-h-9 w-full rounded-lg px-4 text-sm font-bold">
              {{ t('income.form.submit') }}
            </button>
          </form>
        </section>

        <section class="finance-card mt-6 overflow-hidden rounded-2xl">
          <div class="theme-border flex items-center justify-between border-b px-4 py-3">
            <h2 class="theme-muted text-xs font-black uppercase tracking-wide">
              {{ t('income.recent.title') }}
            </h2>
            <strong class="text-xs font-black" style="color: var(--color-positive)">
              +{{ formatMoney(totalIncome) }}
            </strong>
          </div>

          <div class="income-list">
            <article
              v-for="entry in incomeEntries"
              :key="entry.id"
              class="grid grid-cols-[4.5rem_1fr_auto] items-center gap-4 px-4 py-3.5 text-sm"
            >
              <span class="theme-muted text-[0.68rem] font-bold tracking-wide">{{ entry.date }}</span>
              <span class="font-bold">{{ entry.note }}</span>
              <strong class="font-black" style="color: var(--color-positive)">
                +{{ formatMoney(entry.amount) }}
              </strong>
            </article>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>
