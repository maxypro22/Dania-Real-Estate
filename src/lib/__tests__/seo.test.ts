import { describe, it, expect } from 'vitest'
import { resolveSeo, SEO, AREA_SEO } from '@/lib/seo'

// Characterization tests: pin the current resolveSeo behaviour before any code
// nearby is touched. These assert the mapping the app relies on for every
// route's <title>/canonical/social copy.
describe('resolveSeo', () => {
  it('returns the exact entry for a known static route', () => {
    expect(resolveSeo('/contact-us/')).toBe(SEO['/contact-us/'])
    expect(resolveSeo('/')).toBe(SEO['/'])
  })

  it('resolves an /areas/<slug>/ route to its area entry', () => {
    expect(resolveSeo('/areas/al-sadd/')).toBe(AREA_SEO['al-sadd'])
    expect(resolveSeo('/areas/doha/')).toBe(AREA_SEO['doha'])
  })

  it('falls back to the home entry for an unknown route', () => {
    expect(resolveSeo('/nope/')).toBe(SEO['/'])
    expect(resolveSeo('/areas/not-a-real-area/')).toBe(SEO['/'])
  })
})
