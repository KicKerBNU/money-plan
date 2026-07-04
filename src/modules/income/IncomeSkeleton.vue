<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const barRound = 'finance-skeleton-block finance-skeleton-pulse rounded-md'
</script>

<template>
  <div role="status" aria-live="polite" class="min-h-[min(52vh,20rem)]">
    <span class="sr-only">{{ t('common.loading') }}</span>

    <div class="mt-5 flex items-center justify-between gap-3">
      <div :class="[barRound, 'h-10 w-10 rounded-xl']" />
      <div :class="[barRound, 'h-4 w-36']" />
      <div :class="[barRound, 'h-10 w-10 rounded-xl']" />
    </div>

    <section class="income-hero-card mt-4 rounded-2xl p-5 sm:p-6">
      <div :class="[barRound, 'h-3 w-44']" />
      <div :class="[barRound, 'mt-4 h-12 w-52']" />
      <div :class="[barRound, 'mt-4 h-3 w-full max-w-xs']" />
      <div class="mt-5 flex flex-col gap-2 sm:max-w-[11rem] sm:ml-auto">
        <div :class="[barRound, 'h-11 w-full rounded-xl']" />
        <div :class="[barRound, 'h-10 w-full rounded-xl']" />
      </div>
    </section>

    <section class="finance-card mt-4 rounded-2xl lg:mt-6">
      <div class="theme-border flex items-center justify-between border-b px-4 py-3 sm:px-5">
        <div :class="[barRound, 'h-4 w-28']" />
        <div :class="[barRound, 'h-5 w-24']" />
      </div>
      <div class="divide-y" style="--tw-divide-color: var(--color-border)">
        <div
          v-for="i in 5"
          :key="`inc-${i}`"
          class="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-5"
        >
          <div class="min-w-0 flex-1 space-y-2">
            <div :class="[barRound, 'h-4 w-40']" />
            <div :class="[barRound, 'h-3 w-28']" />
          </div>
          <div :class="[barRound, 'h-4 w-16 shrink-0']" />
          <div class="flex gap-1 shrink-0">
            <div :class="[barRound, 'h-9 w-9 rounded-lg']" />
            <div :class="[barRound, 'h-9 w-9 rounded-lg']" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
