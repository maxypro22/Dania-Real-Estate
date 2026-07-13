// Small, reusable presentational building blocks for the dashboard panels.
// All exports are components (React Fast Refresh friendly).

import { useRef, useState, type ReactNode } from 'react'
import { Check, Loader2, Upload, Undo2 } from 'lucide-react'
import { fileToDataUrl } from './helpers'

export function PanelHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-black/10 pb-5 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">{title}</h1>
        {subtitle && <p className="text-sm text-ink-muted mt-1 max-w-2xl">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

export function Card({ title, children, right }: { title?: string; children: ReactNode; right?: ReactNode }) {
  return (
    <section className="bg-white rounded-2xl border border-black/10 shadow-sm p-5 md:p-6">
      {(title || right) && (
        <div className="flex items-center justify-between gap-3 mb-4">
          {title && <h2 className="font-semibold text-ink">{title}</h2>}
          {right}
        </div>
      )}
      {children}
    </section>
  )
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wide text-ink-muted mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-ink-muted mt-1">{hint}</span>}
    </label>
  )
}

const inputCls =
  'w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-lime focus:ring-2 focus:ring-lime/30'

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement> & { rtl?: boolean }) {
  const { rtl, className, ...rest } = props
  return <input {...rest} dir={rtl ? 'rtl' : undefined} className={`${inputCls} ${rtl ? 'text-right' : ''} ${className ?? ''}`} />
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { rtl?: boolean }) {
  const { rtl, className, ...rest } = props
  return <textarea {...rest} dir={rtl ? 'rtl' : undefined} className={`${inputCls} resize-y min-h-[80px] ${rtl ? 'text-right' : ''} ${className ?? ''}`} />
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2 text-sm font-medium text-ink"
    >
      <span className={`relative h-6 w-11 rounded-full transition ${checked ? 'bg-lime' : 'bg-black/20'}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'left-5' : 'left-0.5'}`} />
      </span>
      {label}
    </button>
  )
}

export function Btn({
  children,
  variant = 'primary',
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' }) {
  const styles = {
    primary: 'bg-forest text-white hover:bg-forest/90',
    ghost: 'bg-transparent text-ink border border-black/15 hover:bg-black/5',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }[variant]
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${styles} ${className ?? ''}`}
    >
      {children}
    </button>
  )
}

/** Sticky save bar with dirty state + async save handling + status feedback. */
export function SaveBar({ dirty, onSave, onReset }: { dirty: boolean; onSave: () => Promise<void>; onReset?: () => void }) {
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [err, setErr] = useState('')

  async function handle() {
    setState('saving')
    setErr('')
    try {
      await onSave()
      setState('saved')
      setTimeout(() => setState('idle'), 1800)
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
      setState('error')
    }
  }

  return (
    <div className="sticky bottom-0 z-10 mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-black/10 bg-white/95 backdrop-blur px-4 py-3 shadow-lg">
      <Btn onClick={handle} disabled={!dirty || state === 'saving'}>
        {state === 'saving' ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
        {state === 'saving' ? 'Saving…' : 'Save & publish'}
      </Btn>
      {onReset && (
        <Btn variant="ghost" onClick={onReset} disabled={!dirty || state === 'saving'}>
          <Undo2 size={15} /> Discard changes
        </Btn>
      )}
      <span className="text-sm">
        {state === 'saved' && <span className="text-green-700 font-medium">✓ Saved — live on the site now.</span>}
        {state === 'error' && <span className="text-red-600 font-medium">{err}</span>}
        {state === 'idle' && dirty && <span className="text-ink-muted">You have unsaved changes.</span>}
        {state === 'idle' && !dirty && <span className="text-ink-muted">All changes saved.</span>}
      </span>
    </div>
  )
}

/** Image chooser: shows a preview, accepts a URL or an uploaded file. */
export function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    try {
      onChange(await fileToDataUrl(file))
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <Field label={label} hint="Paste an image URL, or upload a file (stored locally).">
      <div className="flex gap-3">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-black/10 bg-black/5">
          {value ? <img src={value} alt="" width={64} height={64} className="h-full w-full object-cover" /> : null}
        </div>
        <div className="flex-1 space-y-2">
          <TextInput value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://… or /image.webp" />
          <div>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
            <Btn variant="ghost" type="button" onClick={() => fileRef.current?.click()} disabled={busy}>
              {busy ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />} Upload
            </Btn>
          </div>
        </div>
      </div>
    </Field>
  )
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-black/15 p-10 text-center text-sm text-ink-muted">{children}</div>
}
