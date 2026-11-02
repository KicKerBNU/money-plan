import {
  type MaybeRefOrGetter,
  type Ref,
  nextTick,
  onUnmounted,
  toValue,
  watch,
} from 'vue'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

type DialogStackEntry = {
  id: symbol
  root: HTMLElement
  onDismiss: () => void
  isDisabled: () => boolean
  previouslyFocused: HTMLElement | null
  lockScroll: boolean
}

const dialogStack: DialogStackEntry[] = []
let keyListenerAttached = false
let scrollLockCount = 0
let previousBodyOverflow = ''

/** Exported for unit tests. */
export function getFocusableElements(root: ParentNode): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((el) => {
    if (el.hasAttribute('disabled') || el.getAttribute('aria-hidden') === 'true') return false
    if (el.tabIndex < 0) return false
    // offsetParent is null for fixed/sticky in some engines; also check getClientRects.
    const style =
      typeof window !== 'undefined' && typeof window.getComputedStyle === 'function'
        ? window.getComputedStyle(el)
        : null
    if (style && (style.visibility === 'hidden' || style.display === 'none')) return false
    return el.getClientRects().length > 0
  })
}

/**
 * Returns the element that should receive focus when Tab/Shift+Tab is pressed
 * inside a focus trap, or null if the browser should handle the key normally.
 */
export function resolveTabWrapTarget(
  focusables: HTMLElement[],
  active: Element | null,
  shiftKey: boolean,
): HTMLElement | null {
  if (focusables.length === 0) return null
  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  if (shiftKey) {
    if (active === first || !focusables.includes(active as HTMLElement)) return last
    return null
  }
  if (active === last || !focusables.includes(active as HTMLElement)) return first
  return null
}

export function lockBodyScroll() {
  if (typeof document === 'undefined') return
  if (scrollLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  scrollLockCount += 1
}

export function unlockBodyScroll() {
  if (typeof document === 'undefined') return
  scrollLockCount = Math.max(0, scrollLockCount - 1)
  if (scrollLockCount === 0) {
    document.body.style.overflow = previousBodyOverflow
  }
}

/** Test helper — not for app code. */
export function __resetDialogA11yForTests() {
  dialogStack.length = 0
  keyListenerAttached = false
  scrollLockCount = 0
  previousBodyOverflow = ''
  if (typeof document !== 'undefined') {
    document.removeEventListener('keydown', onGlobalKeyDown, true)
    document.body.style.overflow = ''
  }
}

/** Test helper — not for app code. */
export function __getScrollLockCountForTests() {
  return scrollLockCount
}

function onGlobalKeyDown(event: KeyboardEvent) {
  const top = dialogStack[dialogStack.length - 1]
  if (!top) return

  if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    if (top.isDisabled()) return
    top.onDismiss()
    return
  }

  if (event.key !== 'Tab') return

  const focusables = getFocusableElements(top.root)
  if (focusables.length === 0) {
    event.preventDefault()
    return
  }

  const wrapTarget = resolveTabWrapTarget(focusables, document.activeElement, event.shiftKey)
  if (wrapTarget) {
    event.preventDefault()
    wrapTarget.focus()
  }
}

function attachKeyListener() {
  if (keyListenerAttached || typeof document === 'undefined') return
  document.addEventListener('keydown', onGlobalKeyDown, true)
  keyListenerAttached = true
}

function detachKeyListenerIfEmpty() {
  if (dialogStack.length > 0 || !keyListenerAttached || typeof document === 'undefined') return
  document.removeEventListener('keydown', onGlobalKeyDown, true)
  keyListenerAttached = false
}

function pushDialog(entry: DialogStackEntry) {
  dialogStack.push(entry)
  if (entry.lockScroll) lockBodyScroll()
  attachKeyListener()
}

function removeDialog(id: symbol) {
  const index = dialogStack.findIndex((entry) => entry.id === id)
  if (index < 0) return null
  const [removed] = dialogStack.splice(index, 1)
  if (removed.lockScroll) unlockBodyScroll()
  detachKeyListenerIfEmpty()
  return removed
}

export type UseDialogA11yOptions = {
  /** Whether the dialog is currently open. */
  open: MaybeRefOrGetter<boolean>
  /** Element with role="dialog" / "alertdialog" (or its focusable container). */
  dialogRef: Ref<HTMLElement | null>
  /** Called on Escape (and typically wired to the same dismiss as backdrop click). */
  onDismiss: () => void
  /** When true, Escape does not dismiss (e.g. while submitting). */
  disabled?: MaybeRefOrGetter<boolean>
  /** Shared body scroll lock (default true). Nested dialogs use a counter. */
  lockScroll?: boolean
}

/**
 * Focus trap, Escape dismiss, initial focus, restore focus, and optional body scroll-lock
 * for modal dialogs. Nested dialogs stack so only the topmost handles Escape/Tab.
 */
export function useDialogA11y(options: UseDialogA11yOptions) {
  const id = Symbol('dialog-a11y')
  let active = false
  let previouslyFocused: HTMLElement | null = null

  function isDisabled() {
    return Boolean(toValue(options.disabled))
  }

  async function activate() {
    if (active) return
    const root = options.dialogRef.value
    if (!root) return

    active = true
    pushDialog({
      id,
      root,
      onDismiss: options.onDismiss,
      isDisabled,
      previouslyFocused,
      lockScroll: options.lockScroll !== false,
    })

    await nextTick()
    const focusables = getFocusableElements(root)
    const autofocus = root.querySelector<HTMLElement>('[autofocus]')
    ;(autofocus && focusables.includes(autofocus) ? autofocus : focusables[0])?.focus()
  }

  function deactivate() {
    if (!active) return
    active = false
    const removed = removeDialog(id)
    const restore = removed?.previouslyFocused
    previouslyFocused = null
    if (restore && typeof restore.focus === 'function') {
      restore.focus()
    }
  }

  // Capture the trigger as soon as open flips true (before the dialog mounts/steals focus).
  watch(
    () => toValue(options.open),
    (isOpen, wasOpen) => {
      if (isOpen && !wasOpen) {
        previouslyFocused =
          typeof document !== 'undefined' ? (document.activeElement as HTMLElement | null) : null
      }
      if (!isOpen) {
        deactivate()
      }
    },
  )

  watch(
    () => [toValue(options.open), options.dialogRef.value] as const,
    async ([isOpen, root]) => {
      if (isOpen && root) {
        await activate()
      }
    },
    { flush: 'post' },
  )

  onUnmounted(() => {
    deactivate()
  })
}
