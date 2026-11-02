import { defineConfig, devices } from '@playwright/test'

const PORT = Number(process.env.E2E_PORT ?? 1074)
const baseURL = process.env.E2E_BASE_URL ?? `http://127.0.0.1:${PORT}`
const authOrigin = process.env.E2E_AUTH_EMULATOR_ORIGIN ?? 'http://127.0.0.1:9099'

/**
 * Local `yarn test:ci` / pre-commit set CI=true for workers/retries, but Auth
 * emulator or Vite may already be running — reuse those. Only force a fresh
 * webServer on remote CI (Netlify / GitHub Actions) unless overridden.
 */
const remoteCi = Boolean(process.env.NETLIFY || process.env.GITHUB_ACTIONS)
const reuse =
  process.env.E2E_REUSE_SERVER === 'true'
    ? true
    : process.env.E2E_REUSE_SERVER === 'false'
      ? false
      : !remoteCi

/**
 * Smoke / auth e2e against Vite + Firebase Auth emulator.
 * Starts auth emulator + `yarn dev` (with VITE_USE_FIREBASE_AUTH_EMULATOR)
 * unless E2E_BASE_URL is set (reuse already-running servers).
 */
export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.ts',
  fullyParallel: true,
  forbidOnly: remoteCi,
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
