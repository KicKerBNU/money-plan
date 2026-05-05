<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import FinanceNav from '@/modules/app/finance-nav.vue'
import FinancePageSkeleton from '@/modules/app/FinancePageSkeleton.vue'
import {
  createAccount,
  deleteAccount,
  fetchAccounts,
  setAccountDefault,
  updateAccount,
} from '@/modules/expenses/api/expenses.api'
import type { Account } from '@/modules/expenses/domain/expenses.types'
import { openConfirmModal } from '@/utils/confirmModal'

const { t, locale } = useI18n()

const isLoading = ref(true)
const errorMessage = ref<string | null>(null)
const accounts = ref<Account[]>([])
const orderedAccounts = ref<Account[]>([])
const newAccountName = ref('')
const isCreating = ref(false)
const isPersistingOrder = ref(false)

const dragFromIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

const renameTarget = ref<{ id: number; initialBalance: number; previousName: string } | null>(null)
const isRenameModalOpen = ref(false)
const renameNameInput = ref('')

function sortAccountsList(accs: Account[]): Account[] {
  return [...accs].sort((a, b) => {
    if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1
    return a.name.localeCompare(b.name, locale.value)
  })
}

watch(
  accounts,
  (next) => {
    orderedAccounts.value = sortAccountsList(next)
  },
  { deep: true }
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

async function loadAccounts() {
  isLoading.value = true
  errorMessage.value = null
  try {
    accounts.value = await fetchAccounts()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('common.unexpectedError')
  } finally {
    isLoading.value = false
  }
}

async function submitNewAccount() {
  const name = newAccountName.value.trim()
  if (!name || isCreating.value) return
  isCreating.value = true
  try {
    await createAccount(name)
    newAccountName.value = ''
    await loadAccounts()
  } catch {
    /* toast from apiFetch */
  } finally {
    isCreating.value = false
  }
}

function openRenameModal(account: Account) {
  renameTarget.value = {
    id: account.id,
    initialBalance: account.initialBalance,
    previousName: account.name,
  }
  renameNameInput.value = account.name
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
    await updateAccount(target.id, { name: trimmed, initialBalance: target.initialBalance })
    closeRenameModal()
    await loadAccounts()
  } catch {
    /* toast from apiFetch */
  }
}

async function removeAccount(accountId: number) {
  const ok = await openConfirmModal({
    title: t('expenses.confirmDelete.accountTitle'),
    message: t('expenses.confirmDelete.accountBody'),
    confirmLabel: t('common.delete'),
    cancelLabel: t('common.cancel'),
  })
  if (!ok) return
  try {
    await deleteAccount(accountId)
    await loadAccounts()
  } catch {
    /* toast from apiFetch */
  }
}

function onDragStart(index: number, event: DragEvent) {
  dragFromIndex.value = index
  event.dataTransfer?.setData('text/plain', String(index))
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
  }
}

function onDragEnd() {
  dragFromIndex.value = null
  dragOverIndex.value = null
}

function onDragOverRow(index: number, event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
  dragOverIndex.value = index
}

async function onDropOnRow(targetIndex: number) {
  const from = dragFromIndex.value
  dragOverIndex.value = null
  dragFromIndex.value = null

  if (from === null || from === targetIndex || isPersistingOrder.value) return

  const arr = [...orderedAccounts.value]
  const [item] = arr.splice(from, 1)
  arr.splice(targetIndex, 0, item)
  orderedAccounts.value = arr

  const first = arr[0]
  const prevDefaultId = accounts.value.find((a) => a.isDefault)?.id
  if (!first || first.id === prevDefaultId) return

  isPersistingOrder.value = true
  try {
    await setAccountDefault(first.id)
    await loadAccounts()
  } catch {
    orderedAccounts.value = sortAccountsList(accounts.value)
  } finally {
    isPersistingOrder.value = false
  }
}

onMounted(() => {
  void loadAccounts()
})
</script>

<template>
  <div class="app-shell">
    <FinanceNav />

    <main class="app-content app-mobile-screen" :aria-busy="isLoading">
      <div class="app-finance-page-inner">
        <header class="mobile-page-header pt-9 lg:pt-0">
          <p class="theme-muted text-xs font-black uppercase tracking-[0.16em]">
            {{ t('appNav.brand') }} · {{ t('appNav.accounts') }}
          </p>
          <h1 class="mt-1 text-2xl font-black leading-tight tracking-tight lg:text-[2rem]">
            {{ t('accountsPage.title') }}
          </h1>
          <p class="theme-muted mt-1 max-w-2xl text-sm lg:text-[0.95rem]">
            {{ t('accountsPage.subtitle') }}
          </p>
        </header>

        <section class="finance-card mt-6 rounded-2xl p-5 sm:p-6">
          <h2 class="theme-muted text-xs font-black uppercase tracking-wide">
            {{ t('expenses.addAccount.title') }}
          </h2>
          <form
            class="mt-4 flex gap-2 rounded-2xl p-1.5 ring-1 ring-inset"
            style="
              background: var(--color-surface-soft);
              box-shadow: inset 0 1px 0 color-mix(in srgb, var(--color-border) 65%, transparent);
              --tw-ring-color: color-mix(in srgb, var(--color-border) 80%, transparent);
            "
            @submit.prevent="submitNewAccount"
          >
            <input
              v-model="newAccountName"
              type="text"
              class="theme-input min-h-10 min-w-0 flex-1 rounded-xl border-0 bg-transparent px-3 py-2 text-sm shadow-none ring-0 focus:ring-0"
              :placeholder="t('expenses.addAccount.placeholder')"
              :disabled="isCreating"
            />
            <button
              type="submit"
              class="theme-button-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base font-bold disabled:opacity-60"
              :disabled="isCreating || !newAccountName.trim()"
              :aria-label="t('common.add')"
            >
              <FontAwesomeIcon :icon="isCreating ? 'spinner' : 'plus'" :class="{ 'animate-spin': isCreating }" />
            </button>
          </form>
        </section>

        <section class="finance-card mt-5 rounded-2xl p-5 sm:p-6">
          <h2 class="theme-muted text-xs font-black uppercase tracking-wide">
            {{ t('accountsPage.listTitle') }}
          </h2>
          <p
            v-if="!isLoading && !errorMessage && orderedAccounts.length > 1"
            class="theme-muted mt-2 text-xs leading-relaxed"
          >
            {{ t('accountsPage.dragHint') }}
          </p>

          <FinancePageSkeleton v-if="isLoading" variant="accounts" />
          <p v-else-if="errorMessage" class="mt-4 text-sm" style="color: var(--color-danger)">
            {{ errorMessage }}
          </p>
          <p v-else-if="!orderedAccounts.length" class="theme-muted mt-4 text-sm">
            {{ t('accountsPage.empty') }}
          </p>

          <ul v-else class="mt-4 space-y-2">
            <li
              v-for="(account, index) in orderedAccounts"
              :key="account.id"
              class="group relative z-0 flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-[opacity,box-shadow] hover:z-40 hover:bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)]"
              :class="{
                'opacity-55': dragFromIndex === index,
                'outline outline-2 outline-offset-2': dragOverIndex === index && dragFromIndex !== null && dragFromIndex !== index,
              }"
              style="border-color: var(--color-border); outline-color: var(--color-primary)"
              @dragover="onDragOverRow(index, $event)"
              @drop.prevent="onDropOnRow(index)"
            >
              <span
                class="touch-none flex shrink-0 cursor-grab items-center justify-center rounded-lg px-1 py-2 active:cursor-grabbing"
                :class="{
                  'pointer-events-none opacity-40': orderedAccounts.length < 2 || isPersistingOrder || isLoading,
                }"
                draggable="true"
                role="button"
                tabindex="0"
                :aria-label="t('accountsPage.dragHandleAria')"
                @dragstart.stop="onDragStart(index, $event)"
                @dragend.stop="onDragEnd()"
              >
                <FontAwesomeIcon icon="grip-vertical" class="theme-muted text-sm" />
              </span>
              <span
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[0.75rem]"
                style="
                  background: color-mix(in srgb, var(--color-primary) 14%, transparent);
                  color: var(--color-primary);
                "
              >
                <FontAwesomeIcon icon="wallet" />
              </span>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="truncate font-bold">{{ account.name }}</span>
                  <span
                    v-if="account.isDefault"
                    class="rounded-md px-2 py-0.5 text-[0.65rem] font-black uppercase tracking-wide"
                    style="
                      background: color-mix(in srgb, var(--color-primary) 18%, transparent);
                      color: var(--color-primary);
                    "
                  >
                    {{ t('accountsPage.defaultBadge') }}
                  </span>
                </div>
                <p class="theme-muted mt-0.5 text-xs">{{ t('accountsPage.balanceCaption') }}</p>
              </div>
              <strong
                class="shrink-0 text-base font-black tabular-nums"
                :style="{ color: account.currentBalance < 0 ? 'var(--color-danger)' : undefined }"
              >
                {{ formatMoney(account.currentBalance) }}
              </strong>
              <div
                class="flex w-full shrink-0 justify-end gap-0.5 opacity-100 sm:ml-auto sm:w-auto sm:opacity-0 sm:transition-opacity sm:duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
              >
                <button
                  type="button"
                  class="theme-muted group/tooltip relative flex h-8 w-8 items-center justify-center rounded-lg text-[0.8rem] transition-colors hover:bg-[color-mix(in_srgb,var(--color-border)_80%,transparent)]"
                  :aria-label="t('common.edit')"
                  @click="openRenameModal(account)"
                >
                  <FontAwesomeIcon icon="pen-to-square" />
                  <span
                    class="pointer-events-none absolute left-1/2 top-full z-[10050] mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-[0.65rem] font-bold opacity-0 shadow-md transition-opacity duration-150 group-hover/tooltip:opacity-100 group-focus-visible/tooltip:opacity-100"
                    style="background: var(--color-text); color: var(--color-surface-strong)"
                    role="tooltip"
                  >
                    {{ t('common.edit') }}
                  </span>
                </button>
                <button
                  type="button"
                  class="group/tooltip relative flex h-8 w-8 items-center justify-center rounded-lg text-[0.8rem] transition-colors hover:bg-[color-mix(in_srgb,var(--color-danger)_14%,transparent)]"
                  style="color: var(--color-danger)"
                  :aria-label="t('common.delete')"
                  @click="removeAccount(account.id)"
                >
                  <FontAwesomeIcon icon="trash-can" />
                  <span
                    class="pointer-events-none absolute left-1/2 top-full z-[10050] mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-[0.65rem] font-bold opacity-0 shadow-md transition-opacity duration-150 group-hover/tooltip:opacity-100 group-focus-visible/tooltip:opacity-100"
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
      </div>

      <div
        v-if="isRenameModalOpen && renameTarget"
        class="fixed inset-0 z-[52] flex items-center justify-center bg-black/40 px-4 py-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="accounts-rename-title"
        @click.self="closeRenameModal"
      >
        <div class="finance-card w-full max-w-md rounded-2xl p-5 shadow-xl">
          <div class="flex items-start justify-between gap-3">
            <h2 id="accounts-rename-title" class="min-w-0 flex-1 text-lg font-black">
              {{ t('expenses.renameModal.editAccount') }}
            </h2>
            <button
              type="button"
              class="theme-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg leading-none hover:bg-[color-mix(in_srgb,var(--color-border)_70%,transparent)]"
              :aria-label="t('common.close')"
              @click="closeRenameModal"
            >
              <FontAwesomeIcon icon="xmark" />
            </button>
          </div>
          <form class="mt-4 grid gap-3" @submit.prevent="submitRenameModal">
            <label class="text-sm font-semibold">
              {{ t('expenses.renameModal.accountNameLabel') }}
              <input v-model="renameNameInput" type="text" class="theme-input mt-1 w-full rounded-xl p-3" autofocus />
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
