import { useMemo, useState } from 'react'
import { useCms } from '@/cms/cms-context'
import { SEO, AREA_SEO } from '@/lib/seo'
import { cloneOverrides } from './helpers'
import { PanelHeader, Card, Field, TextInput, TextArea, SaveBar } from './atoms'

interface RouteSeo {
  path: string
  title: string
  description: string
}

const ROUTES: RouteSeo[] = [
  ...Object.entries(SEO).map(([path, e]) => ({ path, title: e.title, description: e.description })),
  ...Object.entries(AREA_SEO).map(([slug, e]) => ({ path: `/areas/${slug}/`, title: e.title, description: e.description })),
]

type Draft = Record<string, { title: string; description: string }>

function buildDraft(seo: Record<string, { title?: string; description?: string }>): Draft {
  const d: Draft = {}
  for (const r of ROUTES) {
    d[r.path] = {
      title: seo[r.path]?.title ?? r.title,
      description: seo[r.path]?.description ?? r.description,
    }
  }
  return d
}

export function SeoPanel() {
  const { overrides, save } = useCms()
  const [draft, setDraft] = useState<Draft>(() => buildDraft(overrides.seo))
  const [query, setQuery] = useState('')

  const dirty = ROUTES.some(
    (r) => draft[r.path].title !== (overrides.seo[r.path]?.title ?? r.title) ||
      draft[r.path].description !== (overrides.seo[r.path]?.description ?? r.description),
  )

  const filtered = useMemo(
    () => ROUTES.filter((r) => r.path.toLowerCase().includes(query.toLowerCase()) || r.title.toLowerCase().includes(query.toLowerCase())),
    [query],
  )

  async function onSave() {
    const next = cloneOverrides(overrides)
    next.seo = {}
    for (const r of ROUTES) {
      const entry: { title?: string; description?: string } = {}
      if (draft[r.path].title !== r.title) entry.title = draft[r.path].title
      if (draft[r.path].description !== r.description) entry.description = draft[r.path].description
      if (entry.title || entry.description) next.seo[r.path] = entry
    }
    await save(next)
  }

  function update(path: string, key: 'title' | 'description', value: string) {
    setDraft((d) => ({ ...d, [path]: { ...d[path], [key]: value } }))
  }

  return (
    <div>
      <PanelHeader
        title="SEO — titles & meta descriptions"
        subtitle="Search-engine title and description for every page. Changes show live in the browser tab and social previews. (These override the built-in copy; the static crawler HTML updates when you rebuild.)"
      >
        <TextInput placeholder="Filter pages…" value={query} onChange={(e) => setQuery(e.target.value)} className="w-56" />
      </PanelHeader>

      <div className="space-y-4">
        {filtered.map((r) => (
          <Card key={r.path} title={r.path}>
            <div className="grid gap-4">
              <Field label="SEO title" hint={`${draft[r.path].title.length} characters (aim for 50–60)`}>
                <TextInput value={draft[r.path].title} onChange={(e) => update(r.path, 'title', e.target.value)} />
              </Field>
              <Field label="Meta description" hint={`${draft[r.path].description.length} characters (aim for 150–160)`}>
                <TextArea value={draft[r.path].description} onChange={(e) => update(r.path, 'description', e.target.value)} />
              </Field>
            </div>
          </Card>
        ))}
      </div>

      <SaveBar dirty={dirty} onSave={onSave} onReset={() => setDraft(buildDraft(overrides.seo))} />
    </div>
  )
}
