import { expect, test } from '@playwright/test'
import { loginAsE2eUser } from './auth'
import {
  createDefaultRecurringIncome,
  installFinanceApiMock,
} from './fixtures/finance-api-mock'

test.describe('Edit recurring income', () => {
  test('opens edit modal, saves changes, and updates the list', async ({ page }) => {
    const item = createDefaultRecurringIncome({
      id: 601,
      amount: 3000,
      note: 'Monthly salary',
    })
    const api = await installFinanceApiMock(page, {
      expenses: [],
      recurringIncomes: [item],
    })

    await loginAsE2eUser(page)
    await page.goto('/app/recurring-incomes')
    await expect(page.getByTestId('recurring-incomes-page')).toBeVisible()

    const row = page.getByTestId(`recurring-income-row-${item.id}`)
    await expect(row).toBeVisible()
    await expect(row).toContainText('Monthly salary')

    await row.getByTestId('recurring-income-edit').click()
    await expect(page.getByTestId('recurring-income-modal')).toBeVisible()
    await expect(page.getByTestId('recurring-income-form-amount')).toHaveValue('3000')
    await expect(page.getByTestId('recurring-income-form-note')).toHaveValue('Monthly salary')

    await page.getByTestId('recurring-income-form-amount').fill('3200.75')
    await page.getByTestId('recurring-income-form-note').fill('Updated salary')
    await page.getByTestId('recurring-income-form-submit').click()

    await expect(page.getByTestId('recurring-income-modal')).toHaveCount(0)
    await expect.poll(() => api.recurringIncomePutBodies.length).toBe(1)
    expect(api.recurringIncomePutBodies[0]).toMatchObject({
      amount: 3200.75,
      note: 'Updated salary',
      accountId: item.accountId,
      frequency: item.frequency,
    })

    await expect(row).toContainText('Updated salary')
    await expect(row).toContainText('3,200.75')
  })
})
