import { ref } from 'vue'

export const confirmModalOpen = ref(false)
export const confirmModalTitle = ref('')
export const confirmModalMessage = ref('')
export const confirmModalConfirmLabel = ref('')
export const confirmModalCancelLabel = ref('')

let pendingResolve: ((value: boolean) => void) | null = null

export type OpenConfirmModalOptions = {
  title: string
  message: string
  confirmLabel: string
  cancelLabel: string
}

export function openConfirmModal(options: OpenConfirmModalOptions): Promise<boolean> {
  return new Promise((resolve) => {
    pendingResolve = resolve
    confirmModalTitle.value = options.title
    confirmModalMessage.value = options.message
    confirmModalConfirmLabel.value = options.confirmLabel
    confirmModalCancelLabel.value = options.cancelLabel
    confirmModalOpen.value = true
  })
}

export function acceptConfirmModal() {
  pendingResolve?.(true)
  pendingResolve = null
  confirmModalOpen.value = false
}

export function dismissConfirmModal() {
  pendingResolve?.(false)
  pendingResolve = null
  confirmModalOpen.value = false
}
