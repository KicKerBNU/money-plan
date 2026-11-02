import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { usePreferencesStore } from './preferences.store'

function installMemoryLocalStorage() {
  const store = new Map<string, string>()
  const localStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value)
    },
    removeItem: (key: string) => {
      store.delete(key)
    },
    clear: () => store.clear(),
    get length() {
      return store.size
    },
    key: (index: number) => [...store.keys()][index] ?? null,
  }
  vi.stubGlobal('localStorage', localStorage)
  return store
}

describe('usePreferencesStore', () => {
  let memory: Map<string, string>

  beforeEach(() => {
    memory = installMemoryLocalStorage()
    setActivePinia(createPinia())
  })

  it('starts with null currency when nothing is stored', () => {
    const prefs = usePreferencesStore()
    expect(prefs.currency).toBeNull()
  })

  it('hydrates a valid ISO currency from localStorage', () => {
    memory.set('money-plan-currency', 'eur')
    setActivePinia(createPinia())
    const prefs = usePreferencesStore()
    expect(prefs.currency).toBe('EUR')
  })

  it('ignores invalid stored currency values', () => {
    memory.set('money-plan-currency', 'euro')
    setActivePinia(createPinia())
    const prefs = usePreferencesStore()
    expect(prefs.currency).toBeNull()
  })

  it('persists setCurrency and clears on null', async () => {
    const prefs = usePreferencesStore()
    prefs.setCurrency('brl')
    expect(prefs.currency).toBe('BRL')
    await nextTick()
    expect(memory.get('money-plan-currency')).toBe('BRL')

    prefs.setCurrency('  ')
    expect(prefs.currency).toBeNull()
    await nextTick()
    expect(memory.has('money-plan-currency')).toBe(false)

    prefs.setCurrency(null)
    expect(prefs.currency).toBeNull()
  })
})
