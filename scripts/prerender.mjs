// Build-time prerender of per-route <head> metadata (F-004).
//
// The app is a client-only SPA, so social scrapers (WhatsApp/Facebook/LinkedIn)
// and other non-JS crawlers see only the home shell for every URL. This script
// runs after `vite build` and writes a per-route dist/<path>/index.html whose
// <head> carries that route's title, description, canonical, Open Graph/Twitter
// cards, and Organization JSON-LD — baked into static HTML.
//
// Vercel checks the filesystem before applying the catch-all rewrite, so
// dist/villas-for-rent/index.html is served directly for /villas-for-rent/;
// unknown paths still fall through to the SPA shell.
//
// Route copy comes from the real src/lib/seo.ts (single source of truth) via an
// in-memory esbuild bundle, so the baked meta always matches the client.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// JSON-LD: neutralize any "</script>" in the data.
function jsonLdScript(obj) {
  const json = JSON.stringify(obj).replace(/</g, '\\u003c')
  return `<script type="application/ld+json">${json}</script>`
}

/**
 * Pure: return `template` with its <head> metadata replaced/augmented for one
 * route. Exported for unit testing.
 */
export function injectMeta(template, meta) {
  const { title, description, canonical, imageUrl, jsonLd = [] } = meta
  let html = template

  // Replace the existing title / description / canonical (home defaults in the shell).
  // Every replacement is passed as a FUNCTION, never a string: in String.replace a
  // replacement string treats `$$`, `$&`, `` $` `` and `$'` as escapes, which would
  // silently corrupt content containing them (e.g. priceRange "$$" in the JSON-LD).
  html = html.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escapeAttr(title)}</title>`)
  html = html.replace(
    /<meta\s+name="description"[\s\S]*?\/>/,
    () => `<meta name="description" content="${escapeAttr(description)}" />`,
  )
  html = html.replace(
    /<link\s+rel="canonical"[^>]*>/,
    () => `<link rel="canonical" href="${escapeAttr(canonical)}" />`,
  )

  const tags = [
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeAttr(title)}" />`,
    `<meta property="og:description" content="${escapeAttr(description)}" />`,
    `<meta property="og:url" content="${escapeAttr(canonical)}" />`,
    `<meta property="og:image" content="${escapeAttr(imageUrl)}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(description)}" />`,
    `<meta name="twitter:image" content="${escapeAttr(imageUrl)}" />`,
    ...jsonLd.map(jsonLdScript),
  ].join('\n    ')

  return html.replace('</head>', () => `    ${tags}\n  </head>`)
}

async function loadSeoModule() {
  // Lazy so importing this module for unit tests (injectMeta) never loads esbuild.
  const { build } = await import('esbuild')
  const result = await build({
    entryPoints: [join(ROOT, 'src/lib/seo.ts')],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'node',
    alias: { '@': join(ROOT, 'src') },
    logLevel: 'silent',
  })
  const code = result.outputFiles[0].text
  return import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'))
}

async function main() {
  const dist = join(ROOT, 'dist')
  const template = readFileSync(join(dist, 'index.html'), 'utf8')
  const seo = await loadSeoModule()
  const { SEO, AREA_SEO, SITE_ORIGIN, organizationSchema } = seo

  const routes = [
    ...Object.keys(SEO),
    ...Object.keys(AREA_SEO).map((slug) => `/areas/${slug}/`),
  ]

  let count = 0
  for (const path of routes) {
    const entry = SEO[path] ?? AREA_SEO[path.replace(/^\/areas\/([^/]+)\/$/, '$1')]
    if (!entry) continue
    const imageUrl = SITE_ORIGIN + (entry.image ?? '/Dania_Real_Estate_logo.png')
    const html = injectMeta(template, {
      title: entry.title,
      description: entry.description,
      canonical: SITE_ORIGIN + path,
      imageUrl,
      jsonLd: organizationSchema(),
    })
    const outDir = path === '/' ? dist : join(dist, path)
    mkdirSync(outDir, { recursive: true })
    writeFileSync(join(outDir, 'index.html'), html)
    count++
  }
  console.log(`prerender: wrote ${count} route HTML files with baked metadata`)
}

// Run only when invoked directly (not when imported by tests).
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error('prerender failed:', err)
    process.exit(1)
  })
}
