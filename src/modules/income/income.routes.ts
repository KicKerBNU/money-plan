import type { RouteRecordRaw } from 'vue-router'

export const incomeRoutes: RouteRecordRaw[] = [
  {
    path: '/app/income',
    name: 'income',
    component: () => import('./income.vue'),
    meta: { requiresAuth: true },
  },
]
