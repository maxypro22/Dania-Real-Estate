import { useState } from 'react'
import { Lock, LogIn } from 'lucide-react'
import { signIn } from '@/cms/auth'
import { Btn } from './atoms'

export function Login({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (signIn(email, password)) {
      setError('')
      onSuccess()
    } else {
      setError('Incorrect email or password.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-forest px-6">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-lime text-forest">
            <Lock size={22} />
          </span>
          <h1 className="text-xl font-bold text-ink">Dania CMS</h1>
          <p className="text-sm text-ink-muted">Sign in to manage your website content.</p>
        </div>

        <label className="mb-3 block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">Email</span>
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-black/15 px-3.5 py-2.5 text-sm outline-none focus:border-lime focus:ring-2 focus:ring-lime/30"
            placeholder="you@example.com"
            required
          />
        </label>
        <label className="mb-4 block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-black/15 px-3.5 py-2.5 text-sm outline-none focus:border-lime focus:ring-2 focus:ring-lime/30"
            placeholder="••••••••"
            required
          />
        </label>

        {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <Btn type="submit" className="w-full"><LogIn size={16} /> Sign in</Btn>
      </form>
    </div>
  )
}
