import type { FullConfig } from '@playwright/test'
import { E2E_EMAIL, E2E_PASSWORD } from './auth.credentials'

const PROJECT_ID = 'money-plan-23efb'
const AUTH_ORIGIN = process.env.E2E_AUTH_EMULATOR_ORIGIN ?? 'http://127.0.0.1:9099'

async function waitForAuthEmulator(timeoutMs = 120_000) {
  const deadline = Date.now() + timeoutMs
  const configUrl = `${AUTH_ORIGIN}/emulator/v1/projects/${PROJECT_ID}/config`

  while (Date.now() < deadline) {
    try {
      const res = await fetch(configUrl)
      if (res.ok) return
    } catch {
      /* not ready yet */
    }
    await new Promise((r) => setTimeout(r, 500))
  }

  throw new Error(
    `Firebase Auth emulator did not become ready at ${AUTH_ORIGIN}. ` +
      'Start it with: yarn firebase emulators:start --only auth --project money-plan-23efb',
  )
}

async function seedE2eUser() {
  await fetch(`${AUTH_ORIGIN}/emulator/v1/projects/${PROJECT_ID}/accounts`, {
    method: 'DELETE',
  })

  const res = await fetch(
    `${AUTH_ORIGIN}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: E2E_EMAIL,
        password: E2E_PASSWORD,
        returnSecureToken: true,
      }),
    },
  )

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Failed to seed e2e auth user (${res.status}): ${body}`)
  }
}

export default async function globalSetup(_config: FullConfig) {
  await waitForAuthEmulator()
  await seedE2eUser()
  console.log(`[e2e] Seeded Auth emulator user ${E2E_EMAIL}`)
}
