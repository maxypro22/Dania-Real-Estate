import { describe, it, expect } from 'vitest'
// The prerender injector is a pure function; test it without running a build.
// @ts-expect-error - build-only .mjs script ships no type declarations
import { injectMeta } from '../../scripts/prerender.mjs'

const TEMPLATE = `<!doctype html>
<html lang="en">
  <head>
    <title>Home Default</title>
    <meta name="description" content="home default desc" />
    <link rel="canonical" href="https://dania-realestate.com/" />
  </head>
  <body><div id="root"></div></body>
</html>`

const meta = {
  title: 'Villas for Rent | Luxury & Compound',
  description: 'Find villas in Doha & Qatar.',
  canonical: 'https://dania-realestate.com/villas-for-rent/',
  imageUrl: 'https://dania-realestate.com/villas.webp',
  jsonLd: [{ '@type': 'RealEstateAgent', name: 'Dania' }],
}

describe('prerender injectMeta (F-004)', () => {
  const out = injectMeta(TEMPLATE, meta)

  it('replaces the title (exactly one, HTML-escaped)', () => {
    expect(out).toContain('<title>Villas for Rent | Luxury &amp; Compound</title>')
    expect(out.match(/<title>/g)!.length).toBe(1)
  })

  it('replaces description and canonical for the route', () => {
    expect(out).toContain('content="Find villas in Doha &amp; Qatar."')
    expect(out).toContain('href="https://dania-realestate.com/villas-for-rent/"')
    expect(out).not.toContain('home default desc')
  })

  it('adds Open Graph + Twitter cards and JSON-LD', () => {
    expect(out).toContain('<meta property="og:title" content="Villas for Rent | Luxury &amp; Compound"')
    expect(out).toContain('<meta property="og:image" content="https://dania-realestate.com/villas.webp"')
    expect(out).toContain('<meta name="twitter:card" content="summary_large_image"')
    expect(out).toContain('application/ld+json')
    expect(out).toContain('RealEstateAgent')
  })

  it('keeps the head well-formed (tags before </head>)', () => {
    expect(out.indexOf('og:title')).toBeLessThan(out.indexOf('</head>'))
    expect(out).toContain('<div id="root"></div>')
  })
})
