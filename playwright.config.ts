import { defineConfig, devices } from '@playwright/test'

const PORT = Number(process.env.E2E_PORT ?? 1074)
const baseURL = process.env.E2E_BASE_URL ?? `http://127.0.0.1:${PORT}`
const authOrigin = process.env.E2E_AUTH_EMULATOR_ORIGIN ?? 'http://127.0.0.1:9099'
const reuse = !process.env.CI

/**
 * Smoke / auth e2e against Vite + Firebase Auth emulator.
 * Starts auth emulator + `yarn dev` (with VITE_USE_FIREBASE_AUTH_EMULATOR)
 * unless E2E_BASE_URL is set (reuse already-running servers).
 */
export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.ts',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  timeout: 45_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : [
        {
          command: 'yarn firebase emulators:start --only auth --project money-plan-23efb',
          url: `${authOrigin}/emulator/v1/projects/money-plan-23efb/config`,
          reuseExistingServer: reuse,
          timeout: 180_000,
        },
        {
          command: `yarn dev --host 127.0.0.1 --port ${PORT}`,
          url: baseURL,
          reuseExistingServer: reuse,
          timeout: 120_000,
          env: {
            ...process.env,
            VITE_USE_FIREBASE_AUTH_EMULATOR: 'true',
          },
        },
      ],
})
