import { useRef, useState } from 'react'
import { Upload, RotateCcw, Loader2 } from 'lucide-react'
import { useCms } from '@/cms/cms-context'
import { baseShowcases } from '@/cms/apply'
import type { Showcase } from '@/cms/types'
import { cloneOverrides, fileToDataUrl } from './helpers'
import { PanelHeader, Card, TextInput } from './atoms'

// ── Which images appear on which page ────────────────────────────────────────
// Almost every site image is a /public/*.webp referenced by path, so we can map
// each page to its images by hand. The Home page is special: its four featured
// cards are edited as structured data (overrides.showcases).

interface PageDef {
  key: string
  label: string
  kind: 'showcases' | 'paths'
  images?: { path: string; label: string }[]
}

const PAGES: PageDef[] = [
  { key: 'home', label: 'Home', kind: 'showcases' },
  {
    key: 'about',
    label: 'About Company',
    kind: 'paths',
    images: [{ path: '/about-dania-real-estate-qatar.webp', label: 'About hero' }],
  },
  {
    key: 'apartments',
    label: 'Apartments',
    kind: 'paths',
    images: [
      { path: '/apartments-for-rent-doha-qatar-dania-real-estate.webp', label: 'Apartments hero' },
      { path: '/1-bedroom-apartments-for-rent-doha-qatar.webp', label: '1 Bedroom section' },
      { path: '/2-bedroom-apartments-for-rent-doha-qatar.webp', label: '2 Bedroom section' },
      { path: '/3-bedroom-apartments-for-rent-doha-qatar.webp', label: '3 Bedroom section' },
    ],
  },
  {
    key: 'villas',
    label: 'Villas',
    kind: 'paths',
    images: [
      { path: '/villas-for-rent-doha-qatar-dania-real-estate.webp', label: 'Villas hero' },
      { path: '/standard-villas-for-rent-doha-qatar.webp', label: 'Standard villas' },
      { path: '/compound-villas-for-rent-doha-qatar.webp', label: 'Compound villas' },
    ],
  },
  {
    key: 'staff',
    label: 'Staff Accommodation',
    kind: 'paths',
    images: [
      { path: '/staff-accommodation-doha-qatar-dania-real-estate.webp', label: 'Staff accommodation hero' },
      { path: '/staff-villas-for-rent-doha-qatar.webp', label: 'Staff villas' },
    ],
  },
  {
    key: 'shops',
    label: 'Shops',
    kind: 'paths',
    images: [{ path: '/shops-for-rent-doha-qatar-dania-real-estate.webp', label: 'Shops hero' }],
  },
  {
    key: 'studios',
    label: 'Studios & Partition Rentals',
    kind: 'paths',
    images: [
      { path: '/studio-and-partition-rentals-doha-qatar.webp', label: 'Studios hero' },
      { path: '/studio-for-rent-doha-qatar.webp', label: 'Studio' },
      { path: '/partition-room-for-rent-doha-qatar.webp', label: 'Partition room' },
      { path: '/one-bedroom-for-rent-doha-qatar.webp', label: 'One bedroom' },
    ],
  },
  {
    key: 'areas',
    label: 'Areas',
    kind: 'paths',
    images: [
      { path: '/modern-residential-developments-qatar.webp', label: 'Areas / Doha hero' },
      { path: '/apartments-for-rent-doha-qatar-dania-real-estate.webp', label: 'Al Sadd hero' },
      { path: '/2-bedroom-apartments-for-rent-doha-qatar.webp', label: 'Bin Mahmoud hero' },
      { path: '/villas-for-rent-doha-qatar-dania-real-estate.webp', label: 'Al Wakra / Al Waab hero' },
      { path: '/compound-villas-for-rent-doha-qatar.webp', label: 'Al Aziziya / Kharaitiyat hero' },
      { path: '/staff-accommodation-doha-qatar-dania-real-estate.webp', label: 'Old Airport hero' },
      { path: '/standard-villas-for-rent-doha-qatar.webp', label: 'Umm Salal hero' },
    ],
  },
  {
    key: 'faq',
    label: 'FAQ',
    kind: 'paths',
    images: [{ path: '/why-choose-dania-real-estate-qatar.webp', label: 'FAQ hero' }],
  },
]

/**
 * One image row: shows the current image, lets you type a URL (committed on
 * blur), upload a file, or revert to the original.
 */
function ImageRow({
  label,
  thumbSrc,
  value,
  overridden,
  onType,
  onCommit,
  onRevert,
}: {
  label: string
  thumbSrc: string
  value: string
  overridden: boolean
  onType: (v: string) => void
  onCommit: (v: string) => void
  onRevert: () => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  // A data: URL (uploaded file) is huge — don't dump it into the text box.
  const isUpload = value.startsWith('data:')
  const inputValue = isUpload ? '' : value
  const placeholder = isUpload
    ? 'Uploaded image in use — paste a URL or upload again to replace'
    : 'Using original — paste an image URL or upload to change'

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    try {
      onCommit(await fileToDataUrl(file))
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="h-24 w-32 shrink-0 overflow-hidden rounded-xl border border-black/10 bg-black/5">
        {thumbSrc ? <img src={thumbSrc} alt="" width={128} height={96} className="h-full w-full object-cover" /> : null}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-sm font-semibold text-ink">{label}</span>
          {overridden && <span className="rounded-full bg-lime/20 px-2 py-0.5 text-[11px] font-semibold text-forest">changed</span>}
        </div>
        <TextInput
          value={inputValue}
          onChange={(e) => onType(e.target.value)}
          onBlur={(e) => onCommit(e.target.value)}
          placeholder={placeholder}
        />
        <div className="mt-2 flex items-center gap-2">
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-full border border-black/15 px-3 py-1.5 text-xs font-semibold text-ink hover:bg-black/5 disabled:opacity-50"
          >
            {busy ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />} Upload
          </button>
          {overridden && (
            <button
              type="button"
              onClick={onRevert}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/15 px-3 py-1.5 text-xs font-semibold text-ink hover:bg-black/5"
            >
              <RotateCcw size={13} /> Revert
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function ImagesPanel() {
  const { overrides, save } = useCms()
  const [active, setActive] = useState('home')
  // Local drafts for both override kinds.
  const [imageMap, setImageMap] = useState<Record<string, string>>(() => ({ ...overrides.images }))
  const [cards, setCards] = useState<Showcase[]>(() => overrides.showcases ?? baseShowcases)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [err, setErr] = useState('')

  const page = PAGES.find((p) => p.key === active)!

  async function persist(nextMap: Record<string, string>, nextCards: Showcase[]) {
    setStatus('saving')
    setErr('')
    try {
      const next = cloneOverrides(overrides)
      next.images = Object.fromEntries(Object.entries(nextMap).filter(([, v]) => v.trim() !== ''))
      next.showcases = JSON.stringify(nextCards) === JSON.stringify(baseShowcases) ? undefined : nextCards
      await save(next)
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 1600)
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
      setStatus('error')
    }
  }

  // ── Path images (hero/section webp) ────────────────────────────────────────
  function typePath(path: string, value: string) {
    setImageMap((m) => ({ ...m, [path]: value }))
  }
  function commitPath(path: string, value: string) {
    const nextMap = { ...imageMap, [path]: value }
    setImageMap(nextMap)
    void persist(nextMap, cards)
  }
  function revertPath(path: string) {
    const nextMap = { ...imageMap }
    delete nextMap[path]
    setImageMap(nextMap)
    void persist(nextMap, cards)
  }

  // ── Home showcase images ───────────────────────────────────────────────────
  function typeCard(i: number, value: string) {
    setCards((c) => c.map((card, idx) => (idx === i ? { ...card, image: value } : card)))
  }
  function commitCard(i: number, value: string) {
    const nextCards = cards.map((card, idx) => (idx === i ? { ...card, image: value } : card))
    setCards(nextCards)
    void persist(imageMap, nextCards)
  }
  function revertCard(i: number) {
    commitCard(i, baseShowcases[i]?.image ?? '')
  }

  return (
    <div>
      <PanelHeader
        title="Images"
        subtitle="Pick a page on the left to see its images, then paste a new URL or upload a file. Changes save and go live instantly."
      >
        <span className="text-sm">
          {status === 'saving' && <span className="text-ink-muted">Saving…</span>}
          {status === 'saved' && <span className="font-medium text-green-700">✓ Saved</span>}
          {status === 'error' && <span className="font-medium text-red-600">{err}</span>}
        </span>
      </PanelHeader>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Page list */}
        <nav className="flex flex-row flex-wrap gap-2 lg:flex-col">
          {PAGES.map((p) => (
            <button
              key={p.key}
              onClick={() => setActive(p.key)}
              className={`rounded-xl px-4 py-2.5 text-left text-sm font-medium transition ${
                active === p.key ? 'bg-forest text-white' : 'bg-white border border-black/10 text-ink hover:bg-black/5'
              }`}
            >
              {p.label}
            </button>
          ))}
        </nav>

        {/* Images for the selected page */}
        <div>
          <Card title={`${page.label} — images`}>
            <div className="space-y-6">
              {page.kind === 'showcases'
                ? cards.map((card, i) => (
                    <ImageRow
                      key={i}
                      label={card.titleEn || `Featured card ${i + 1}`}
                      thumbSrc={card.image}
                      value={card.image}
                      overridden={card.image !== (baseShowcases[i]?.image ?? '')}
                      onType={(v) => typeCard(i, v)}
                      onCommit={(v) => commitCard(i, v)}
                      onRevert={() => revertCard(i)}
                    />
                  ))
                : page.images!.map((img) => (
                    <ImageRow
                      key={img.path}
                      label={img.label}
                      thumbSrc={imageMap[img.path] || img.path}
                      value={imageMap[img.path] ?? ''}
                      overridden={Boolean(imageMap[img.path])}
                      onType={(v) => typePath(img.path, v)}
                      onCommit={(v) => commitPath(img.path, v)}
                      onRevert={() => revertPath(img.path)}
                    />
                  ))}
            </div>
          </Card>
          <p className="mt-3 text-xs text-ink-muted">
            Tip: some images are shared across pages (e.g. a villa photo used on both Villas and Areas) — changing it updates it everywhere it appears.
          </p>
        </div>
      </div>
    </div>
  )
}
