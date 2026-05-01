import { firebaseAuth } from '@/plugins/firebase'
import { i18n } from '@/i18n'
import { showToast } from '@/utils/toast'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

export type ApiFetchInit = RequestInit & {
  toast?: {
    silentError?: boolean
    silentSuccess?: boolean
    successMessage?: string
  }
}

function pickFetchInit(init?: ApiFetchInit): RequestInit {
  if (!init) return {}
  const { toast: _toast, ...rest } = init
  return rest
}

export async function apiFetch<T>(path: string, init?: ApiFetchInit): Promise<T> {
  const method = (init?.method ?? 'GET').toUpperCase()
  const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)
  const toastOpt = init?.toast
  const fetchInit = pickFetchInit(init)

  const user = firebaseAuth.currentUser
  if (!user) {
    const msg = 'User is not authenticated'
    if (!toastOpt?.silentError) showToast('error', msg)
    throw new Error(msg)
  }

  let response: Response
  try {
    const token = await user.getIdToken()
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...fetchInit,
      headers: {
        'Content-Type': 'application/json',
        ...(fetchInit.headers ?? {}),
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(i18n.global.t('common.unexpectedError'))
    if (!toastOpt?.silentError) showToast('error', msg)
    throw error instanceof Error ? error : new Error(msg)
  }

  if (response.status === 401) {
    const msg = 'Unauthorized'
    if (!toastOpt?.silentError) showToast('error', msg)
    throw new Error(msg)
  }

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => ({}))) as { message?: string }
    const msg =
      typeof errorBody.message === 'string' && errorBody.message
        ? errorBody.message
        : `Request failed with status ${response.status}`
    if (!toastOpt?.silentError) showToast('error', msg)
    throw new Error(msg)
  }

  if (response.status === 204) {
    if (isMutation && !toastOpt?.silentSuccess) {
      showToast('success', toastOpt?.successMessage ?? String(i18n.global.t('toast.saveSuccess')))
    }
    return undefined as T
  }

  const data = (await response.json()) as T

  if (isMutation && !toastOpt?.silentSuccess) {
    showToast('success', toastOpt?.successMessage ?? String(i18n.global.t('toast.saveSuccess')))
  }

  return data
}
