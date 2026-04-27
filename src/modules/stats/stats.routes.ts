import type { RouteRecordRaw } from 'vue-router'

export const statsRoutes: RouteRecordRaw[] = [
  {
    path: '/app/stats',
    name: 'stats',
    component: () => import('./stats.vue'),
    meta: { requiresAuth: true },
  },
]
