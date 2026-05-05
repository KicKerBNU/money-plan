<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const barRound = 'finance-skeleton-block finance-skeleton-pulse rounded-md'
</script>

<template>
  <div role="status" aria-live="polite" class="min-h-[min(52vh,22rem)]">
    <span class="sr-only">{{ t('common.loading') }}</span>

    <section class="stats-card mt-5 rounded-2xl p-4 lg:mt-6 lg:p-8">
      <div class="stats-pillars">
        <div
          v-for="i in 9"
          :key="`pil-${i}`"
          class="stats-pillar"
          style="--category-color: var(--color-muted)"
        >
          <div :class="[barRound, 'min-h-[0.75rem] w-12']" />
          <div class="stats-pillar-track">
            <div
              v-for="b in 5"
              :key="b"
              class="finance-skeleton-block finance-skeleton-pulse stats-brick opacity-80"
            />
          </div>
          <div class="stats-category-icon finance-skeleton-block finance-skeleton-pulse" />
          <div :class="[barRound, 'h-3 w-16']" />
          <div :class="[barRound, 'h-2 w-10']" />
        </div>
      </div>
      <div class="theme-border mt-5 flex justify-between border-t pt-3">
        <div :class="[barRound, 'h-3 w-44']" />
        <div :class="[barRound, 'hidden h-3 w-40 lg:block']" />
      </div>
    </section>

    <section class="stats-card mt-5 rounded-2xl p-4 lg:p-6">
      <div :class="[barRound, 'h-4 w-36']" />
      <div class="mt-4 space-y-3 lg:space-y-2.5">
        <article v-for="i in 6" :key="`line-${i}`" class="stats-lineup-row">
          <div :class="[barRound, 'h-4 w-6']" />
          <div :class="[barRound, 'stats-lineup-icon']" />
          <div :class="[barRound, 'h-4 max-w-[8rem]']" />
          <div class="stats-lineup-track finance-skeleton-block finance-skeleton-pulse overflow-hidden rounded-full">
            <div
              class="finance-skeleton-block h-[0.18rem] w-[42%] rounded-full"
              style="background: color-mix(in srgb, var(--color-muted) 65%, var(--color-surface-soft))"
            />
          </div>
          <div :class="[barRound, 'h-3 w-9 text-right']" />
          <div :class="[barRound, 'h-4 w-16 text-right']" />
        </article>
      </div>
    </section>
  </div>
</template>
