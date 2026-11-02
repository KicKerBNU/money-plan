import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  __getScrollLockCountForTests,
  __resetDialogA11yForTests,
  getFocusableElements,
  lockBodyScroll,
  resolveTabWrapTarget,
  unlockBodyScroll,
} from './useDialogA11y'

type MockFocusable = {
  tagName: string
  tabIndex: number
  disabled: boolean
  hasAttribute: (name: string) => boolean
  getAttribute: (name: string) => string | null
  getClientRects: () => DOMRectList
}

function mockElement(
  overrides: Partial<MockFocusable> & { tagName?: string } = {},
): HTMLElement {
  const el: MockFocusable = {
    tagName: overrides.tagName ?? 'BUTTON',
    tabIndex: 0,
    disabled: false,
    hasAttribute: (name: string) => name === 'disabled' && Boolean(el.disabled),
    getAttribute: () => null,
    getClientRects: () => [{ width: 1, height: 1 }] as unknown as DOMRectList,
    ...overrides,
  }
  return el as unknown as HTMLElement
}

describe('resolveTabWrapTarget', () => {
  const a = mockElement()
  const b = mockElement()
  const c = mockElement()
  const focusables = [a, b, c]

  it('wraps forward from last to first', () => {
    expect(resolveTabWrapTarget(focusables, c, false)).toBe(a)
  })

  it('wraps backward from first to last', () => {
    expect(resolveTabWrapTarget(focusables, a, true)).toBe(c)
  })

  it('does not wrap when focus is in the middle', () => {
    expect(resolveTabWrapTarget(focusables, b, false)).toBeNull()
    expect(resolveTabWrapTarget(focusables, b, true)).toBeNull()
  })

  it('wraps to an end when active is outside the trap', () => {
    const outside = mockElement()
    expect(resolveTabWrapTarget(focusables, outside, false)).toBe(a)
    expect(resolveTabWrapTarget(focusables, outside, true)).toBe(c)
  })

  it('returns null for an empty list', () => {
    expect(resolveTabWrapTarget([], a, false)).toBeNull()
  })
})

describe('getFocusableElements', () => {
  it('filters disabled, aria-hidden, and negative tabindex nodes', () => {
    const root = {
      querySelectorAll: () =>
        [
          mockElement({ tabIndex: 0 }),
          mockElement({
            tabIndex: 0,
            disabled: true,
            hasAttribute: (name: string) => name === 'disabled',
          }),
          mockElement({
            tabIndex: 0,
            getAttribute: (name: string) => (name === 'aria-hidden' ? 'true' : null),
          }),
          mockElement({ tabIndex: -1 }),
          mockElement({
            tabIndex: 0,
            getClientRects: () => [] as unknown as DOMRectList,
          }),
        ] as unknown as NodeListOf<HTMLElement>,
    } as unknown as ParentNode

    const result = getFocusableElements(root)
    expect(result).toHaveLength(1)
  })
})

describe('body scroll lock counter', () => {
  beforeEach(() => {
    vi.stubGlobal('document', {
      body: { style: { overflow: '' } },
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
    __resetDialogA11yForTests()
  })

  it('locks on first call and unlocks only after matching unlocks', () => {
    lockBodyScroll()
    expect(document.body.style.overflow).toBe('hidden')
    expect(__getScrollLockCountForTests()).toBe(1)

    lockBodyScroll()
    expect(__getScrollLockCountForTests()).toBe(2)
    expect(document.body.style.overflow).toBe('hidden')

    unlockBodyScroll()
    expect(__getScrollLockCountForTests()).toBe(1)
    expect(document.body.style.overflow).toBe('hidden')

    unlockBodyScroll()
    expect(__getScrollLockCountForTests()).toBe(0)
    expect(document.body.style.overflow).toBe('')
  })
})
