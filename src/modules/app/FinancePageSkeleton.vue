<script setup lang="ts">
import { useI18n } from 'vue-i18n'

export type FinancePageSkeletonVariant = 'overview' | 'expenses' | 'accounts' | 'chat'

defineProps<{ variant: FinancePageSkeletonVariant }>()
const { t } = useI18n()

const pill = 'finance-skeleton-block finance-skeleton-pulse rounded-full'
const barRound = 'finance-skeleton-block finance-skeleton-pulse rounded-md'
</script>

<template>
  <div role="status" aria-live="polite" class="finance-page-skeleton-contents">
    <span class="sr-only">{{ t('common.loading') }}</span>

    <template v-if="variant === 'overview'">
      <section class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="i in 4" :key="`kpi-${i}`" class="finance-card rounded-2xl p-4">
          <div :class="[barRound, 'h-3 w-24']" />
          <div :class="[barRound, 'mt-4 h-8 w-32']" />
        </div>
      </section>
      <section class="finance-card mt-5 rounded-2xl p-4 lg:p-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div :class="[barRound, 'h-4 w-36']" />
          <div class="flex gap-4">
            <div :class="[barRound, 'h-3 w-16']" />
            <div :class="[barRound, 'h-3 w-20']" />
          </div>
        </div>
        <div :class="[barRound, 'mt-6 h-[220px] w-full max-w-full']" />
      </section>
      <section class="finance-card mt-5 rounded-2xl p-4 lg:p-6">
        <div :class="[barRound, 'h-4 w-40']" />
        <ul class="mt-4 space-y-3">
          <li
            v-for="i in 3"
            :key="`ins-${i}`"
            class="flex flex-col gap-2 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            style="border-color: var(--color-border)"
          >
            <div class="min-w-0 flex-1 space-y-2">
              <div :class="[barRound, 'h-4 w-full max-w-md']" />
              <div :class="[barRound, 'h-3 w-3/4 max-w-sm']" />
            </div>
            <div :class="[barRound, 'h-3 w-20 shrink-0 sm:ml-4']" />
          </li>
        </ul>
      </section>
      <section class="finance-card mt-5 rounded-2xl p-4 lg:p-6">
        <div :class="[barRound, 'h-4 w-44']" />
        <div class="mt-4 space-y-3">
          <div v-for="i in 5" :key="`cat-${i}`" class="flex items-center gap-3 rounded-xl px-2 py-2">
            <div :class="[barRound, 'h-8 w-8 shrink-0 rounded-lg']" />
            <div class="min-w-0 flex-1 space-y-2">
              <div class="flex justify-between gap-2">
                <div :class="[barRound, 'h-4 flex-1']" />
                <div :class="[barRound, 'h-4 w-20 shrink-0']" />
              </div>
              <div :class="[barRound, 'h-1.5 w-full rounded-full']" />
            </div>
          </div>
        </div>
      </section>
    </template>

    <template v-else-if="variant === 'expenses'">
      <section class="mobile-hero-card mt-4 rounded-2xl p-5 lg:hidden">
        <div :class="[barRound, 'h-3 w-36']" />
        <div :class="[barRound, 'mt-3 h-10 w-48']" />
        <div :class="[barRound, 'mt-5 h-2 w-full rounded-full']" />
      </section>
      <section class="mt-6 hidden grid gap-4 sm:grid-cols-2 lg:grid xl:grid-cols-4">
        <div v-for="i in 4" :key="`sum-${i}`" class="finance-card rounded-2xl p-4">
          <div :class="[barRound, 'h-3 w-28']" />
          <div :class="[barRound, 'mt-3 h-10 w-full max-w-[9rem]']" />
        </div>
      </section>
      <section class="mt-4 grid gap-5 lg:mt-6">
        <div class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_18.5rem] xl:items-stretch xl:gap-5">
        <div class="flex min-h-0 min-w-0 flex-col gap-5 xl:h-full">
          <div class="finance-card hidden min-h-0 overflow-hidden rounded-2xl lg:flex lg:flex-col">
            <div class="theme-border flex flex-col gap-3 border-b p-4 md:flex-row md:items-center">
              <div :class="[barRound, 'h-10 min-h-10 flex-1']" />
              <div :class="[barRound, 'h-10 w-44 shrink-0 rounded-xl']" />
            </div>
            <div class="theme-border border-b px-4 py-2.5">
              <div class="flex gap-2">
                <div v-for="i in 5" :key="`chip-${i}`" :class="[pill, 'h-9 w-24 shrink-0']" />
              </div>
            </div>
            <div class="expense-list space-y-0">
              <div
                v-for="i in 8"
                :key="`row-${i}`"
                class="theme-border flex items-center gap-3 border-b px-4 py-3.5 last:border-b-0"
                style="border-color: var(--color-border)"
              >
                <div :class="[barRound, 'hidden h-9 w-6 shrink-0 rounded-lg lg:block']" />
                <div :class="[barRound, 'h-9 w-9 shrink-0 rounded-xl']" />
                <div class="min-w-0 flex-1 space-y-2">
                  <div :class="[barRound, 'h-4 w-2/3 max-w-xs']" />
                  <div :class="[barRound, 'h-3 w-1/2 max-w-[14rem]']" />
                </div>
                <div :class="[barRound, 'h-4 w-16 shrink-0']" />
                <div class="hidden shrink-0 gap-1 lg:flex">
                  <div :class="[barRound, 'h-8 w-8 rounded-lg']" />
                  <div :class="[barRound, 'h-8 w-8 rounded-lg']" />
                </div>
              </div>
            </div>
          </div>
          <div class="mobile-entry-list space-y-3 lg:hidden">
            <article v-for="i in 5" :key="`mob-${i}`" class="mobile-entry-card rounded-xl p-3">
              <div class="mb-2 flex items-center justify-between">
                <div :class="[barRound, 'h-3 w-16']" />
                <div :class="[barRound, 'h-3 w-14']" />
              </div>
              <div class="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                <div :class="[barRound, 'h-9 w-9 rounded-xl']" />
                <div class="space-y-2">
                  <div :class="[barRound, 'h-4 w-3/4']" />
                  <div :class="[barRound, 'h-3 w-1/2']" />
                </div>
                <div :class="[barRound, 'h-4 w-14']" />
              </div>
              <div class="mt-2 flex justify-end gap-1">
                <div :class="[barRound, 'h-8 w-8 rounded-lg']" />
                <div :class="[barRound, 'h-8 w-8 rounded-lg']" />
              </div>
            </article>
          </div>
        </div>
        <aside class="hidden min-h-0 w-full max-w-[18.5rem] shrink-0 flex-col gap-5 xl:flex">
          <section class="finance-card flex min-h-[16rem] flex-col overflow-hidden rounded-2xl p-4">
            <div :class="[barRound, 'h-3 w-32']" />
            <div class="mt-5 space-y-4">
              <div v-for="i in 4" :key="`pcat-${i}`" class="space-y-2">
                <div class="flex justify-between gap-2">
                  <div :class="[barRound, 'h-3 w-28']" />
                  <div :class="[barRound, 'h-3 w-16']" />
                </div>
                <div :class="[barRound, 'h-2 w-full rounded-full']" />
              </div>
            </div>
          </section>
          <section class="finance-card rounded-2xl p-4">
            <div :class="[barRound, 'h-3 w-28']" />
            <div class="mt-4 space-y-3">
              <div v-for="i in 4" :key="`acc-${i}`" class="flex justify-between gap-2 border-b pb-3 last:border-b-0 last:pb-0" style="border-color: var(--color-border)">
                <div :class="[barRound, 'h-4 w-28']" />
                <div :class="[barRound, 'h-4 w-20']" />
              </div>
            </div>
          </section>
        </aside>
        </div>

        <div class="finance-card overflow-hidden rounded-2xl">
          <div class="grid lg:grid-cols-2">
            <div
              class="theme-border flex flex-col gap-4 border-b p-5 sm:p-6 lg:border-b-0 lg:border-r"
              style="border-color: var(--color-border)"
            >
              <div class="flex items-center gap-3">
                <div :class="[barRound, 'h-11 w-11 shrink-0 rounded-2xl']" />
                <div :class="[barRound, 'h-5 w-44']" />
              </div>
              <div :class="[barRound, 'h-11 w-full rounded-2xl']" />
              <div class="space-y-2">
                <div v-for="j in 3" :key="`al-${j}`" :class="[barRound, 'h-10 w-full rounded-xl']" />
              </div>
            </div>
            <div class="flex flex-col gap-4 p-5 sm:p-6">
              <div class="flex items-center gap-3">
                <div :class="[barRound, 'h-11 w-11 shrink-0 rounded-2xl']" />
                <div :class="[barRound, 'h-5 w-40']" />
              </div>
              <div :class="[barRound, 'h-11 w-full rounded-2xl']" />
              <div class="space-y-2">
                <div v-for="j in 4" :key="`cl-${j}`" :class="[barRound, 'h-10 w-full rounded-xl']" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>

    <template v-else-if="variant === 'accounts'">
      <ul class="mt-4 space-y-2" role="presentation">
        <li
          v-for="i in 5"
          :key="`accrow-${i}`"
          class="flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3"
          style="border-color: var(--color-border)"
        >
          <div :class="[barRound, 'h-8 w-6 shrink-0 rounded-lg']" />
          <div :class="[barRound, 'h-9 w-9 shrink-0 rounded-xl']" />
          <div class="min-w-0 flex-1 space-y-2">
            <div :class="[barRound, 'h-4 w-40 max-w-[60%]']" />
            <div :class="[barRound, 'h-3 w-28']" />
          </div>
          <div :class="[barRound, 'h-8 w-16 shrink-0 rounded-lg']" />
          <div class="flex gap-1">
            <div :class="[barRound, 'h-8 w-8 rounded-lg']" />
            <div :class="[barRound, 'h-8 w-8 rounded-lg']" />
          </div>
        </li>
      </ul>
    </template>

    <template v-else-if="variant === 'chat'">
      <div class="flex flex-col gap-3">
        <div class="flex justify-end">
          <div :class="[barRound, 'h-16 w-[min(100%,18rem)] max-w-full rounded-2xl rounded-br-md']" />
        </div>
        <div class="flex justify-start">
          <div :class="[barRound, 'h-20 w-[min(100%,22rem)] max-w-full rounded-2xl rounded-bl-md']" />
        </div>
        <div class="flex justify-end">
          <div :class="[barRound, 'h-12 w-[min(100%,12rem)] max-w-full rounded-2xl rounded-br-md']" />
        </div>
      </div>
    </template>
  </div>
</template>
