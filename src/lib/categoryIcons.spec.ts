import { describe, expect, it } from 'vitest'
import { categoryIconForName } from './categoryIcons'

describe('categoryIconForName', () => {
  it('maps known seeded category names (case-insensitive)', () => {
    expect(categoryIconForName('Food')).toBe('utensils')
    expect(categoryIconForName(' food ')).toBe('utensils')
    expect(categoryIconForName('Social Life')).toBe('users')
  })

  it('falls back to tag for unknown names', () => {
    expect(categoryIconForName('Vacation')).toBe('tag')
    expect(categoryIconForName('')).toBe('tag')
  })
})
