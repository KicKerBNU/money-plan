import { expect, test } from '@playwright/test'
import { loginAsE2eUser } from './auth'
import {
  createDefaultRecurringExpense,
  installFinanceApiMock,
} from './fixtures/finance-api-mock'

test.describe('Delete recurring expense', () => {
  test('cancel on confirm keeps the recurring expense', async ({ page }) => {
    const item = createDefaultRecurringExpense({ id: 401, note: 'Keep subscription' })
    await installFinanceApiMock(page, {
      expenses: [],
      recurringExpenses: [item],
    })

    await loginAsE2eUser(page)
    await page.goto('/app/recurring-expenses')

    const row = page.getByTestId(`recurring-expense-row-${item.id}`)
    await expect(row).toBeVisible()

    await row.getByTestId('recurring-expense-delete').click()
    await expect(page.getByTestId('confirm-modal')).toBeVisible()
    await page.getByTestId('confirm-modal-cancel').click()

    await expect(page.getByTestId('confirm-modal')).toHaveCount(0)
    await expect(row).toBeVisible()
    await expect(row).toContainText('Keep subscription')
  })

  test('confirm removes the recurring expense from the list', async ({ page }) => {
    const item = createDefaultRecurringExpense({ id: 402, note: 'Cancel me' })
    const api = await installFinanceApiMock(page, {
      expenses: [],
      recurringExpenses: [item],
    })

    await loginAsE2eUser(page)
    await page.goto('/app/recurring-expenses')

    const row = page.getByTestId(`recurring-expense-row-${item.id}`)
    await expect(row).toBeVisible()
    await expect(row).toContainText('Cancel me')

    await row.getByTestId('recurring-expense-delete').click()
    await expect(page.getByTestId('confirm-modal')).toBeVisible()
    await page.getByTestId('confirm-modal-confirm').click()

    await expect(page.getByTestId('confirm-modal')).toHaveCount(0)
    await expect(row).toHaveCount(0)
    await expect.poll(() => api.deletedRecurringIds).toEqual([item.id])
  })
})
