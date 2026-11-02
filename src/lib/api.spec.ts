import { beforeEach, describe, expect, it, vi } from 'vitest'

const getIdToken = vi.fn()
const showToastMock = vi.fn()

vi.mock('@/plugins/firebase', () => ({
  firebaseAuth: {
    get currentUser() {
      return mockCurrentUser
    },
  },
}))

vi.mock('@/utils/toast', () => ({
  showToast: (...args: unknown[]) => showToastMock(...args),
}))

vi.mock('@/i18n', () => ({
  i18n: {
    global: {
      t: (key: string) => key,
    },
  },
}))

let mockCurrentUser: { getIdToken: typeof getIdToken } | null = {
  getIdToken,
}

describe('apiFetch', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    mockCurrentUser = { getIdToken }
    getIdToken.mockResolvedValue('token-1')
    vi.stubGlobal('fetch', vi.fn())
  })

  it('throws when the user is not authenticated', async () => {
    mockCurrentUser = null
    const { apiFetch } = await import('./api')
    await expect(apiFetch('/v1/expenses')).rejects.toThrow('User is not authenticated')
    expect(showToastMock).toHaveBeenCalledWith('error', 'User is not authenticated')
  })

  it('sends Authorization and parses JSON success bodies', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ data: [{ id: 1 }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const { apiFetch } = await import('./api')
    const result = await apiFetch<{ data: { id: number }[] }>('/v1/expenses')

    expect(result).toEqual({ data: [{ id: 1 }] })
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/v1\/expenses$/),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer token-1',
          'Content-Type': 'application/json',
        }),
      }),
    )
  })

  it('retries once with a refreshed token on 401', async () => {
    const fetchMock = vi.mocked(fetch)
    getIdToken.mockResolvedValueOnce('stale').mockResolvedValueOnce('fresh')
    fetchMock
      .mockResolvedValueOnce(new Response('nope', { status: 401 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )

    const { apiFetch } = await import('./api')
    await apiFetch('/v1/accounts')

    expect(getIdToken).toHaveBeenNthCalledWith(1, false)
    expect(getIdToken).toHaveBeenNthCalledWith(2, true)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock.mock.calls[1][1]).toEqual(
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer fresh' }),
      }),
    )
  })

  it('surfaces API error messages from JSON bodies', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ message: 'Category not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const { apiFetch } = await import('./api')
    await expect(apiFetch('/v1/categories/99')).rejects.toThrow('Category not found')
    expect(showToastMock).toHaveBeenCalledWith('error', 'Category not found')
  })

  it('returns undefined for 204 and toasts success on mutations', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 204 }))

    const { apiFetch } = await import('./api')
    const result = await apiFetch<void>('/v1/expenses/1', { method: 'DELETE' })

    expect(result).toBeUndefined()
    expect(showToastMock).toHaveBeenCalledWith('success', 'toast.saveSuccess')
  })

  it('can silence error toasts', async () => {
    mockCurrentUser = null
    const { apiFetch } = await import('./api')
    await expect(apiFetch('/v1/expenses', { toast: { silentError: true } })).rejects.toThrow()
    expect(showToastMock).not.toHaveBeenCalled()
  })
})
