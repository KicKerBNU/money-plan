import { expect, test } from '@playwright/test'
import { loginAsE2eUser } from './auth'
import { installFinanceApiMock } from './fixtures/finance-api-mock'

test.describe('Accounts double-submit guard', () => {
  test('rename submit disables and only fires one update', async ({ page }) => {
    await installFinanceApiMock(page)

    let accountPutCount = 0
    await page.route('**/v1/accounts/*', async (route) => {
      if (route.request().method().toUpperCase() !== 'PUT') {
        return route.fallback()
      }
      accountPutCount += 1
      await new Promise((resolve) => setTimeout(resolve, 500))
      const body = route.request().postDataJSON() as { name: string; initialBalance?: number }
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            id: 1,
            name: body.name,
            isDefault: true,
            initialBalance: body.initialBalance ?? 0,
            currentBalance: body.initialBalance ?? 0,
          },
        }),
      })
    })

    await loginAsE2eUser(page)
    await page.goto('/app/accounts')
    await expect(page.getByTestId('accounts-page')).toBeVisible()

    await page.getByLabel(/^(Edit|Editar)$/i).first().click()
    await expect(page.getByTestId('accounts-rename-input')).toBeVisible()
    await page.getByTestId('accounts-rename-input').fill('Cash renamed')

    const submit = page.getByTestId('accounts-rename-submit')
    await submit.click()
    await expect(submit).toBeDisabled()
    await submit.click({ force: true }).catch(() => undefined)

    await expect.poll(() => accountPutCount).toBe(1)
    await expect(page.getByTestId('accounts-rename-input')).toHaveCount(0)
  })
})
