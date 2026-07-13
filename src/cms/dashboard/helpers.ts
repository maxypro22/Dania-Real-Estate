// Pure helpers for the dashboard editors: deep get/set on translation trees,
// flattening for the text editor, and immutable clones of the overrides.

import type { CmsOverrides, I18nTree } from '@/cms/types'

/** Deep clone of an overrides object (safe to mutate in a draft). */
export function cloneOverrides(o: CmsOverrides): CmsOverrides {
  return JSON.parse(JSON.stringify(o)) as CmsOverrides
}

/** A flattened leaf of an i18n tree: dotted path + string value. */
export interface Leaf {
  path: string
  value: string
}

/** Flatten a translation tree into dotted-path string leaves (skips arrays). */
export function flattenTree(tree: I18nTree, prefix = ''): Leaf[] {
  const out: Leaf[] = []
  for (const [k, v] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${k}` : k
    if (typeof v === 'string') out.push({ path, value: v })
    else if (v && typeof v === 'object' && !Array.isArray(v)) out.push(...flattenTree(v, path))
    // Arrays (e.g. lists rendered via returnObjects) are intentionally skipped —
    // they are edited as structured data elsewhere, not as free-text leaves.
  }
  return out
}

/** Read a dotted path from a tree, or undefined. */
export function deepGet(tree: I18nTree, path: string): string | undefined {
  const v = path.split('.').reduce<unknown>((acc, k) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[k]
    return undefined
  }, tree)
  return typeof v === 'string' ? v : undefined
}

/** Immutably set a dotted path in a tree to a string value. */
export function deepSet(tree: I18nTree, path: string, value: string): void {
  const keys = path.split('.')
  let node: I18nTree = tree
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i]
    if (typeof node[k] !== 'object' || node[k] === null) node[k] = {}
    node = node[k] as I18nTree
  }
  node[keys[keys.length - 1]] = value
}

/** Human label for a dotted i18n path's top-level section. */
export function sectionOf(path: string): string {
  return path.split('.')[0]
}

/** Read an uploaded File as a data: URL (for image uploads). */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.readAsDataURL(file)
  })
}
