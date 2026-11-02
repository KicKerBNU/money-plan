import { expect, test } from '@playwright/test'
import { loginAsE2eUser } from './auth'

test.describe('Settings menu (logged-in only)', () => {
  test('is not visible to guests on login or home', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByTestId('login-page')).toBeVisible()
    await expect(page.getByTestId('settings-menu-trigger')).toHaveCount(0)

    await page.goto('/')
    await expect(page.getByTestId('home-page')).toBeVisible()
    await expect(page.getByTestId('settings-menu-trigger')).toHaveCount(0)
  })

  test.describe('when authenticated', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsE2eUser(page)
    })

    test('shows settings trigger and menu actions', async ({ page }) => {
      await expect(page.getByTestId('settings-menu-trigger')).toBeVisible()

      await page.getByTestId('settings-menu-trigger').click()
      await expect(page.getByTestId('settings-menu-panel')).toBeVisible()
      await expect(page.getByTestId('settings-theme-toggle')).toBeVisible()
      await expect(page.getByTestId('settings-currency')).toBeVisible()
      await expect(page.getByTestId('settings-delete-account')).toBeVisible()
      await expect(page.getByTestId('settings-logout')).toBeVisible()
    })

    test('toggles dark / light theme', async ({ page }) => {
      const html = page.locator('html')
      const before = await html.getAttribute('data-theme')

      await page.getByTestId('settings-menu-trigger').click()
      await page.getByTestId('settings-theme-toggle').click()

      const after = await html.getAttribute('data-theme')
      expect(after).toBe(before === 'dark' ? 'light' : 'dark')
      await expect(page.getByTestId('settings-menu-panel')).toBeHidden()
    })

    test('opens currency options and can select a currency', async ({ page }) => {
      await page.getByTestId('settings-menu-trigger').click()
      await page.getByTestId('settings-currency').click()

      await expect(page.getByTestId('settings-currency-options')).toBeVisible()
      await expect(page.getByTestId('settings-currency-auto')).toBeVisible()
      await expect(page.getByTestId('settings-currency-BRL')).toBeVisible()

      await page.getByTestId('settings-currency-BRL').click()
      await expect(page.getByTestId('settings-menu-panel')).toBeHidden()

      await page.getByTestId('settings-menu-trigger').click()
      await expect(page.getByTestId('settings-currency')).toContainText('BRL')
    })

    test('delete account opens confirm modal and cancel keeps the session', async ({ page }) => {
      await page.getByTestId('settings-menu-trigger').click()
      await page.getByTestId('settings-delete-account').click()

      await expect(page.getByTestId('confirm-modal')).toBeVisible()
      await page.getByTestId('confirm-modal-cancel').click()
      await expect(page.getByTestId('confirm-modal')).toHaveCount(0)

      await expect(page).toHaveURL(/\/app\/expenses\/?$/)
      await expect(page.getByTestId('settings-menu-trigger')).toBeVisible()
    })

    test('logout returns to login and hides settings', async ({ page }) => {
      await page.getByTestId('settings-menu-trigger').click()
      await page.getByTestId('settings-logout').click()

      await expect(page).toHaveURL(/\/login\/?$/)
      await expect(page.getByTestId('login-page')).toBeVisible()
      await expect(page.getByTestId('settings-menu-trigger')).toHaveCount(0)
    })
  })
})
