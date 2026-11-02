import { expect, test } from '@playwright/test'
import { loginAsE2eUser } from './auth'
import { createDefaultIncome, installFinanceApiMock } from './fixtures/finance-api-mock'

test.describe('Delete income', () => {
  test('cancel on confirm keeps the income', async ({ page }) => {
    const income = createDefaultIncome({ id: 511, note: 'Keep income' })
    await installFinanceApiMock(page, { expenses: [], incomes: [income] })

    await loginAsE2eUser(page)
    await page.goto('/app/income')

    const row = page.getByTestId(`income-row-${income.id}`)
    await expect(row).toBeVisible()

    await row.getByTestId('income-delete').click()
    await expect(page.getByTestId('confirm-modal')).toBeVisible()
    await page.getByTestId('confirm-modal-cancel').click()

    await expect(page.getByTestId('confirm-modal')).toHaveCount(0)
    await expect(row).toBeVisible()
    await expect(row).toContainText('Keep income')
  })

  test('confirm removes the income from the list', async ({ page }) => {
    const income = createDefaultIncome({ id: 512, note: 'Delete income' })
    const api = await installFinanceApiMock(page, { expenses: [], incomes: [income] })

    await loginAsE2eUser(page)
    await page.goto('/app/income')

    const row = page.getByTestId(`income-row-${income.id}`)
    await expect(row).toBeVisible()
    await expect(row).toContainText('Delete income')

    await row.getByTestId('income-delete').click()
    await expect(page.getByTestId('confirm-modal')).toBeVisible()
    await page.getByTestId('confirm-modal-confirm').click()

    await expect(page.getByTestId('confirm-modal')).toHaveCount(0)
    await expect(row).toHaveCount(0)
    await expect.poll(() => api.deletedIncomeIds).toEqual([income.id])
  })
})
