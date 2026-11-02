import { expect, test } from '@playwright/test'
import { loginAsE2eUser } from './auth'
import { createDefaultIncome, installFinanceApiMock } from './fixtures/finance-api-mock'

test.describe('Edit income', () => {
  test('opens edit modal, saves changes, and updates the list', async ({ page }) => {
    const income = createDefaultIncome({ id: 501, amount: 3000, note: 'Salary' })
    const api = await installFinanceApiMock(page, {
      expenses: [],
      incomes: [income],
    })

    await loginAsE2eUser(page)
    await page.goto('/app/income')
    await expect(page.getByTestId('income-page')).toBeVisible()

    const row = page.getByTestId(`income-row-${income.id}`)
    await expect(row).toBeVisible()
    await expect(row).toContainText('Salary')

    await row.getByTestId('income-edit').click()
    await expect(page.getByTestId('income-modal')).toBeVisible()
    await expect(page.getByTestId('income-form-amount')).toHaveValue('3000')
    await expect(page.getByTestId('income-form-note')).toHaveValue('Salary')

    await page.getByTestId('income-form-amount').fill('3500.5')
    await page.getByTestId('income-form-note').fill('Bonus salary')
    await page.getByTestId('income-form-submit').click()

    await expect(page.getByTestId('income-modal')).toHaveCount(0)
    await expect.poll(() => api.incomePutBodies.length).toBe(1)
    expect(api.incomePutBodies[0]).toMatchObject({
      amount: 3500.5,
      note: 'Bonus salary',
      accountId: income.accountId,
    })

    await expect(row).toContainText('Bonus salary')
    await expect(row).toContainText('3,500.50')
  })
})
