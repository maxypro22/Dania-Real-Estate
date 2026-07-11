import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

// Regression guard for F-003 (CLS): every <img> in the app must declare
// intrinsic width + height so the browser reserves layout space before load.
function walkTsx(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) return walkTsx(p)
    return p.endsWith('.tsx') ? [p] : []
  })
}

const tags = walkTsx(join(process.cwd(), 'src')).flatMap((file) => {
  const src = readFileSync(file, 'utf8')
  return (src.match(/<img\b[\s\S]*?\/>/g) ?? []).map((tag) => ({ file, tag }))
})

describe('every <img> declares width and height', () => {
  it('scans a non-trivial number of img tags', () => {
    expect(tags.length).toBeGreaterThan(20)
  })

  it('has no <img> missing width or height', () => {
    const offenders = tags
      .filter(({ tag }) => !/\bwidth=/.test(tag) || !/\bheight=/.test(tag))
      .map(({ file }) => file.replace(process.cwd(), ''))
    expect(offenders).toEqual([])
  })
})
