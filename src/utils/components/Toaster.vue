<script setup lang="ts">
import { dismissToast, toastQueue } from '@/utils/toast'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
</script>

<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed top-4 right-4 z-[1000] flex w-[min(100vw-2rem,24rem)] flex-col gap-2 sm:top-6 sm:right-6"
      aria-live="polite"
      aria-relevant="additions text"
    >
      <TransitionGroup name="toast">
        <div
          v-for="toast in toastQueue.entries"
          :key="toast.id"
          class="pointer-events-auto flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-[8px]"
          :style="{
            borderColor: 'var(--color-border)',
            background:
              toast.kind === 'success'
                ? 'color-mix(in srgb, var(--color-positive) 14%, var(--color-surface-strong))'
                : 'color-mix(in srgb, var(--color-danger) 12%, var(--color-surface-strong))',
            color: 'var(--color-text)',
          }"
          role="status"
        >
          <span
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[0.95rem]"
            :style="{
              backgroundColor:
                toast.kind === 'success'
                  ? 'color-mix(in srgb, var(--color-positive) 22%, transparent)'
                  : 'color-mix(in srgb, var(--color-danger) 22%, transparent)',
              color: toast.kind === 'success' ? 'var(--color-positive)' : 'var(--color-danger)',
            }"
          >
            <FontAwesomeIcon :icon="toast.kind === 'success' ? 'circle-check' : 'circle-exclamation'" />
          </span>
          <p class="min-w-0 flex-1 text-sm font-semibold leading-snug">{{ toast.message }}</p>
          <button
            type="button"
            class="theme-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg font-bold leading-none hover:bg-[color-mix(in_srgb,var(--color-border)_70%,transparent)]"
            @click="dismissToast(toast.id)"
          >
            ×
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 220ms ease,
    transform 220ms ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(0.75rem);
}

.toast-move {
  transition: transform 240ms ease;
}
</style>
