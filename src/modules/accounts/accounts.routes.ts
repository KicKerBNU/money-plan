import type { RouteRecordRaw } from 'vue-router'

export const accountsRoutes: RouteRecordRaw[] = [
  {
    path: '/app/accounts',
    name: 'accounts',
    component: () => import('./accounts.vue'),
    meta: { requiresAuth: true },
  },
]
