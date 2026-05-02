<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  acceptConfirmModal,
  confirmModalCancelLabel,
  confirmModalConfirmLabel,
  confirmModalMessage,
  confirmModalOpen,
  confirmModalTitle,
  dismissConfirmModal,
} from '@/utils/confirmModal'

const { t } = useI18n()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="confirmModalOpen"
      class="fixed inset-0 z-[1100] flex items-center justify-center bg-black/40 px-4 py-8"
      role="presentation"
      @click.self="dismissConfirmModal"
    >
      <div
        class="finance-card w-full max-w-md rounded-2xl p-5 shadow-xl"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-desc"
        @click.stop
      >
        <div class="flex items-start justify-between gap-3">
          <h2 id="confirm-modal-title" class="min-w-0 flex-1 text-lg font-black">{{ confirmModalTitle }}</h2>
          <button
            type="button"
            class="theme-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg leading-none hover:bg-[color-mix(in_srgb,var(--color-border)_70%,transparent)]"
            :aria-label="t('common.close')"
            @click="dismissConfirmModal"
          >
            <FontAwesomeIcon icon="xmark" />
          </button>
        </div>
        <p id="confirm-modal-desc" class="theme-muted mt-3 text-sm leading-relaxed">{{ confirmModalMessage }}</p>
        <div class="mt-6 flex flex-wrap justify-end gap-2">
          <button type="button" class="theme-button-secondary rounded-xl px-4 py-3 text-sm font-bold" @click="dismissConfirmModal">
            {{ confirmModalCancelLabel }}
          </button>
          <button
            type="button"
            class="rounded-xl px-4 py-3 text-sm font-bold text-white"
            style="background: var(--color-danger)"
            @click="acceptConfirmModal"
          >
            {{ confirmModalConfirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
