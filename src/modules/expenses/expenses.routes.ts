import type { RouteRecordRaw } from 'vue-router'

export const expensesRoutes: RouteRecordRaw[] = [
  {
    path: '/app/expenses',
    name: 'expenses',
    component: () => import('./expenses.vue'),
    meta: { requiresAuth: true },
  },
]
