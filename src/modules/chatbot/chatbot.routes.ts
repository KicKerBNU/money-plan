import type { RouteRecordRaw } from 'vue-router'

export const chatbotRoutes: RouteRecordRaw[] = [
  {
    path: '/app/chatbot',
    name: 'chatbot',
    component: () => import('./chatbot.vue'),
    meta: { requiresAuth: true },
  },
]
