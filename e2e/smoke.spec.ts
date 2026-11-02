import { expect, test } from '@playwright/test'
import { loginAsE2eUser } from './auth'

test.describe('Money Plan smoke', () => {
  test('landing page loads and links to login', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByTestId('home-page')).toBeVisible()
    await expect(page.locator('h1')).toBeVisible()

    await page.getByTestId('home-cta-login').click()
    await expect(page).toHaveURL(/\/login\/?$/)
    await expect(page.getByTestId('login-page')).toBeVisible()
  })

  test('login screen shows email form and providers', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByTestId('login-page')).toBeVisible()
    await expect(page.getByTestId('login-title')).toBeVisible()
    await expect(page.getByTestId('login-email')).toBeVisible()
    await expect(page.getByTestId('login-password')).toBeVisible()
    await expect(page.getByTestId('login-submit')).toBeVisible()
    await expect(page.getByTestId('login-google')).toBeVisible()
  })

  test('protected app routes redirect guests to login', async ({ page }) => {
    await page.goto('/app/expenses')

    await expect(page).toHaveURL(/\/login\/?$/)
    await expect(page.getByTestId('login-page')).toBeVisible()
  })

  test('invalid email login stays on login and shows an error', async ({ page }) => {
    await page.goto('/login')

    await page.getByTestId('login-email').fill('e2e-invalid@example.com')
    await page.getByTestId('login-password').fill('wrong-password-123')
    await page.getByTestId('login-submit').click()

    await expect(page).toHaveURL(/\/login\/?$/)
    await expect(page.getByTestId('login-error')).toBeVisible()
  })

  test('successful email login reaches the expenses app', async ({ page }) => {
    await loginAsE2eUser(page)
    await expect(page.getByTestId('finance-nav')).toBeVisible()
  })
})
