import { expect, test } from '@playwright/test'
import { loginAsE2eUser } from './auth'
import { createDefaultExpense, installFinanceApiMock } from './fixtures/finance-api-mock'

test.describe('Delete expense', () => {
  test('cancel on confirm keeps the expense', async ({ page }) => {
    const expense = createDefaultExpense({ id: 201, note: 'Keep me' })
    await installFinanceApiMock(page, [expense])
    await loginAsE2eUser(page)

    const row = page.getByTestId(`expense-row-${expense.id}`)
    await expect(row).toBeVisible()

    await row.getByTestId('expense-delete').click()
    await expect(page.getByTestId('confirm-modal')).toBeVisible()
    await page.getByTestId('confirm-modal-cancel').click()

    await expect(page.getByTestId('confirm-modal')).toHaveCount(0)
    await expect(row).toBeVisible()
    await expect(row).toContainText('Keep me')
  })

  test('confirm removes the expense from the list', async ({ page }) => {
    const expense = createDefaultExpense({ id: 202, note: 'Delete me' })
    const api = await installFinanceApiMock(page, [expense])
    await loginAsE2eUser(page)

    const row = page.getByTestId(`expense-row-${expense.id}`)
    await expect(row).toBeVisible()
    await expect(row).toContainText('Delete me')

    await row.getByTestId('expense-delete').click()
    await expect(page.getByTestId('confirm-modal')).toBeVisible()
    await page.getByTestId('confirm-modal-confirm').click()

    await expect(page.getByTestId('confirm-modal')).toHaveCount(0)
    await expect(row).toHaveCount(0)
    await expect.poll(() => api.deletedIds).toEqual([expense.id])
  })
})
