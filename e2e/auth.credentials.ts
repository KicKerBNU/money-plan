/** Emulator-only defaults — not production credentials. Override via E2E_EMAIL / E2E_PASSWORD. */
export const E2E_EMAIL = process.env.E2E_EMAIL ?? 'e2e@money-plan.test'
export const E2E_PASSWORD = process.env.E2E_PASSWORD ?? 'e2e-password-123'
