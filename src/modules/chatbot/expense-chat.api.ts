import { apiFetch, type ApiFetchInit } from '@/lib/api'

interface DataResponse<T> {
  data: T
}

export type ExpenseChatMessage = { role: 'user' | 'assistant'; content: string }

export function clientLocalCalendarISODate(): string {
  const d = new Date()
  const y = d.getFullYear()
  const mo = String(d.getMonth() + 1).padStart(2, '0')
  const da = String(d.getDate()).padStart(2, '0')
  return `${y}-${mo}-${da}`
}

export async function sendExpenseChat(messages: ExpenseChatMessage[], init?: ApiFetchInit) {
  const response = await apiFetch<DataResponse<{ reply: string }>>('/v1/ai/expense-chat', {
    method: 'POST',
    body: JSON.stringify({
      messages,
      clientToday: clientLocalCalendarISODate(),
    }),
    ...(init ?? {}),
  })
  return response.data
}
