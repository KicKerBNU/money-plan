<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FinanceNav from '@/modules/app/finance-nav.vue'
import FinancePageSkeleton from '@/modules/app/FinancePageSkeleton.vue'
import {
  deleteRecurringIncome,
  fetchRecurringIncomes,
  setRecurringIncomeActive,
  updateRecurringIncome,
} from '@/modules/recurring-incomes/api/recurring-incomes.api'
import { fetchAccounts } from '@/modules/expenses/api/expenses.api'
import type { Account } from '@/modules/expenses/domain/expenses.types'
import { RECURRENCE_FREQUENCIES, type RecurrenceFrequency } from '@/modules/expenses/domain/expenses.types'
import type { RecurringIncome } from '@/modules/income/domain/income.types'
import { useMoney } from '@/lib/money'
import { openConfirmModal } from '@/utils/confirmModal'

const { t, locale } = useI18n()
const { format: formatMoney } = useMoney()

const isLoading = ref(true)
const errorMessage = ref<string | null>(null)
const items = ref<RecurringIncome[]>([])
const accounts = ref<Account[]>([])

const isEditModalOpen = ref(false)
const isEditSubmitting = ref(false)
const editTargetId = ref<number | null>(null)
const editForm = ref({
  amount: '',
  accountId: null as number | null,
  note: '',
  frequency: 'monthly' as RecurrenceFrequency,
  startDate: '',
  active: true,
})

function formatShortDate(iso: string) {
  const date = new Date(`${iso.slice(0, 10)}T12:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat(locale.value, { dateStyle: 'medium' }).format(date)
}

function frequencyLabel(frequency: RecurrenceFrequency) {
  return t(`recurring.frequency.${frequency}`)
}

async function loadData() {
  isLoading.value = true
  errorMessage.value = null
  try {
    const [recurring, acc] = await Promise.all([fetchRecurringIncomes(), fetchAccounts()])
    items.value = recurring
    accounts.value = acc
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('common.unexpectedError')
  } finally {
    isLoading.value = false
  }
}

async function toggleActive(item: RecurringIncome, active: boolean) {
  const snapshot = [...items.value]
  items.value = items.value.map((row) => (row.id === item.id ? { ...row, active } : row))
  try {
    const saved = await setRecurringIncomeActive(item.id, active)
    items.value = items.value.map((row) => (row.id === saved.id ? saved : row))
  } catch {
    items.value = snapshot
    await loadData()
  }
}

function openEditModal(item: RecurringIncome) {
  editTargetId.value = item.id
  editForm.value = {
    amount: String(item.amount),
    accountId: item.accountId,
    note: item.note ?? '',
    frequency: item.frequency,
    startDate: item.startDate.slice(0, 10),
    active: item.active,
  }
  isEditModalOpen.value = true
}

function closeEditModal() {
  if (isEditSubmitting.value) return
  isEditModalOpen.value = false
  editTargetId.value = null
}

async function submitEditModal() {
  const id = editTargetId.value
  if (id == null || isEditSubmitting.value) return

  const amount = Number(editForm.value.amount)
  const accountId = editForm.value.accountId
  if (!Number.isFinite(amount) || amount <= 0 || accountId == null || !editForm.value.startDate) {
    return
  }

  isEditSubmitting.value = true
  try {
    const saved = await updateRecurringIncome(id, {
      amount,
      accountId,
      note: editForm.value.note.trim() || undefined,
      frequency: editForm.value.frequency,
      startDate: editForm.value.startDate,
    })
    const synced =
      editForm.value.active !== saved.active
        ? await setRecurringIncomeActive(id, editForm.value.active)
        : saved
    items.value = items.value.map((row) => (row.id === synced.id ? synced : row))
    closeEditModal()
  } catch {
    /* toast from apiFetch */
  } finally {
    isEditSubmitting.value = false
  }
}

async function removeItem(item: RecurringIncome) {
  const ok = await openConfirmModal({
    title: t('recurringIncome.confirmDelete.title'),
    message: t('recurringIncome.confirmDelete.body'),
    confirmLabel: t('common.delete'),
    cancelLabel: t('common.cancel'),
  })
  if (!ok) return

  const snapshot = [...items.value]
  items.value = items.value.filter((row) => row.id !== item.id)
  try {
    await deleteRecurringIncome(item.id)
  } catch {
    items.value = snapshot
    await loadData()
  }
}

onMounted(() => {
  void loadData()
})
</script>

<template>
  <div class="app-shell">
    <FinanceNav />

    <main class="app-content app-mobile-screen" :aria-busy="isLoading">
      <div class="app-finance-page-inner">
        <header class="mobile-page-header pt-9 lg:pt-0">
          <p class="theme-muted text-xs font-black uppercase tracking-[0.16em]">
            {{ t('appNav.brand') }} · {{ t('appNav.recurringIncome') }}
          </p>
          <h1 class="mt-1 text-2xl font-black leading-tight tracking-tight lg:text-[2rem]">
            {{ t('recurringIncome.title') }}
          </h1>
          <p class="theme-muted mt-1 max-w-2xl text-sm lg:text-[0.95rem]">
            {{ t('recurringIncomePage.subtitle') }}
          </p>
        </header>

        <section class="finance-card mt-6 rounded-2xl p-5 sm:p-6">
          <h2 class="theme-muted text-xs font-black uppercase tracking-wide">
            {{ t('recurringIncomePage.listTitle') }}
          </h2>

          <FinancePageSkeleton v-if="isLoading" variant="accounts" />
          <p v-else-if="errorMessage" class="mt-4 text-sm" style="color: var(--color-danger)">
            {{ errorMessage }}
          </p>
          <p v-else-if="!items.length" class="theme-muted mt-4 text-sm">
            {{ t('recurringIncome.empty.body') }}
          </p>

          <ul v-else class="mt-4 space-y-3">
            <li
              v-for="item in items"
              :key="item.id"
              class="rounded-xl border px-4 py-4 transition-colors hover:bg-[color-mix(in_srgb,var(--color-primary)_6%,transparent)]"
              style="border-color: var(--color-border)"
            >
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <strong
                      class="text-lg font-black tabular-nums"
                      style="color: var(--color-positive)"
                      :class="{ 'theme-muted': !item.active }"
                    >
                      +{{ formatMoney(item.amount) }}
                    </strong>
                    <span
                      class="rounded-md px-2 py-0.5 text-[0.65rem] font-black uppercase tracking-wide"
                      :style="
                        item.active
                          ? {
                              background: 'color-mix(in srgb, var(--color-primary) 18%, transparent)',
                              color: 'var(--color-primary)',
                            }
                          : {
                              background: 'color-mix(in srgb, var(--color-border) 60%, transparent)',
                              color: 'var(--color-muted)',
                            }
                      "
                    >
                      {{ item.active ? frequencyLabel(item.frequency) : t('recurring.status.paused') }}
                    </span>
                  </div>
                  <p class="theme-muted mt-1 text-sm">{{ item.accountName }}</p>
                  <p v-if="item.active" class="theme-muted mt-1 text-xs">
                    {{ t('recurringIncome.nextDue', { date: formatShortDate(item.nextDate) }) }}
                  </p>
                  <p v-if="item.note" class="theme-muted mt-1 text-xs">{{ item.note }}</p>
                </div>

                <div class="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    class="theme-muted flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[color-mix(in_srgb,var(--color-border)_80%,transparent)]"
                    :aria-label="t('common.edit')"
                    @click="openEditModal(item)"
                  >
                    <FontAwesomeIcon icon="pen-to-square" />
                  </button>
                  <button
                    type="button"
                    class="theme-muted flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[color-mix(in_srgb,var(--color-danger)_12%,transparent)]"
                    :aria-label="t('common.delete')"
                    @click="removeItem(item)"
                  >
                    <FontAwesomeIcon icon="trash-can" />
                  </button>
                </div>
              </div>

              <label class="mt-3 flex cursor-pointer items-center justify-between gap-3 text-sm font-semibold">
                <span>{{ t('recurringIncome.form.isRecurring') }}</span>
                <input
                  type="checkbox"
                  class="h-4 w-4 accent-[var(--color-primary)]"
                  :checked="item.active"
                  @change="toggleActive(item, ($event.target as HTMLInputElement).checked)"
                />
              </label>
            </li>
          </ul>
        </section>
      </div>

      <div
        v-if="isEditModalOpen"
        class="fixed inset-0 z-[52] flex items-end justify-center bg-black/40 sm:items-center sm:px-4 sm:py-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recurring-income-edit-title"
        @click.self="!isEditSubmitting && closeEditModal()"
      >
        <div
          class="finance-card flex max-h-[90dvh] w-full flex-col rounded-t-2xl shadow-xl sm:max-h-[44rem] sm:max-w-lg sm:rounded-2xl"
        >
          <div class="flex shrink-0 items-center justify-between gap-3 border-b px-5 py-4" style="border-color: var(--color-border)">
            <h2 id="recurring-income-edit-title" class="text-lg font-black">{{ t('recurringIncome.edit.title') }}</h2>
            <button
              type="button"
              class="theme-muted flex h-9 w-9 items-center justify-center rounded-xl"
              :aria-label="t('common.close')"
              :disabled="isEditSubmitting"
              @click="closeEditModal"
            >
              <FontAwesomeIcon icon="xmark" />
            </button>
          </div>

          <form class="flex min-h-0 flex-1 flex-col" @submit.prevent="submitEditModal">
            <div class="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              <label class="block text-sm font-semibold">
                {{ t('income.form.amount') }}
                <input
                  v-model="editForm.amount"
                  type="number"
                  min="0"
                  step="0.01"
                  class="theme-input mt-1 w-full rounded-xl p-3"
                  required
                />
              </label>
              <label class="block text-sm font-semibold">
                {{ t('expenses.form.account') }}
                <select v-model="editForm.accountId" class="theme-input mt-1 w-full rounded-xl p-3" required>
                  <option v-for="account in accounts" :key="account.id" :value="account.id">
                    {{ account.name }}
                  </option>
                </select>
              </label>
              <label class="block text-sm font-semibold">
                {{ t('recurring.form.frequency') }}
                <select v-model="editForm.frequency" class="theme-input mt-1 w-full rounded-xl p-3">
                  <option v-for="frequency in RECURRENCE_FREQUENCIES" :key="frequency" :value="frequency">
                    {{ frequencyLabel(frequency) }}
                  </option>
                </select>
              </label>
              <label class="block text-sm font-semibold">
                {{ t('recurring.form.startDate') }}
                <input v-model="editForm.startDate" type="date" class="theme-input mt-1 w-full rounded-xl p-3" required />
              </label>
              <label class="flex items-center justify-between gap-3 text-sm font-semibold">
                <span>{{ t('recurringIncome.form.isRecurring') }}</span>
                <input v-model="editForm.active" type="checkbox" class="h-4 w-4 accent-[var(--color-primary)]" />
              </label>
              <label class="block text-sm font-semibold">
                {{ t('income.form.notePlaceholder') }}
                <input v-model="editForm.note" type="text" class="theme-input mt-1 w-full rounded-xl p-3" />
              </label>
            </div>
            <div class="shrink-0 border-t px-5 py-4" style="border-color: var(--color-border)">
              <button
                type="submit"
                class="theme-button-primary w-full rounded-xl px-4 py-3 font-semibold disabled:opacity-60"
                :disabled="isEditSubmitting"
              >
                {{ isEditSubmitting ? t('common.saving') : t('common.save') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>
