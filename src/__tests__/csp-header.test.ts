import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// Guards the CSP (F-004). The app still hotlinks Unsplash/Pexels images
// (F-007) and relies on inline styles (React style props + Tailwind), so the
// policy must keep those sources allowed until those dependencies are removed.
const vercel = JSON.parse(readFileSync(join(process.cwd(), 'vercel.json'), 'utf8'))

const allHeaders: { key: string; value: string }[] = (vercel.headers ?? [])
  .flatMap((h: { headers: { key: string; value: string }[] }) => h.headers)

const csp = allHeaders.find((h) => h.key === 'Content-Security-Policy')?.value

describe('Content-Security-Policy', () => {
  it('is present and ENFORCING (not report-only) in vercel.json (F-005)', () => {
    expect(csp).toBeTypeOf('string')
    // The no-op report-only header must be gone; enforcement is the fix.
    expect(allHeaders.some((h) => h.key === 'Content-Security-Policy-Report-Only')).toBe(false)
  })

  it('allows the image sources the app currently uses', () => {
    expect(csp).toMatch(/img-src[^;]*'self'/)
    expect(csp).toContain('images.unsplash.com')
    expect(csp).toContain('images.pexels.com')
  })

  it('keeps inline styles working and locks down object/base', () => {
    expect(csp).toMatch(/style-src[^;]*'unsafe-inline'/)
    expect(csp).toContain("object-src 'none'")
    expect(csp).toContain("base-uri 'self'")
  })
})
