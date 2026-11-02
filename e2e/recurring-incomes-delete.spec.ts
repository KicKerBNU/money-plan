import { expect, test } from '@playwright/test'
import { loginAsE2eUser } from './auth'
import {
  createDefaultRecurringIncome,
  installFinanceApiMock,
} from './fixtures/finance-api-mock'

test.describe('Delete recurring income', () => {
  test('cancel on confirm keeps the recurring income', async ({ page }) => {
    const item = createDefaultRecurringIncome({ id: 611, note: 'Keep paycheck' })
    await installFinanceApiMock(page, {
      expenses: [],
      recurringIncomes: [item],
    })

    await loginAsE2eUser(page)
    await page.goto('/app/recurring-incomes')

    const row = page.getByTestId(`recurring-income-row-${item.id}`)
    await expect(row).toBeVisible()

    await row.getByTestId('recurring-income-delete').click()
    await expect(page.getByTestId('confirm-modal')).toBeVisible()
    await page.getByTestId('confirm-modal-cancel').click()

    await expect(page.getByTestId('confirm-modal')).toHaveCount(0)
    await expect(row).toBeVisible()
    await expect(row).toContainText('Keep paycheck')
  })

  test('confirm removes the recurring income from the list', async ({ page }) => {
    const item = createDefaultRecurringIncome({ id: 612, note: 'Cancel paycheck' })
    const api = await installFinanceApiMock(page, {
      expenses: [],
      recurringIncomes: [item],
    })

    await loginAsE2eUser(page)
    await page.goto('/app/recurring-incomes')

    const row = page.getByTestId(`recurring-income-row-${item.id}`)
    await expect(row).toBeVisible()
    await expect(row).toContainText('Cancel paycheck')

    await row.getByTestId('recurring-income-delete').click()
    await expect(page.getByTestId('confirm-modal')).toBeVisible()
    await page.getByTestId('confirm-modal-confirm').click()

    await expect(page.getByTestId('confirm-modal')).toHaveCount(0)
    await expect(row).toHaveCount(0)
    await expect.poll(() => api.deletedRecurringIncomeIds).toEqual([item.id])
  })
})
