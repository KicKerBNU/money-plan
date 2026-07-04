import type { RouteRecordRaw } from 'vue-router'

export const recurringIncomesRoutes: RouteRecordRaw[] = [
  {
    path: '/app/recurring-incomes',
    name: 'recurring-incomes',
    component: () => import('./recurring-incomes.vue'),
    meta: { requiresAuth: true },
  },
]
