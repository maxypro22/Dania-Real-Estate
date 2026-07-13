import { useEffect } from 'react'
import { Mail, MailOpen, Phone, Trash2, RefreshCw } from 'lucide-react'
import { useCms } from '@/cms/cms-context'
import { PanelHeader, Card, Btn, EmptyState } from './atoms'

function formatDate(ms: number): string {
  try {
    return new Date(ms).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return ''
  }
}

export function MessagesPanel() {
  const { messages, markRead, deleteMessage, refreshMessages } = useCms()
  const unread = messages.filter((m) => !m.read).length

  useEffect(() => {
    void refreshMessages()
  }, [refreshMessages])

  return (
    <div>
      <PanelHeader
        title="Messages"
        subtitle="Enquiries submitted through the contact form. (Stored in the local database for now; on Supabase these will arrive from every visitor.)"
      >
        <div className="flex items-center gap-3">
          {unread > 0 && <span className="rounded-full bg-lime px-3 py-1 text-sm font-semibold text-forest">{unread} unread</span>}
          <Btn variant="ghost" onClick={() => refreshMessages()}><RefreshCw size={15} /> Refresh</Btn>
        </div>
      </PanelHeader>

      {messages.length === 0 ? (
        <EmptyState>No messages yet. Submissions from the contact form will appear here.</EmptyState>
      ) : (
        <div className="grid gap-4">
          {messages.map((m) => (
            <Card key={m.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  {m.read ? <MailOpen size={18} className="text-ink-muted" /> : <Mail size={18} className="text-forest" />}
                  <div>
                    <p className="font-semibold text-ink">{m.name || 'Anonymous'} {!m.read && <span className="ml-1 rounded-full bg-lime/25 px-2 py-0.5 text-[11px] font-semibold text-forest">new</span>}</p>
                    <p className="text-xs text-ink-muted">{formatDate(m.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!m.read && <Btn variant="ghost" onClick={() => markRead(m.id)}><MailOpen size={14} /> Mark read</Btn>}
                  <button onClick={() => deleteMessage(m.id)} className="text-red-600 hover:text-red-700" title="Delete"><Trash2 size={17} /></button>
                </div>
              </div>

              <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                <p><span className="text-ink-muted">Phone:</span> <a href={`tel:${m.phone}`} className="text-forest hover:underline">{m.phone || '—'}</a></p>
                <p><span className="text-ink-muted">Email:</span> <a href={`mailto:${m.email}`} className="text-forest hover:underline">{m.email || '—'}</a></p>
                <p><span className="text-ink-muted">Property type:</span> {m.type || '—'}</p>
                <p><span className="text-ink-muted">Preferred area:</span> {m.area || '—'}</p>
              </div>
              {m.message && <p className="mt-3 rounded-xl bg-black/5 p-3 text-sm text-ink whitespace-pre-line">{m.message}</p>}
              {m.phone && (
                <div className="mt-3">
                  <a
                    href={`https://wa.me/${m.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:underline"
                  >
                    <Phone size={14} /> Reply on WhatsApp
                  </a>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
