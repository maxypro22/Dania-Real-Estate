import { useMemo, useState } from 'react'
import { useCms } from '@/cms/cms-context'
import { baseI18n } from '@/cms/apply'
import type { I18nTree } from '@/cms/types'
import { cloneOverrides, deepGet, deepSet, flattenTree, sectionOf } from './helpers'
import { PanelHeader, Card, TextArea, SaveBar, EmptyState } from './atoms'

interface Row {
  path: string
  baseEn: string
  baseAr: string
}

// All editable text leaves, derived once from the English bundle (Arabic mirrors
// the same key structure).
const ROWS: Row[] = flattenTree(baseI18n.en).map((leaf) => ({
  path: leaf.path,
  baseEn: leaf.value,
  baseAr: deepGet(baseI18n.ar, leaf.path) ?? '',
}))

const SECTIONS = [...new Set(ROWS.map((r) => sectionOf(r.path)))]

type Draft = Record<string, { en: string; ar: string }>

function buildDraft(o: { i18n: { en: I18nTree; ar: I18nTree } }): Draft {
  const d: Draft = {}
  for (const r of ROWS) {
    d[r.path] = {
      en: deepGet(o.i18n.en, r.path) ?? r.baseEn,
      ar: deepGet(o.i18n.ar, r.path) ?? r.baseAr,
    }
  }
  return d
}

export function TextPanel() {
  const { overrides, save } = useCms()
  const [draft, setDraft] = useState<Draft>(() => buildDraft(overrides))
  const [section, setSection] = useState(SECTIONS[0])
  const [query, setQuery] = useState('')

  const dirty = ROWS.some(
    (r) => draft[r.path].en !== (deepGet(overrides.i18n.en, r.path) ?? r.baseEn) ||
      draft[r.path].ar !== (deepGet(overrides.i18n.ar, r.path) ?? r.baseAr),
  )

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q) {
      return ROWS.filter(
        (r) => r.path.toLowerCase().includes(q) || r.baseEn.toLowerCase().includes(q) || r.baseAr.includes(query.trim()),
      )
    }
    return ROWS.filter((r) => sectionOf(r.path) === section)
  }, [query, section])

  async function onSave() {
    const next = cloneOverrides(overrides)
    next.i18n = { en: {}, ar: {} }
    for (const r of ROWS) {
      if (draft[r.path].en !== r.baseEn) deepSet(next.i18n.en, r.path, draft[r.path].en)
      if (draft[r.path].ar !== r.baseAr) deepSet(next.i18n.ar, r.path, draft[r.path].ar)
    }
    await save(next)
  }

  function update(path: string, lang: 'en' | 'ar', value: string) {
    setDraft((d) => ({ ...d, [path]: { ...d[path], [lang]: value } }))
  }

  function isChanged(r: Row) {
    return draft[r.path].en !== r.baseEn || draft[r.path].ar !== r.baseAr
  }

  return (
    <div>
      <PanelHeader
        title="Content — all page text (English & Arabic)"
        subtitle="Every heading, subtitle, button label and paragraph that flows through the site's translation system. Edit English and Arabic side by side."
      >
        <input
          placeholder="Search all text…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-64 rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-lime focus:ring-2 focus:ring-lime/30"
        />
      </PanelHeader>

      {!query && (
        <div className="mb-5 flex flex-wrap gap-2">
          {SECTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
                section === s ? 'bg-forest text-white' : 'bg-white border border-black/15 text-ink hover:bg-black/5'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {visible.length === 0 && <EmptyState>No text matches “{query}”.</EmptyState>}
        {visible.map((r) => (
          <Card key={r.path}>
            <div className="mb-2 flex items-center gap-2">
              <code className="rounded bg-black/5 px-2 py-0.5 text-xs text-ink-muted">{r.path}</code>
              {isChanged(r) && <span className="rounded-full bg-lime/20 px-2 py-0.5 text-[11px] font-semibold text-forest">edited</span>}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">English</span>
                <TextArea value={draft[r.path].en} onChange={(e) => update(r.path, 'en', e.target.value)} />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">العربية (Arabic)</span>
                <TextArea rtl value={draft[r.path].ar} onChange={(e) => update(r.path, 'ar', e.target.value)} />
              </label>
            </div>
          </Card>
        ))}
      </div>

      <SaveBar dirty={dirty} onSave={onSave} onReset={() => setDraft(buildDraft(overrides))} />
    </div>
  )
}
