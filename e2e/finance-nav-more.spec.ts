import { expect, test } from '@playwright/test'
import { loginAsE2eUser } from './auth'

const moreDestinations = [
  { key: 'overview' },
  { key: 'income' },
  { key: 'recurring' },
  { key: 'recurringIncome' },
  { key: 'stats' },
] as const

/** Mobile viewport only — keep Chromium (project default); do not spread iPhone device (webkit). */
test.use({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
})

test.describe('Mobile finance More nav', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsE2eUser(page)
  })

  test('dock More sheet reaches sidebar-only destinations', async ({ page }) => {
    await expect(page.getByTestId('finance-mobile-nav')).toBeVisible()
    await expect(page.getByTestId('finance-nav-more')).toBeVisible()

    await page.getByTestId('finance-nav-more').click()
    await expect(page.getByTestId('finance-nav-more-sheet')).toBeVisible()

    for (const dest of moreDestinations) {
      await expect(page.getByTestId(`finance-nav-more-${dest.key}`)).toBeVisible()
    }

    await page.getByTestId('finance-nav-more-overview').click()
    await expect(page).toHaveURL(/\/app\/overview\/?$/)
    await expect(page.getByTestId('overview-page')).toBeVisible()
    await expect(page.getByTestId('finance-nav-more-sheet')).toHaveCount(0)

    await page.getByTestId('finance-nav-more').click()
    await page.getByTestId('finance-nav-more-stats').click()
    await expect(page).toHaveURL(/\/app\/stats\/?$/)
    await expect(page.getByTestId('stats-page')).toBeVisible()
  })

  test('More sheet closes without navigating', async ({ page }) => {
    await page.getByTestId('finance-nav-more').click()
    await expect(page.getByTestId('finance-nav-more-sheet')).toBeVisible()

    await page.getByTestId('finance-nav-more-close').click()
    await expect(page.getByTestId('finance-nav-more-sheet')).toHaveCount(0)
    await expect(page).toHaveURL(/\/app\/expenses\/?$/)
  })
})
