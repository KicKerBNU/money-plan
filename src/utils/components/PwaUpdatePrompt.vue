<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { needRefresh, updateServiceWorker } = useRegisterSW()

function reload() {
  updateServiceWorker(true)
}

function dismiss() {
  needRefresh.value = false
}
</script>

<template>
  <Teleport to="body">
    <Transition name="pwa-prompt">
      <div
        v-if="needRefresh"
        class="fixed right-4 bottom-4 left-4 z-[1001] flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-[8px] sm:left-auto sm:w-[min(100vw-2rem,26rem)]"
        style="
          border-color: var(--color-border);
          background: color-mix(in srgb, var(--color-primary) 18%, var(--color-surface-strong));
          color: var(--color-text);
        "
        role="status"
      >
        <FontAwesomeIcon
          icon="arrows-rotate"
          class="shrink-0 text-base"
          style="color: var(--color-primary)"
        />
        <p class="min-w-0 flex-1 text-sm font-semibold leading-snug">
          {{ t('pwa.updateReady') }}
        </p>
        <div class="flex shrink-0 gap-2">
          <button
            type="button"
            class="theme-button-primary cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold"
            @click="reload"
          >
            {{ t('pwa.reload') }}
          </button>
          <button
            type="button"
            class="theme-muted cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-[color-mix(in_srgb,var(--color-border)_70%,transparent)]"
            @click="dismiss"
          >
            {{ t('pwa.dismiss') }}
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.pwa-prompt-enter-active,
.pwa-prompt-leave-active {
  transition:
    opacity 200ms ease,
    transform 200ms ease;
}

.pwa-prompt-enter-from,
.pwa-prompt-leave-to {
  opacity: 0;
  transform: translateY(0.75rem);
}
</style>
