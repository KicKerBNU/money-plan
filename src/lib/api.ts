import { firebaseAuth } from '@/plugins/firebase'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const user = firebaseAuth.currentUser
  if (!user) {
    throw new Error('User is not authenticated')
  }

  const token = await user.getIdToken()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
      Authorization: `Bearer ${token}`,
    },
  })

  if (response.status === 401) {
    throw new Error('Unauthorized')
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.message ?? `Request failed with status ${response.status}`)
  }

  return (await response.json()) as T
}
