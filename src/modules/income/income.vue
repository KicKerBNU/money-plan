<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { getDefaultAccountId } from '@/lib/defaultAccount'
import { formatMonthYear } from '@/lib/dateDisplay'
import { useMoney } from '@/lib/money'
import { openConfirmModal } from '@/utils/confirmModal'
import { useDialogA11y } from '@/utils/useDialogA11y'
import FinanceNav from '@/modules/app/finance-nav.vue'
import IncomeSkeleton from '@/modules/income/IncomeSkeleton.vue'
import { useCashFlowStore } from '@/modules/app/store/cash-flow.store'
import { fetchAccounts } from '@/modules/expenses/api/expenses.api'
import type { Account } from '@/modules/expenses/domain/expenses.types'
import { RECURRENCE_FREQUENCIES, type RecurrenceFrequency } from '@/modules/expenses/domain/expenses.types'
import { createIncome, deleteIncome, fetchIncomesByPeriod, updateIncome } from './api/income.api'
import {
  fetchRecurringIncome,
  fetchRecurringIncomes,
} from '@/modules/recurring-incomes/api/recurring-incomes.api'
import type { IncomeEntry, RecurringIncome } from './domain/income.types'

const { t, locale } = useI18n()
const { format: formatMoney } = useMoney()
const cashFlowStore = useCashFlowStore()

const isLoading = ref(true)
const isRefreshing = ref(false)
const isSubmitting = ref(false)
const isFormOpen = ref(false)
const incomeDialogRef = ref<HTMLElement | null>(null)
const amountInputRef = ref<HTMLInputElement | null>(null)
const amountError = ref<string | null>(null)
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
  isRecurring: false,
  recurrenceFrequency: 'monthly' as RecurrenceFrequency,
})

const recurringIncomes = ref<RecurringIncome[]>([])
const linkedRecurring = ref<RecurringIncome | null>(null)
const editingIncomeId = ref<number | null>(null)

useDialogA11y({
  open: isFormOpen,
  dialogRef: incomeDialogRef,
  onDismiss: () => closeIncomeForm(),
  disabled: isSubmitting,
})

const periodMonthLabel = computed(() =>
  formatMonthYear(locale.value, period.value.year, period.value.month)
)

const formModalTitle = computed(() =>
  editingIncomeId.value ? t('income.form.editTitle') : t('income.form.addTitle')
)

const totalIncome = computed(() => incomeEntries.value.reduce((sum, entry) => sum + entry.amount, 0))

const lastEntryLabel = computed(() => {
  if (!incomeEntries.value.length) return '—'
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
      }).format(date),
      title: entry.note?.trim() || entry.accountName || t('income.title'),
      isRecurring: Boolean(entry.recurringIncomeId),
    }
  })
)

const showsRecurrenceSection = computed(() => {
  if (!editingIncomeId.value) return true
  const entry = incomeEntries.value.find((e) => e.id === editingIncomeId.value)
  return Boolean(entry?.recurringIncomeId || linkedRecurring.value)
})

const recurrenceFormHint = computed(() => {
  if (editingIncomeId.value) {
    if (form.value.isRecurring) return t('recurringIncome.form.editLinkedFooter')
    if (showsRecurrenceSection.value) return t('recurringIncome.form.stopRecurrenceHint')
    return ''
  }
  return form.value.isRecurring ? t('recurringIncome.form.footer') : ''
})

function frequencyLabel(frequency: RecurrenceFrequency) {
  return t(`recurring.frequency.${frequency}`)
}

function toInputDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function incomeBelongsToCalendarMonth(dateStr: string, year: number, month: number): boolean {
  const parts = dateStr.split('-').map(Number)
  const [y, m] = parts
  return parts.length >= 2 && Number.isFinite(y) && Number.isFinite(m) && y === year && m === month
}

function optimisticIncomeFromForm(
  previous: IncomeEntry,
  payload: { date: string; amount: number; accountId: number; note: string | null },
): IncomeEntry {
  const account = accounts.value.find((a) => a.id === payload.accountId)
  return {
    id: previous.id,
    date: payload.date,
    amount: payload.amount,
    accountId: payload.accountId,
    accountName: account?.name ?? previous.accountName,
    note: payload.note,
    recurringIncomeId: previous.recurringIncomeId,
  }
}

function shiftPeriod(delta: number) {
  let { year, month } = period.value
  month += delta
  if (month > 12) {
    month = 1
    year += 1
  } else if (month < 1) {
    month = 12
    year -= 1
  }
  period.value = { year, month }
  void loadIncomeData({ silent: true })
}

async function loadIncomeData(options?: { silent?: boolean }) {
  if (!options?.silent) {
    isLoading.value = true
  } else {
    isRefreshing.value = true
  }
  errorMessage.value = null
  await nextTick()

  try {
    const [incomesData, accountsData] = await Promise.all([
      fetchIncomesByPeriod(period.value.year, period.value.month),
      fetchAccounts(),
    ])

    incomeEntries.value = incomesData
    accounts.value = accountsData

    if (!form.value.accountId && accountsData.length > 0) {
      const id = getDefaultAccountId(accountsData)
      if (id !== undefined) form.value.accountId = id
    }

    try {
      recurringIncomes.value = await fetchRecurringIncomes()
    } catch {
      /* cache for linked income edit */
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('common.unexpectedError')
  } finally {
    isLoading.value = false
    isRefreshing.value = false
  }
}

function buildRecurrencePayload(editingId: number | null) {
  if (!editingId) {
    if (!form.value.isRecurring) return {}
    return { recurrenceFrequency: form.value.recurrenceFrequency }
  }
  if (!showsRecurrenceSection.value) return {}
  return {
    recurrenceEnabled: form.value.isRecurring,
    recurrenceFrequency: form.value.isRecurring ? form.value.recurrenceFrequency : undefined,
  }
}

function openNewIncomeForm() {
  editingIncomeId.value = null
  linkedRecurring.value = null
  amountError.value = null
  form.value.date = toInputDate(new Date())
  form.value.amount = ''
  form.value.note = ''
  form.value.isRecurring = false
  form.value.recurrenceFrequency = 'monthly'
  if (!form.value.accountId && accounts.value.length > 0) {
    const id = getDefaultAccountId(accounts.value)
    if (id !== undefined) form.value.accountId = id
  }
  isFormOpen.value = true
}

function closeIncomeForm() {
  if (isSubmitting.value) return
  isFormOpen.value = false
  editingIncomeId.value = null
  linkedRecurring.value = null
  amountError.value = null
}

function resetIncomeFormFields() {
  amountError.value = null
  form.value.amount = ''
  form.value.note = ''
  form.value.isRecurring = false
  form.value.recurrenceFrequency = 'monthly'
}

async function submitIncome() {
  if (isSubmitting.value) return
  if (!form.value.accountId) return

  const amount = Number(form.value.amount)
  if (!Number.isFinite(amount) || amount <= 0) {
    amountError.value = t('common.validation.amountPositive')
    await nextTick()
    amountInputRef.value?.focus()
    return
  }
  amountError.value = null

  const accountId = form.value.accountId
  const trimmedNote = form.value.note.trim()
  const viewYear = period.value.year
  const viewMonth = period.value.month
  const snapshot = [...incomeEntries.value]

  isSubmitting.value = true
  try {
    if (editingIncomeId.value) {
      const incomeId = editingIncomeId.value
      const previous = incomeEntries.value.find((e) => e.id === incomeId)
      if (!previous) return

      const payload = {
        date: form.value.date,
        amount,
        accountId,
        note: trimmedNote || undefined,
        ...buildRecurrencePayload(incomeId),
      }
      const optimisticNote = trimmedNote === '' ? null : trimmedNote

      if (incomeBelongsToCalendarMonth(payload.date, viewYear, viewMonth)) {
        incomeEntries.value = incomeEntries.value.map((e) =>
          e.id === incomeId
            ? optimisticIncomeFromForm(previous, { ...payload, note: optimisticNote })
            : e,
        )
      } else {
        incomeEntries.value = incomeEntries.value.filter((e) => e.id !== incomeId)
      }

      isFormOpen.value = false
      editingIncomeId.value = null
      linkedRecurring.value = null
      resetIncomeFormFields()

      try {
        const updated = await updateIncome(incomeId, payload)
        if (incomeBelongsToCalendarMonth(updated.date, viewYear, viewMonth)) {
          const i = incomeEntries.value.findIndex((e) => e.id === updated.id)
          if (i >= 0) {
            const next = [...incomeEntries.value]
            next[i] = updated
            incomeEntries.value = next
          } else {
            incomeEntries.value = [...incomeEntries.value, updated]
          }
        } else {
          incomeEntries.value = incomeEntries.value.filter((e) => e.id !== updated.id)
        }
        void cashFlowStore.refresh()
      } catch {
        /* Errors shown via global toast from apiFetch */
        incomeEntries.value = snapshot
      }
    } else {
      const payload = {
        date: form.value.date,
        amount,
        accountId,
        note: trimmedNote || undefined,
        ...buildRecurrencePayload(null),
      }
      const tempId = -Date.now()
      const account = accounts.value.find((a) => a.id === accountId)
      const optimistic: IncomeEntry = {
        id: tempId,
        date: payload.date,
        amount,
        accountId,
        accountName: account?.name ?? null,
        note: trimmedNote === '' ? null : trimmedNote,
      }

      if (incomeBelongsToCalendarMonth(payload.date, viewYear, viewMonth)) {
        incomeEntries.value = [...incomeEntries.value, optimistic]
      }

      isFormOpen.value = false
      editingIncomeId.value = null
      linkedRecurring.value = null
      resetIncomeFormFields()

      try {
        const created = await createIncome(payload)
        if (incomeBelongsToCalendarMonth(created.date, viewYear, viewMonth)) {
          const i = incomeEntries.value.findIndex((e) => e.id === tempId)
          if (i >= 0) {
            const next = [...incomeEntries.value]
            next[i] = created
            incomeEntries.value = next
          } else {
            incomeEntries.value = [...incomeEntries.value, created]
          }
        } else {
          incomeEntries.value = incomeEntries.value.filter((e) => e.id !== tempId)
        }
        void cashFlowStore.refresh()
      } catch {
        /* Errors shown via global toast from apiFetch */
        incomeEntries.value = snapshot
      }
    }
  } catch {
    /* Errors shown via global toast from apiFetch */
  } finally {
    isSubmitting.value = false
  }
}

async function startEditIncome(entry: IncomeEntry) {
  editingIncomeId.value = entry.id
  linkedRecurring.value = null
  amountError.value = null
  form.value.date = entry.date
  form.value.amount = String(entry.amount)
  form.value.accountId = entry.accountId ?? getDefaultAccountId(accounts.value) ?? null
  form.value.note = entry.note ?? ''
  form.value.isRecurring = false
  form.value.recurrenceFrequency = 'monthly'

  if (entry.recurringIncomeId) {
    try {
      const cached = recurringIncomes.value.find((r) => r.id === entry.recurringIncomeId)
      const item = cached ?? (await fetchRecurringIncome(entry.recurringIncomeId))
      linkedRecurring.value = item
      form.value.isRecurring = item.active
      form.value.recurrenceFrequency = item.frequency
    } catch {
      linkedRecurring.value = null
    }
  }

  isFormOpen.value = true
}

async function removeIncome(incomeId: number) {
  const ok = await openConfirmModal({
    title: t('income.confirmDelete.title'),
    message: t('income.confirmDelete.body'),
    confirmLabel: t('common.delete'),
    cancelLabel: t('common.cancel'),
  })
  if (!ok) return

  const snapshot = [...incomeEntries.value]
  incomeEntries.value = incomeEntries.value.filter((e) => e.id !== incomeId)

  if (editingIncomeId.value === incomeId) {
    closeIncomeForm()
  }

  try {
    await deleteIncome(incomeId)
    void cashFlowStore.refresh()
  } catch {
    /* Errors shown via global toast from apiFetch */
    incomeEntries.value = snapshot
  }
}

onMounted(() => {
  void loadIncomeData()
})
</script>

<template>
  <div class="app-shell" data-testid="income-page">
    <FinanceNav />

    <main class="app-content app-mobile-screen" :aria-busy="isLoading">
      <div class="app-finance-page-inner">
        <header class="mobile-page-header pt-9 lg:pt-0">
          <p class="theme-muted text-xs font-black uppercase tracking-[0.16em] lg:normal-case lg:tracking-normal">
            {{ t('appNav.brand') }} · {{ t('appNav.income') }}
          </p>
          <h1 class="mt-1 text-2xl font-black leading-tight tracking-tight lg:text-[2rem]">
            {{ t('income.title') }}
          </h1>
          <p class="theme-muted mt-1 max-w-2xl text-sm lg:text-[0.95rem]">
            {{ t('income.subtitle') }}
          </p>
        </header>

        <IncomeSkeleton v-if="isLoading" />
        <template v-else>
          <!-- Month navigation -->
          <div class="mt-5 flex items-center justify-between gap-3">
            <button
              type="button"
              class="theme-button-secondary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm"
              :aria-label="t('income.period.prev')"
              :disabled="isRefreshing"
              @click="shiftPeriod(-1)"
            >
              <FontAwesomeIcon icon="chevron-down" class="rotate-90" />
            </button>
            <p class="min-w-0 flex-1 text-center text-sm font-black tracking-tight">
              {{ periodMonthLabel }}
            </p>
            <button
              type="button"
              class="theme-button-secondary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm"
              :aria-label="t('income.period.next')"
              :disabled="isRefreshing"
              @click="shiftPeriod(1)"
            >
              <FontAwesomeIcon icon="chevron-down" class="-rotate-90" />
            </button>
          </div>

          <!-- Summary hero -->
          <section
            class="income-hero-card relative mt-4 overflow-hidden rounded-2xl p-5 sm:p-6"
            :class="{ 'opacity-70': isRefreshing }"
          >
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p class="theme-muted text-xs font-semibold uppercase tracking-wide">
                  {{ t('income.summary.totalForMonth', { month: periodMonthLabel }) }}
                </p>
                <strong
                  class="mt-2 block text-[2.25rem] font-black leading-none tabular-nums sm:text-[2.5rem]"
                  style="color: var(--color-positive)"
                >
                  +{{ formatMoney(totalIncome) }}
                </strong>
                <p class="theme-muted mt-3 text-xs sm:text-sm">
                  {{ t('income.summary.details', { count: incomeEntries.length, date: lastEntryLabel }) }}
                </p>
              </div>
              <div class="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[11rem]">
                <button
                  type="button"
                  class="theme-button-primary flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold"
                  @click="openNewIncomeForm"
                >
                  <FontAwesomeIcon icon="plus" class="text-xs" />
                  {{ t('income.actions.addIncome') }}
                </button>
                <RouterLink
                  to="/app/recurring-incomes"
                  class="theme-button-secondary flex min-h-10 w-full items-center justify-center gap-2 rounded-xl px-4 text-xs font-semibold"
                >
                  <FontAwesomeIcon icon="coins" class="text-[0.7rem]" />
                  {{ t('income.actions.manageRecurring') }}
                </RouterLink>
              </div>
            </div>
          </section>

          <!-- Income list -->
          <section
            class="finance-card mt-4 rounded-2xl lg:mt-6"
            :class="{ 'opacity-70': isRefreshing }"
          >
            <div class="theme-border flex items-center justify-between border-b px-4 py-3 sm:px-5">
              <h2 class="theme-muted text-xs font-black uppercase tracking-wide">
                {{ t('income.list.title') }}
              </h2>
              <strong class="text-xs font-black tabular-nums" style="color: var(--color-positive)">
                +{{ formatMoney(totalIncome) }}
              </strong>
            </div>

            <p v-if="errorMessage" class="p-6 text-center text-sm" style="color: var(--color-danger)">
              {{ errorMessage }}
            </p>

            <div
              v-else-if="!incomeRows.length"
              class="flex flex-col items-center px-6 py-12 text-center"
            >
              <div
                class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                style="background: color-mix(in srgb, var(--color-positive) 14%, transparent); color: var(--color-positive)"
              >
                <FontAwesomeIcon icon="arrow-trend-up" class="text-xl" />
              </div>
              <h3 class="text-base font-black">{{ t('income.empty.title') }}</h3>
              <p class="theme-muted mt-2 max-w-sm text-sm">{{ t('income.empty.body') }}</p>
              <button
                type="button"
                class="theme-button-primary mt-5 min-h-11 rounded-xl px-5 text-sm font-semibold"
                @click="openNewIncomeForm"
              >
                {{ t('income.empty.action') }}
              </button>
            </div>

            <ul v-else class="income-list">
              <li
                v-for="entry in incomeRows"
                :key="entry.id"
                :data-testid="`income-row-${entry.id}`"
                class="income-entry-row group/row"
                :class="{ 'is-editing': editingIncomeId === entry.id && isFormOpen }"
              >
                <div class="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                  <span
                    class="theme-muted hidden w-14 shrink-0 text-[0.68rem] font-semibold uppercase tracking-wide sm:block"
                  >
                    {{ entry.dateLabel }}
                  </span>
                  <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="truncate font-semibold">{{ entry.title }}</span>
                      <span
                        v-if="entry.isRecurring"
                        class="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.6rem] font-black uppercase tracking-wide"
                        style="background: color-mix(in srgb, var(--color-primary) 14%, transparent); color: var(--color-primary)"
                      >
                        <FontAwesomeIcon icon="arrows-rotate" class="text-[0.55rem]" />
                        {{ t('recurringIncome.form.isRecurring') }}
                      </span>
                    </div>
                    <p class="theme-muted mt-0.5 text-xs">
                      <span class="sm:hidden">{{ entry.dateLabel }} · </span>
                      {{ entry.accountName }}
                    </p>
                  </div>
                  <strong
                    class="shrink-0 text-sm font-black tabular-nums sm:text-base"
                    style="color: var(--color-positive)"
                  >
                    +{{ formatMoney(entry.amount) }}
                  </strong>
                </div>
                <div class="flex shrink-0 items-center gap-0.5">
                  <button
                    type="button"
                    data-testid="income-edit"
                    class="theme-muted group/tooltip relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-[color-mix(in_srgb,var(--color-border)_80%,transparent)]"
                    :aria-label="t('common.edit')"
                    @click="startEditIncome(entry)"
                  >
                    <FontAwesomeIcon icon="pen-to-square" />
                    <span
                      class="pointer-events-none absolute left-1/2 top-full z-[10050] mt-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-[0.65rem] font-semibold opacity-0 shadow-md transition-opacity duration-150 group-hover/tooltip:opacity-100 group-focus-visible/tooltip:opacity-100 sm:block"
                      style="background: var(--color-text); color: var(--color-surface-strong)"
                      role="tooltip"
                    >
                      {{ t('common.edit') }}
                    </span>
                  </button>
                  <button
                    type="button"
                    data-testid="income-delete"
                    class="group/tooltip relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-[color-mix(in_srgb,var(--color-danger)_14%,transparent)]"
                    style="color: var(--color-danger)"
                    :aria-label="t('common.delete')"
                    @click="removeIncome(entry.id)"
                  >
                    <FontAwesomeIcon icon="trash-can" />
                    <span
                      class="pointer-events-none absolute left-1/2 top-full z-[10050] mt-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-[0.65rem] font-semibold opacity-0 shadow-md transition-opacity duration-150 group-hover/tooltip:opacity-100 group-focus-visible/tooltip:opacity-100 sm:block"
                      style="background: var(--color-text); color: var(--color-surface-strong)"
                      role="tooltip"
                    >
                      {{ t('common.delete') }}
                    </span>
                  </button>
                </div>
              </li>
            </ul>
          </section>
        </template>
      </div>

      <!-- Add / edit modal (mobile + desktop) -->
      <Transition name="expense-backdrop">
        <div
          v-if="isFormOpen"
          ref="incomeDialogRef"
          class="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:px-4 sm:py-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="income-form-title"
          @click.self="!isSubmitting && closeIncomeForm()"
        >
          <div
            data-testid="income-modal"
            class="finance-card flex max-h-[90dvh] w-full flex-col rounded-t-2xl shadow-xl sm:max-h-[44rem] sm:max-w-lg sm:rounded-2xl"
          >
            <div
              class="mx-auto mt-3 mb-1 h-1 w-10 shrink-0 rounded-full opacity-40 sm:hidden"
              style="background: var(--color-border)"
              aria-hidden="true"
            />

            <div class="flex shrink-0 items-center justify-between gap-3 border-b px-5 py-4" style="border-color: var(--color-border)">
              <h2 id="income-form-title" data-testid="income-modal-title" class="text-lg font-black">
                {{ formModalTitle }}
              </h2>
              <button
                type="button"
                class="theme-muted flex h-9 w-9 items-center justify-center rounded-xl disabled:opacity-40"
                :aria-label="t('common.close')"
                :disabled="isSubmitting"
                @click="closeIncomeForm"
              >
                <FontAwesomeIcon icon="xmark" />
              </button>
            </div>

            <form class="flex min-h-0 flex-1 flex-col" @submit.prevent="submitIncome">
              <div class="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                <fieldset class="grid gap-3 border-0 p-0 sm:grid-cols-2" :disabled="isSubmitting">
                  <label class="block text-sm font-semibold">
                    {{ t('income.form.amount') }}
                    <input
                      ref="amountInputRef"
                      v-model="form.amount"
                      data-testid="income-form-amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      class="theme-input mt-1 w-full rounded-xl p-3"
                      required
                      autofocus
                      :aria-invalid="amountError ? true : undefined"
                      :aria-describedby="amountError ? 'income-amount-error' : undefined"
                      @input="amountError = null"
                    />
                    <p
                      v-if="amountError"
                      id="income-amount-error"
                      class="mt-1 text-xs font-semibold"
                      style="color: var(--color-danger)"
                      role="alert"
                    >
                      {{ amountError }}
                    </p>
                  </label>
                  <label class="block text-sm font-semibold">
                    {{ t('income.form.date') }}
                    <input
                      v-model="form.date"
                      data-testid="income-form-date"
                      type="date"
                      class="theme-input mt-1 w-full rounded-xl p-3"
                      required
                    />
                  </label>
                </fieldset>

                <label class="block text-sm font-semibold">
                  {{ t('income.form.account') }}
                  <select v-model="form.accountId" class="theme-input mt-1 w-full rounded-xl p-3" required>
                    <option v-for="account in accounts" :key="account.id" :value="account.id">
                      {{ account.name }}
                    </option>
                  </select>
                </label>

                <label class="block text-sm font-semibold">
                  {{ t('income.form.note') }}
                  <input
                    v-model="form.note"
                    data-testid="income-form-note"
                    type="text"
                    class="theme-input mt-1 w-full rounded-xl p-3"
                    :placeholder="t('income.form.notePlaceholder')"
                  />
                </label>

                <fieldset
                  v-if="showsRecurrenceSection"
                  class="theme-border border-t pt-4 border-0 p-0"
                  :disabled="isSubmitting"
                >
                  <legend class="text-sm font-semibold">{{ t('recurringIncome.form.isRecurring') }}</legend>
                  <label class="mt-2 flex cursor-pointer items-center gap-2 text-sm font-semibold">
                    <input
                      v-model="form.isRecurring"
                      type="checkbox"
                      class="h-4 w-4 accent-[var(--color-primary)]"
                    />
                    <span>{{ t('recurringIncome.form.isRecurring') }}</span>
                  </label>
                  <label v-if="form.isRecurring" class="mt-3 block text-sm font-semibold">
                    {{ t('recurring.form.frequency') }}
                    <select v-model="form.recurrenceFrequency" class="theme-input mt-1 w-full rounded-xl p-3">
                      <option v-for="frequency in RECURRENCE_FREQUENCIES" :key="frequency" :value="frequency">
                        {{ frequencyLabel(frequency) }}
                      </option>
                    </select>
                  </label>
                  <p v-if="recurrenceFormHint" class="theme-muted mt-2 text-xs leading-relaxed">
                    {{ recurrenceFormHint }}
                  </p>
                </fieldset>
              </div>

              <div class="shrink-0 border-t px-5 py-4" style="border-color: var(--color-border)">
                <button
                  type="submit"
                  data-testid="income-form-submit"
                  class="theme-button-primary flex w-full min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="isSubmitting"
                  :aria-busy="isSubmitting"
                >
                  <FontAwesomeIcon v-if="isSubmitting" icon="spinner" class="h-4 w-4 animate-spin" />
                  {{
                    isSubmitting
                      ? t('common.saving')
                      : editingIncomeId
                        ? t('common.save')
                        : t('income.form.submit')
                  }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </main>
  </div>
</template>

<style scoped>
.income-entry-row {
  position: relative;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  font-size: 0.875rem;
  transition: background-color 0.15s ease;
}

@media (min-width: 640px) {
  .income-entry-row {
    padding: 0.875rem 1.25rem;
  }
}

.income-entry-row:hover {
  z-index: 40;
  background: color-mix(in srgb, var(--color-primary) 5%, transparent);
}

.income-entry-row.is-editing {
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
}

.expense-backdrop-enter-active,
.expense-backdrop-leave-active {
  transition: opacity 0.2s ease;
}
.expense-backdrop-enter-from,
.expense-backdrop-leave-to {
  opacity: 0;
}
</style>
