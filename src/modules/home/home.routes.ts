import type { RouteRecordRaw } from 'vue-router'

export const homeRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('./home.vue'),
  },
  {
    path: '/faq',
    name: 'faq',
    component: () => import('./faq.vue'),
  },
]
