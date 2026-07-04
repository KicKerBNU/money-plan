import type { RouteRecordRaw } from 'vue-router'

export const recurringExpensesRoutes: RouteRecordRaw[] = [
  {
    path: '/app/recurring-expenses',
    name: 'recurring-expenses',
    component: () => import('./recurring-expenses.vue'),
    meta: { requiresAuth: true },
  },
]
