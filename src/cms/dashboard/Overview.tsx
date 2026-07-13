import { useRef, useState } from 'react'
import {
  Download, Upload, RotateCcw, Type, Search, Phone, Image as ImageIcon, Mail,
  KeyRound, UserPlus, Trash2, Users,
} from 'lucide-react'
import { useCms } from '@/cms/cms-context'
import { emptyOverrides } from '@/cms/types'
import {
  listAdmins, addAdmin, removeAdmin, changePassword, currentEmail, isOwner,
} from '@/cms/auth'
import { flattenTree } from './helpers'
import { PanelHeader, Card, Field, TextInput, Btn } from './atoms'

export function Overview({ onNavigate }: { onNavigate: (key: string) => void }) {
  const { overrides, messages, save } = useCms()
  const fileRef = useRef<HTMLInputElement>(null)

  const stats = [
    { key: 'text', icon: <Type size={18} />, label: 'Text edits', value: flattenTree(overrides.i18n.en).length + flattenTree(overrides.i18n.ar).length },
    { key: 'seo', icon: <Search size={18} />, label: 'SEO overrides', value: Object.keys(overrides.seo).length },
    { key: 'contact', icon: <Phone size={18} />, label: 'Contact fields', value: Object.keys(overrides.company).length },
    { key: 'images', icon: <ImageIcon size={18} />, label: 'Image changes', value: Object.keys(overrides.images).length + (overrides.showcases ? 1 : 0) },
    { key: 'messages', icon: <Mail size={18} />, label: 'Unread messages', value: messages.filter((m) => !m.read).length },
  ]

  function exportJson() {
    const blob = new Blob([JSON.stringify(overrides, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'dania-cms-content.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function importJson(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const parsed = JSON.parse(await file.text()) as Partial<ReturnType<typeof emptyOverrides>>
      await save({ ...emptyOverrides(), ...parsed })
    } catch {
      alert('That file is not a valid content export.')
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div>
      <PanelHeader title="Dashboard" subtitle="Welcome back. Edit any part of the site from the menu — changes go live instantly." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <button
            key={s.key}
            onClick={() => onNavigate(s.key)}
            className="flex items-center gap-4 rounded-2xl border border-black/10 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime/20 text-forest">{s.icon}</span>
            <span>
              <span className="block text-2xl font-bold text-ink">{s.value}</span>
              <span className="block text-sm text-ink-muted">{s.label}</span>
            </span>
          </button>
        ))}
      </div>

      <AdminSection />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card title="Backup & migrate">
          <p className="mb-4 text-sm text-ink-muted">
            Export all your content as a JSON file — useful as a backup and to seed your Supabase database later. Import restores from an export.
          </p>
          <div className="flex flex-wrap gap-3">
            <Btn variant="ghost" onClick={exportJson}><Download size={15} /> Export content</Btn>
            <input ref={fileRef} type="file" accept="application/json" hidden onChange={importJson} />
            <Btn variant="ghost" onClick={() => fileRef.current?.click()}><Upload size={15} /> Import content</Btn>
          </div>
        </Card>

        <Card title="Reset">
          <p className="mb-4 text-sm text-ink-muted">Revert every edit and restore the site's original content. Messages and admin accounts are not affected.</p>
          <Btn
            variant="danger"
            onClick={() => {
              if (confirm('Reset ALL content back to the original defaults? This cannot be undone.')) {
                void save({ ...emptyOverrides() })
              }
            }}
          >
            <RotateCcw size={15} /> Reset all content
          </Btn>
        </Card>
      </div>
    </div>
  )
}

/** Change-password + admin management. Kept in this file (main dashboard). */
function AdminSection() {
  const owner = isOwner()
  const [admins, setAdmins] = useState(() => listAdmins())

  // Change password
  const [curPw, setCurPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null)

  // Add admin
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [addMsg, setAddMsg] = useState<{ ok: boolean; text: string } | null>(null)

  function submitPassword(e: React.FormEvent) {
    e.preventDefault()
    const err = changePassword(curPw, newPw)
    if (err) setPwMsg({ ok: false, text: err })
    else {
      setPwMsg({ ok: true, text: 'Password updated.' })
      setCurPw('')
      setNewPw('')
    }
  }

  function submitAdmin(e: React.FormEvent) {
    e.preventDefault()
    const err = addAdmin(email, pw)
    if (err) setAddMsg({ ok: false, text: err })
    else {
      setAddMsg({ ok: true, text: `Added ${email.trim()}.` })
      setEmail('')
      setPw('')
      setAdmins(listAdmins())
    }
  }

  function remove(target: string) {
    const err = removeAdmin(target)
    if (err) alert(err)
    else setAdmins(listAdmins())
  }

  const me = currentEmail().toLowerCase()

  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      <Card title="Change your password">
        <form onSubmit={submitPassword} className="grid gap-4">
          <Field label="Current password">
            <TextInput type="password" value={curPw} onChange={(e) => setCurPw(e.target.value)} autoComplete="current-password" />
          </Field>
          <Field label="New password" hint="At least 6 characters.">
            <TextInput type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} autoComplete="new-password" />
          </Field>
          <div className="flex items-center gap-3">
            <Btn type="submit"><KeyRound size={15} /> Update password</Btn>
            {pwMsg && <span className={`text-sm font-medium ${pwMsg.ok ? 'text-green-700' : 'text-red-600'}`}>{pwMsg.text}</span>}
          </div>
        </form>
      </Card>

      <Card title="Admins">
        <div className="mb-4 space-y-2">
          {admins.map((a) => {
            const isMe = a.email.toLowerCase() === me
            return (
              <div key={a.email} className="flex items-center justify-between gap-2 rounded-xl bg-black/5 px-3 py-2 text-sm">
                <span className="flex items-center gap-2 truncate">
                  <Users size={15} className="text-ink-muted" />
                  <span className="truncate">{a.email}</span>
                  {a.owner && <span className="rounded-full bg-forest/10 px-2 py-0.5 text-[11px] font-semibold text-forest">main</span>}
                  {isMe && <span className="text-xs text-ink-muted">(you)</span>}
                </span>
                {/* Only the owner can remove, and the main account is never removable. */}
                {owner && !a.owner && !isMe && (
                  <button onClick={() => remove(a.email)} className="text-red-600 hover:text-red-700" title="Remove admin"><Trash2 size={16} /></button>
                )}
              </div>
            )
          })}
        </div>

        {owner ? (
          <form onSubmit={submitAdmin} className="grid gap-3 border-t border-black/10 pt-4">
            <p className="text-sm font-semibold text-ink">Add a new admin</p>
            <Field label="Email">
              <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" autoComplete="off" />
            </Field>
            <Field label="Password" hint="At least 6 characters.">
              <TextInput type="text" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="off" />
            </Field>
            <div className="flex items-center gap-3">
              <Btn type="submit" variant="ghost"><UserPlus size={15} /> Add admin</Btn>
              {addMsg && <span className={`text-sm font-medium ${addMsg.ok ? 'text-green-700' : 'text-red-600'}`}>{addMsg.text}</span>}
            </div>
          </form>
        ) : (
          <p className="border-t border-black/10 pt-4 text-sm text-ink-muted">
            Only the main admin can add or remove admins. You can still change your own password on the left.
          </p>
        )}
      </Card>
    </div>
  )
}
