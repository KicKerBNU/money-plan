import { expect, type Locator, test } from '@playwright/test'
import { loginAsE2eUser } from './auth'
import {
  createDefaultExpense,
  createDefaultIncome,
  createDefaultRecurringExpense,
  createDefaultRecurringIncome,
  installFinanceApiMock,
} from './fixtures/finance-api-mock'

type FieldMetrics = {
  padStart: number
  padEnd: number
  iconInset: string
  padX: string
}

async function readFieldMetrics(field: Locator): Promise<FieldMetrics> {
  return field.evaluate((el: HTMLElement) => {
    const styles = getComputedStyle(el)
    return {
      padStart: Number.parseFloat(styles.paddingInlineStart),
      padEnd: Number.parseFloat(styles.paddingInlineEnd),
      iconInset: styles.getPropertyValue('--theme-input-icon-inset').trim(),
      padX: styles.getPropertyValue('--theme-input-pad-x').trim(),
    }
  })
}

/** Select + date fields must share left text pad and trailing icon slot. */
async function expectAlignedPickerFields(selectField: Locator, dateField: Locator) {
  await expect(selectField).toBeVisible()
  await expect(dateField).toBeVisible()

  const select = await readFieldMetrics(selectField)
  const date = await readFieldMetrics(dateField)

  expect(select.padX, 'select should expose shared --theme-input-pad-x').toBe('0.75rem')
  expect(date.padX, 'date should expose shared --theme-input-pad-x').toBe('0.75rem')
  expect(select.iconInset, 'select should expose shared --theme-input-icon-inset').toBe('0.75rem')
  expect(date.iconInset, 'date should expose shared --theme-input-icon-inset').toBe('0.75rem')

  expect(select.padStart).toBeCloseTo(date.padStart, 0)
  expect(select.padEnd).toBeCloseTo(date.padEnd, 0)
  // Trailing icon slot is wider than the start pad (chevron / calendar room).
  expect(select.padEnd).toBeGreaterThan(select.padStart)
  expect(date.padEnd).toBeGreaterThan(date.padStart)
}

test.describe('Form field icon / padding metrics', () => {
  test('recurring expense edit: selects align with start date', async ({ page }) => {
    const item = createDefaultRecurringExpense({ id: 301, note: 'Apple Storage' })
    await installFinanceApiMock(page, { expenses: [], recurringExpenses: [item] })

    await loginAsE2eUser(page)
    await page.goto('/app/recurring-expenses')
    await page
      .getByTestId(`recurring-expense-row-${item.id}`)
      .getByTestId('recurring-expense-edit')
      .click()
    await expect(page.getByTestId('recurring-expense-modal')).toBeVisible()

    const date = page.getByTestId('recurring-expense-form-start-date')
    await expectAlignedPickerFields(page.getByTestId('recurring-expense-form-category'), date)
    await expectAlignedPickerFields(page.getByTestId('recurring-expense-form-account'), date)
    await expectAlignedPickerFields(page.getByTestId('recurring-expense-form-frequency'), date)
  })

  test('recurring income edit: selects align with start date', async ({ page }) => {
    const item = createDefaultRecurringIncome({ id: 601, note: 'Salary' })
    await installFinanceApiMock(page, { expenses: [], recurringIncomes: [item] })

    await loginAsE2eUser(page)
    await page.goto('/app/recurring-incomes')
    await page
      .getByTestId(`recurring-income-row-${item.id}`)
      .getByTestId('recurring-income-edit')
      .click()
    await expect(page.getByTestId('recurring-income-modal')).toBeVisible()

    const date = page.getByTestId('recurring-income-form-start-date')
    await expectAlignedPickerFields(page.getByTestId('recurring-income-form-account'), date)
    await expectAlignedPickerFields(page.getByTestId('recurring-income-form-frequency'), date)
  })

  test('expense modal: account select aligns with date', async ({ page }) => {
    const expense = createDefaultExpense({ id: 101 })
    await installFinanceApiMock(page, [expense])

    await loginAsE2eUser(page)
    await page.getByTestId(`expense-row-${expense.id}`).getByTestId('expense-edit').click()
    await expect(page.getByTestId('expense-modal')).toBeVisible()

    await expectAlignedPickerFields(
      page.getByTestId('expense-form-account'),
      page.getByTestId('expense-form-date'),
    )
  })

  test('income modal: account select aligns with date', async ({ page }) => {
    const income = createDefaultIncome({ id: 501 })
    await installFinanceApiMock(page, {
      expenses: [],
      incomes: [income],
    })

    await loginAsE2eUser(page)
    await page.goto('/app/income')
    await page.getByTestId(`income-row-${income.id}`).getByTestId('income-edit').click()
    await expect(page.getByTestId('income-modal')).toBeVisible()

    await expectAlignedPickerFields(
      page.getByTestId('income-form-account'),
      page.getByTestId('income-form-date'),
    )
  })
})
