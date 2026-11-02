import { describe, expect, it, vi } from 'vitest'
import { syncDocumentLang } from './document-lang'

describe('syncDocumentLang', () => {
  it('sets documentElement.lang to the given locale', () => {
    const setLang = vi.fn()
    vi.stubGlobal('document', {
      documentElement: {
        get lang() {
          return ''
        },
        set lang(value: string) {
          setLang(value)
        },
      },
    })

    syncDocumentLang('pt-BR')
    expect(setLang).toHaveBeenCalledWith('pt-BR')

    syncDocumentLang('')
    expect(setLang).toHaveBeenCalledWith('en-US')
  })
})
