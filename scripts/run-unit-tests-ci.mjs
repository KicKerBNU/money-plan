#!/usr/bin/env node
/**
 * Runs unit tests as a build gate. On failure, prints a clear message and exits
 * non-zero so Netlify / local `npm run build` / `yarn build` abort.
 */
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const frontendRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

console.log('')
console.log('=== Unit tests (build gate) ===')
console.log('Running Vitest unit suite before production build...')
console.log('')

const result = spawnSync(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['vitest', 'run', '--project', 'unit'],
  {
    cwd: frontendRoot,
    stdio: 'inherit',
    env: process.env,
    shell: process.platform === 'win32',
  },
)

const code = result.status ?? 1

if (code !== 0) {
  console.error('')
  console.error('================================================================')
  console.error('BUILD FAILED: unit tests are breaking.')
  console.error('Vitest reported failures above. The production build was stopped')
  console.error('so a broken suite cannot ship. Fix the failing tests, then rebuild.')
  console.error('Local check: yarn test   (or: npm test)')
  console.error('================================================================')
  console.error('')
  process.exit(code)
}

console.log('')
console.log('Unit tests passed. Continuing with type-check and Vite build...')
console.log('')
