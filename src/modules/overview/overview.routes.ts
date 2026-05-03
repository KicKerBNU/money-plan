import type { RouteRecordRaw } from 'vue-router'

export const overviewRoutes: RouteRecordRaw[] = [
  {
    path: '/app/overview',
    name: 'overview',
    component: () => import('./overview.vue'),
    meta: { requiresAuth: true },
  },
]
