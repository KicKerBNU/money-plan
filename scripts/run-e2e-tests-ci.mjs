#!/usr/bin/env node
/**
 * Runs Playwright e2e smoke tests as a build gate. Installs Chromium if needed,
 * then exits non-zero with a clear message so Netlify / local builds abort.
 */
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const frontendRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const isWin = process.platform === 'win32'
const npx = isWin ? 'npx.cmd' : 'npx'

function run(label, args) {
  console.log('')
  console.log(label)
  const result = spawnSync(npx, args, {
    cwd: frontendRoot,
    stdio: 'inherit',
    env: {
      ...process.env,
      CI: process.env.CI ?? 'true',
    },
    shell: isWin,
  })
  return result.status ?? 1
}

console.log('')
console.log('=== E2E tests (build gate) ===')
console.log('Ensuring Playwright Chromium is installed...')

const installCode = run('npx playwright install chromium', ['playwright', 'install', 'chromium'])
if (installCode !== 0) {
  console.error('')
  console.error('================================================================')
  console.error('BUILD FAILED: could not install Playwright Chromium for e2e tests.')
  console.error('The production build was stopped. Fix the install error above,')
  console.error('then rebuild. Local check: yarn playwright install chromium')
  console.error('================================================================')
  console.error('')
  process.exit(installCode)
}

console.log('')
console.log('Running full Playwright e2e suite (any failure aborts the build / deploy)...')

const testCode = run('npx playwright test', ['playwright', 'test'])
if (testCode !== 0) {
  console.error('')
  console.error('================================================================')
  console.error('BUILD FAILED: e2e tests are breaking — deploy blocked.')
  console.error('One or more Playwright e2e tests failed (see output above).')
  console.error('The production build was stopped; nothing will be deployed until they pass.')
  console.error('E2E needs Java + Firebase Auth emulator (yarn firebase emulators:start --only auth).')
  console.error('Local check: yarn test:e2e')
  console.error('Report (after a run): yarn playwright show-report')
  console.error('================================================================')
  console.error('')
  process.exit(testCode)
}

console.log('')
console.log('E2E tests passed. Continuing with type-check and Vite build...')
console.log('')
