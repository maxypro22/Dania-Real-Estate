import { describe, it, expect } from 'vitest'
import { asArray } from '@/lib/asArray'

describe('asArray', () => {
  it('passes arrays through unchanged', () => {
    const arr = [{ a: 1 }, { a: 2 }]
    expect(asArray(arr)).toBe(arr)
  })

  it('returns [] for a string (the i18next missing-key failure mode)', () => {
    // When a returnObjects key is missing, i18next returns the string key.
    expect(asArray('home.journey.steps')).toEqual([])
  })

  it('returns [] for null/undefined/object', () => {
    expect(asArray(null)).toEqual([])
    expect(asArray(undefined)).toEqual([])
    expect(asArray({ 0: 'a', length: 1 })).toEqual([])
  })
})
