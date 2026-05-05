<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const barRound = 'finance-skeleton-block finance-skeleton-pulse rounded-md'
</script>

<template>
  <div role="status" aria-live="polite" class="min-h-[min(52vh,20rem)]">
    <span class="sr-only">{{ t('common.loading') }}</span>

    <section class="mt-4 grid gap-4 lg:mt-6 lg:grid-cols-[1fr_1fr]">
      <article class="income-hero-card rounded-2xl p-5 lg:p-6">
        <div :class="[barRound, 'h-3 w-40']" />
        <div :class="[barRound, 'mt-4 h-12 w-52']" />
        <div :class="[barRound, 'mt-4 h-3 w-full max-w-xs']" />
      </article>
      <div class="finance-card hidden rounded-2xl p-5 lg:block">
        <div :class="[barRound, 'h-4 w-32']" />
        <div class="mt-4 grid grid-cols-[1fr_auto] gap-2">
          <div :class="[barRound, 'h-9']" />
          <div :class="[barRound, 'h-9']" />
        </div>
        <div :class="[barRound, 'mt-2 h-9 w-full']" />
        <div :class="[barRound, 'mt-2 h-9 w-full']" />
        <div :class="[barRound, 'mt-4 h-9 w-full']" />
      </div>
    </section>

    <section class="finance-card mt-4 hidden rounded-2xl lg:mt-6 lg:block">
      <div class="theme-border flex items-center justify-between border-b px-4 py-3">
        <div :class="[barRound, 'h-4 w-36']" />
        <div :class="[barRound, 'h-5 w-24']" />
      </div>
      <div class="divide-y" style="--tw-divide-color: var(--color-border)">
        <div
          v-for="i in 6"
          :key="`inc-${i}`"
          class="grid grid-cols-[4.5rem_1fr_auto_auto] items-center gap-4 px-4 py-3.5"
        >
          <div :class="[barRound, 'h-3 w-14']" />
          <div :class="[barRound, 'h-4 w-32']" />
          <div :class="[barRound, 'h-4 w-16 justify-self-end']" />
          <div class="flex gap-1 justify-self-end">
            <div :class="[barRound, 'h-8 w-8 rounded-lg']" />
            <div :class="[barRound, 'h-8 w-8 rounded-lg']" />
          </div>
        </div>
      </div>
    </section>

    <section class="mobile-entry-list mt-4 space-y-3 lg:hidden">
      <article v-for="i in 4" :key="`imob-${i}`" class="mobile-entry-card rounded-xl p-4">
        <div class="flex items-center justify-between gap-3">
          <div class="min-w-0 flex-1 space-y-2">
            <div :class="[barRound, 'h-4 max-w-[85%]']" />
            <div :class="[barRound, 'h-3 w-24']" />
          </div>
          <div :class="[barRound, 'h-4 w-16 shrink-0']" />
        </div>
        <div class="mt-2 flex justify-end gap-1">
          <div :class="[barRound, 'h-8 w-8 rounded-lg']" />
          <div :class="[barRound, 'h-8 w-8 rounded-lg']" />
        </div>
      </article>
    </section>
  </div>
</template>
