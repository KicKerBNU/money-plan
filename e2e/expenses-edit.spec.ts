import { expect, test } from '@playwright/test'
import { loginAsE2eUser } from './auth'
import { createDefaultExpense, installFinanceApiMock } from './fixtures/finance-api-mock'

test.describe('Edit expense', () => {
  test('opens edit modal, saves changes, and updates the list', async ({ page }) => {
    const expense = createDefaultExpense({
      id: 101,
      amount: 42.5,
      note: 'Lunch',
      categoryName: 'Food',
    })
    const api = await installFinanceApiMock(page, [expense])

    await loginAsE2eUser(page)

    const row = page.getByTestId(`expense-row-${expense.id}`)
    await expect(row).toBeVisible()
    await expect(row).toContainText('Lunch')

    await row.getByTestId('expense-edit').click()

    await expect(page.getByTestId('expense-modal')).toBeVisible()
    await expect(page.getByTestId('expense-modal-title')).toBeVisible()
    await expect(page.getByTestId('expense-form-amount')).toHaveValue('42.5')
    await expect(page.getByTestId('expense-form-note')).toHaveValue('Lunch')

    await page.getByTestId('expense-form-amount').fill('55.25')
    await page.getByTestId('expense-form-note').fill('Dinner out')
    await page.getByTestId('expense-form-submit').click()

    await expect(page.getByTestId('expense-modal')).toHaveCount(0)
    await expect.poll(() => api.putBodies.length).toBe(1)
    expect(api.putBodies[0]).toMatchObject({
      amount: 55.25,
      note: 'Dinner out',
      categoryId: expense.categoryId,
      accountId: expense.accountId,
    })

    await expect(row).toContainText('Dinner out')
    await expect(row).toContainText('55.25')
  })
})
