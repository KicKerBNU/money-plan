import { reactive } from 'vue'

export type ToastKind = 'success' | 'error'

export interface ToastEntry {
  id: number
  kind: ToastKind
  message: string
}

const AUTO_DISMISS_MS = 3000
const MAX_VISIBLE = 5

let seq = 0

export const toastQueue = reactive({
  entries: [] as ToastEntry[],
})

export function dismissToast(id: number) {
  const index = toastQueue.entries.findIndex((entry) => entry.id === id)
  if (index !== -1) toastQueue.entries.splice(index, 1)
}

export function showToast(kind: ToastKind, message: string, durationMs = AUTO_DISMISS_MS) {
  const id = ++seq
  toastQueue.entries.push({ id, kind, message })
  while (toastQueue.entries.length > MAX_VISIBLE) {
    toastQueue.entries.shift()
  }
  if (durationMs > 0) {
    window.setTimeout(() => dismissToast(id), durationMs)
  }
}
