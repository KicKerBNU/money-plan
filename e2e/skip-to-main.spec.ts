import { expect, test } from '@playwright/test'
import { loginAsE2eUser } from './auth'
import { installFinanceApiMock } from './fixtures/finance-api-mock'

test.describe('Skip to main content', () => {
  test('skip link focuses #main-content on Enter', async ({ page }) => {
    await installFinanceApiMock(page)
    await loginAsE2eUser(page)

    const skip = page.getByTestId('skip-to-main')
    await expect(skip).toBeAttached()
    await skip.focus()
    await expect(skip).toBeFocused()

    await skip.press('Enter')
    await expect(page.locator('#main-content')).toBeFocused()
  })
})
