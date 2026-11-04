import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')

describe('Netlify Content-Security-Policy', () => {
  const toml = readFileSync(join(root, 'netlify.toml'), 'utf8')
  const html = readFileSync(join(root, 'index.html'), 'utf8')

  it('blocks framing and sends a referrer policy', () => {
    expect(toml).toContain("frame-ancestors 'none'")
    expect(toml).toContain('Referrer-Policy = "strict-origin-when-cross-origin"')
  })

  it('allows the production site, Railway API, and sign-in hosts', () => {
    expect(toml).toContain('https://money-plan-backend-production.up.railway.app')
    expect(toml).toContain('https://accounts.google.com')
    expect(toml).toContain('https://appleid.apple.com')
    expect(toml).toContain('https://money-plan-23efb.firebaseapp.com')
    expect(toml).toContain("style-src-attr 'unsafe-inline'")
    expect(toml).not.toContain("script-src 'self' 'unsafe-inline'")
  })

  it('hashes the JSON-LD block in index.html', () => {
    const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
    expect(match).not.toBeNull()
    const hash = createHash('sha256').update(match?.[1] ?? '').digest('base64')
    expect(toml).toContain(`'sha256-${hash}'`)
  })
})
