import { expect, test } from '@playwright/test'
import { loginAsE2eUser } from './auth'
import {
  createDefaultRecurringExpense,
  installFinanceApiMock,
} from './fixtures/finance-api-mock'

test.describe('Edit recurring expense', () => {
  test('opens edit modal, saves changes, and updates the list', async ({ page }) => {
    const item = createDefaultRecurringExpense({
      id: 301,
      amount: 99,
      note: 'Netflix',
    })
    const api = await installFinanceApiMock(page, {
      expenses: [],
      recurringExpenses: [item],
    })

    await loginAsE2eUser(page)
    await page.goto('/app/recurring-expenses')
    await expect(page.getByTestId('recurring-expenses-page')).toBeVisible()

    const row = page.getByTestId(`recurring-expense-row-${item.id}`)
    await expect(row).toBeVisible()
    await expect(row).toContainText('Netflix')

    await row.getByTestId('recurring-expense-edit').click()
    await expect(page.getByTestId('recurring-expense-modal')).toBeVisible()
    await expect(page.getByTestId('recurring-expense-form-amount')).toHaveValue('99')
    await expect(page.getByTestId('recurring-expense-form-note')).toHaveValue('Netflix')

    await page.getByTestId('recurring-expense-form-amount').fill('120.5')
    await page.getByTestId('recurring-expense-form-note').fill('Streaming bundle')
    await page.getByTestId('recurring-expense-form-submit').click()

    await expect(page.getByTestId('recurring-expense-modal')).toHaveCount(0)
    await expect.poll(() => api.recurringPutBodies.length).toBe(1)
    expect(api.recurringPutBodies[0]).toMatchObject({
      amount: 120.5,
      note: 'Streaming bundle',
      categoryId: item.categoryId,
      accountId: item.accountId,
      frequency: item.frequency,
    })

    await expect(row).toContainText('Streaming bundle')
    await expect(row).toContainText('120.5')
  })
})
