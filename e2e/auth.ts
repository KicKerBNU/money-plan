import { expect, type Page } from '@playwright/test'
import { E2E_EMAIL, E2E_PASSWORD } from './auth.credentials'

/** Sign in via the login form against the Auth emulator (seeded in global-setup). */
export async function loginAsE2eUser(page: Page) {
  await page.goto('/login')
  await page.getByTestId('login-email').fill(E2E_EMAIL)
  await page.getByTestId('login-password').fill(E2E_PASSWORD)
  await page.getByTestId('login-submit').click()
  await expect(page).toHaveURL(/\/app\/expenses\/?$/)
  await expect(page.getByTestId('expenses-page')).toBeVisible()
}
