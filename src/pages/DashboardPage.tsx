import { useState } from 'react'
import {
  LayoutDashboard, Type, Search, Phone,
  Image as ImageIcon, Mail, LogOut, ExternalLink, Menu, X,
} from 'lucide-react'
import { useCms } from '@/cms/cms-context'
import { isAuthed, signOut, currentEmail } from '@/cms/auth'
import { Login } from '@/cms/dashboard/Login'
import { Overview } from '@/cms/dashboard/Overview'
import { SeoPanel } from '@/cms/dashboard/SeoPanel'
import { TextPanel } from '@/cms/dashboard/TextPanel'
import { ContactPanel } from '@/cms/dashboard/ContactPanel'
import { ImagesPanel } from '@/cms/dashboard/ImagesPanel'
import { MessagesPanel } from '@/cms/dashboard/MessagesPanel'

const NAV = [
  { key: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'text', label: 'Content (text)', icon: Type },
  { key: 'seo', label: 'SEO', icon: Search },
  { key: 'contact', label: 'Contact details', icon: Phone },
  { key: 'images', label: 'Images', icon: ImageIcon },
  { key: 'messages', label: 'Messages', icon: Mail },
] as const

function MessagesNavBadge() {
  const { messages } = useCms()
  const unread = messages.filter((m) => !m.read).length
  if (!unread) return null
  return <span className="ml-auto rounded-full bg-lime px-2 py-0.5 text-xs font-bold text-forest">{unread}</span>
}

function DashboardInner({ onSignOut }: { onSignOut: () => void }) {
  const [active, setActive] = useState<string>('overview')
  const [menuOpen, setMenuOpen] = useState(false)

  function go(key: string) {
    setActive(key)
    setMenuOpen(false)
  }

  return (
    <div className="flex min-h-screen bg-surface-low text-ink">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 shrink-0 flex-col bg-forest text-white transition-transform lg:static lg:flex lg:translate-x-0 ${
          menuOpen ? 'flex translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div>
            <p className="text-lg font-bold">Dania CMS</p>
            <p className="text-xs text-white/50">Content manager</p>
          </div>
          <button className="lg:hidden text-white/70" onClick={() => setMenuOpen(false)}><X size={20} /></button>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((item) => {
            const Icon = item.icon
            const on = active === item.key
            return (
              <button
                key={item.key}
                onClick={() => go(item.key)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  on ? 'bg-lime text-forest' : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <Icon size={18} />
                {item.label}
                {item.key === 'messages' && <MessagesNavBadge />}
              </button>
            )
          })}
        </nav>
        <div className="space-y-1 border-t border-white/10 p-3">
          <p className="px-3 pb-1 text-xs text-white/40 truncate">Signed in as {currentEmail()}</p>
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10">
            <ExternalLink size={18} /> View website
          </a>
          <button onClick={onSignOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10">
            <LogOut size={18} /> Sign out
          </button>
        </div>
      </aside>

      {menuOpen && <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setMenuOpen(false)} />}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-black/10 bg-white px-5 py-3 lg:hidden">
          <button onClick={() => setMenuOpen(true)}><Menu size={22} /></button>
          <span className="font-bold">Dania CMS</span>
        </header>
        <main className="min-w-0 flex-1 p-5 md:p-8">
          <div className="mx-auto max-w-4xl">
            {active === 'overview' && <Overview onNavigate={go} />}
            {active === 'text' && <TextPanel />}
            {active === 'seo' && <SeoPanel />}
            {active === 'contact' && <ContactPanel />}
            {active === 'images' && <ImagesPanel />}
            {active === 'messages' && <MessagesPanel />}
          </div>
        </main>
      </div>
    </div>
  )
}

export function DashboardPage() {
  const [authed, setAuthed] = useState(isAuthed())

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />

  return (
    <DashboardInner
      onSignOut={() => {
        signOut()
        setAuthed(false)
      }}
    />
  )
}
