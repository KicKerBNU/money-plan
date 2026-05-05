import { createRouter, createWebHistory } from 'vue-router'
import { firebaseAuth } from '@/plugins/firebase'
import { authRoutes } from '@/modules/auth/auth.routes'
import { expensesRoutes } from '@/modules/expenses/expenses.routes'
import { homeRoutes } from '@/modules/home/home.routes'
import { incomeRoutes } from '@/modules/income/income.routes'
import { accountsRoutes } from '@/modules/accounts/accounts.routes'
import { chatbotRoutes } from '@/modules/chatbot/chatbot.routes'
import { overviewRoutes } from '@/modules/overview/overview.routes'
import { statsRoutes } from '@/modules/stats/stats.routes'
import { useAuthStore } from '@/modules/auth/store/auth.store'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...homeRoutes,
    ...authRoutes,
    ...incomeRoutes,
    ...expensesRoutes,
    ...accountsRoutes,
    ...overviewRoutes,
    ...statsRoutes,
    ...chatbotRoutes,
    { path: '/app', redirect: '/app/expenses' },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  authStore.init()

  if (!authStore.ready) {
    await new Promise<void>((resolve) => {
      const unsubscribe = firebaseAuth.onAuthStateChanged(() => {
        unsubscribe()
        resolve()
      })
    })
  }

  const requiresAuth = Boolean(to.meta.requiresAuth)
  if (requiresAuth && !firebaseAuth.currentUser) {
    return '/login'
  }

  if (to.path === '/login' && firebaseAuth.currentUser) {
    return '/app/expenses'
  }

  return true
})
