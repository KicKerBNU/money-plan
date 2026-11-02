import { expect, test } from '@playwright/test'
import { loginAsE2eUser } from './auth'

const appScreens = [
  { path: '/app/overview', testId: 'overview-page', name: 'overview' },
  { path: '/app/expenses', testId: 'expenses-page', name: 'expenses' },
  { path: '/app/recurring-expenses', testId: 'recurring-expenses-page', name: 'recurring expenses' },
  { path: '/app/chatbot', testId: 'chatbot-page', name: 'chatbot' },
  { path: '/app/income', testId: 'income-page', name: 'income' },
  { path: '/app/recurring-incomes', testId: 'recurring-incomes-page', name: 'recurring income' },
  { path: '/app/stats', testId: 'stats-page', name: 'stats' },
  { path: '/app/accounts', testId: 'accounts-page', name: 'accounts' },
] as const

test.describe('Authenticated app screens', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsE2eUser(page)
  })

  for (const screen of appScreens) {
    test(`${screen.name} page is available and visible`, async ({ page }) => {
      await page.goto(screen.path)

      await expect(page).toHaveURL(new RegExp(`${screen.path.replace(/\//g, '\\/')}\\/?$`))
      await expect(page.getByTestId(screen.testId)).toBeVisible()
      await expect(page.getByTestId('finance-nav')).toBeVisible()
    })
  }
})
