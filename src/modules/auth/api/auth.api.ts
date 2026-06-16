import { apiFetch } from '@/lib/api'
import { i18n } from '@/i18n'

export async function deleteUserAccount() {
  await apiFetch<void>('/v1/me', {
    method: 'DELETE',
    toast: {
      successMessage: String(i18n.global.t('auth.deleteAccount.success')),
    },
  })
}
