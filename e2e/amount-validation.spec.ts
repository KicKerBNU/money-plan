import { expect, type Page, test } from '@playwright/test'
import { loginAsE2eUser } from './auth'
import {
  createDefaultExpense,
  createDefaultIncome,
  createDefaultRecurringExpense,
  createDefaultRecurringIncome,
  installFinanceApiMock,
} from './fixtures/finance-api-mock'

/**
 * Guards the contract that amount fields reject values &lt; min (e.g. -1) with
 * browser / form validation — submit must not close the modal or hit the API.
 */
async function expectNegativeAmountBlocked(
  page: Page,
  opts: {
    amountTestId: string
    submitTestId: string
    modalTestId: string
  },
) {
  const amount = page.getByTestId(opts.amountTestId)
  await amount.fill('-1')
  await page.getByTestId(opts.submitTestId).click()

  await expect(page.getByTestId(opts.modalTestId)).toBeVisible()

  const validity = await amount.evaluate((el: HTMLInputElement) => ({
    valid: el.validity.valid,
    rangeUnderflow: el.validity.rangeUnderflow,
    min: el.min,
  }))

  expect(validity.valid, 'amount input must be invalid for -1').toBe(false)
  expect(validity.rangeUnderflow, 'amount must use min so -1 is rangeUnderflow').toBe(true)
  expect(Number(validity.min), 'amount min must be >= 0').toBeGreaterThanOrEqual(0)
}

test.describe('Amount validation (negative values)', () => {
  test('expense edit blocks amount < 0 and does not save', async ({ page }) => {
    const expense = createDefaultExpense({ id: 101, amount: 42.5, note: 'Lunch' })
    const api = await installFinanceApiMock(page, [expense])

    await loginAsE2eUser(page)
    await page.getByTestId(`expense-row-${expense.id}`).getByTestId('expense-edit').click()
    await expect(page.getByTestId('expense-modal')).toBeVisible()

    await expectNegativeAmountBlocked(page, {
      amountTestId: 'expense-form-amount',
      submitTestId: 'expense-form-submit',
      modalTestId: 'expense-modal',
    })
    expect(api.putBodies).toHaveLength(0)
  })

  test('income edit blocks amount < 0 and does not save', async ({ page }) => {
    const income = createDefaultIncome({ id: 501, amount: 3000, note: 'Salary' })
    const api = await installFinanceApiMock(page, {
      expenses: [],
      incomes: [income],
    })

    await loginAsE2eUser(page)
    await page.goto('/app/income')
    await expect(page.getByTestId('income-page')).toBeVisible()

    await page.getByTestId(`income-row-${income.id}`).getByTestId('income-edit').click()
    await expect(page.getByTestId('income-modal')).toBeVisible()

    await expectNegativeAmountBlocked(page, {
      amountTestId: 'income-form-amount',
      submitTestId: 'income-form-submit',
      modalTestId: 'income-modal',
    })
    expect(api.incomePutBodies).toHaveLength(0)
  })

  test('recurring expense edit blocks amount < 0 and does not save', async ({ page }) => {
    const item = createDefaultRecurringExpense({ id: 301, amount: 0.99, note: 'Apple Storage' })
    const api = await installFinanceApiMock(page, {
      expenses: [],
      recurringExpenses: [item],
    })

    await loginAsE2eUser(page)
    await page.goto('/app/recurring-expenses')
    await expect(page.getByTestId('recurring-expenses-page')).toBeVisible()

    await page
      .getByTestId(`recurring-expense-row-${item.id}`)
      .getByTestId('recurring-expense-edit')
      .click()
    await expect(page.getByTestId('recurring-expense-modal')).toBeVisible()

    await expectNegativeAmountBlocked(page, {
      amountTestId: 'recurring-expense-form-amount',
      submitTestId: 'recurring-expense-form-submit',
      modalTestId: 'recurring-expense-modal',
    })
    expect(api.recurringPutBodies).toHaveLength(0)
  })

  test('recurring income edit blocks amount < 0 and does not save', async ({ page }) => {
    const item = createDefaultRecurringIncome({ id: 601, amount: 3000, note: 'Salary' })
    const api = await installFinanceApiMock(page, {
      expenses: [],
      recurringIncomes: [item],
    })

    await loginAsE2eUser(page)
    await page.goto('/app/recurring-incomes')
    await expect(page.getByTestId('recurring-incomes-page')).toBeVisible()

    await page
      .getByTestId(`recurring-income-row-${item.id}`)
      .getByTestId('recurring-income-edit')
      .click()
    await expect(page.getByTestId('recurring-income-modal')).toBeVisible()

    await expectNegativeAmountBlocked(page, {
      amountTestId: 'recurring-income-form-amount',
      submitTestId: 'recurring-income-form-submit',
      modalTestId: 'recurring-income-modal',
    })
    expect(api.recurringIncomePutBodies).toHaveLength(0)
  })
})
