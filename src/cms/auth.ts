// Dashboard auth + admin accounts.
//
// ⚠️ CLIENT-SIDE ONLY — this keeps casual visitors out of the editor, but it is
// NOT real security (accounts live in localStorage in plain text). Fine for the
// local test phase. When you connect Supabase, login moves to Supabase Auth and
// this whole file is replaced — see supabase/README.md and store.supabase.ts.template.

const ADMINS_KEY = 'dania-cms:admins'
const SESSION_KEY = 'dania-cms:session'

// The built-in "owner" account, seeded on first run. The owner can never be
// removed and is the only account allowed to add/remove other admins.
const DEFAULT_ADMIN = { email: 'fivenodes@gmail.com', password: 'fivendes2026@' }

type Role = 'owner' | 'admin'
interface Admin {
  email: string
  password: string
  role: Role
}

function readAdmins(): Admin[] {
  let admins: Admin[] = []
  try {
    const raw = localStorage.getItem(ADMINS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Admin>[]
      if (Array.isArray(parsed)) {
        admins = parsed
          .filter((a): a is { email: string; password: string; role?: Role } => Boolean(a?.email))
          .map((a) => ({ email: a.email, password: a.password ?? '', role: a.role === 'owner' ? 'owner' : 'admin' }))
      }
    }
  } catch {
    /* fall through to seed */
  }

  if (!admins.length) {
    admins = [{ ...DEFAULT_ADMIN, role: 'owner' }]
    writeAdmins(admins)
    return admins
  }

  // Migration/safety: guarantee exactly-or-at-least one owner so the account can
  // never be orphaned (e.g. data written by an older version without roles).
  if (!admins.some((a) => a.role === 'owner')) {
    const seed = admins.find((a) => normEmail(a.email) === normEmail(DEFAULT_ADMIN.email)) ?? admins[0]
    seed.role = 'owner'
    writeAdmins(admins)
  }
  return admins
}

function writeAdmins(admins: Admin[]): void {
  localStorage.setItem(ADMINS_KEY, JSON.stringify(admins))
}

function normEmail(email: string): string {
  return email.trim().toLowerCase()
}

function findByEmail(admins: Admin[], email: string): Admin | undefined {
  return admins.find((a) => normEmail(a.email) === normEmail(email))
}

/** Sign in. On success, records the session and returns true. */
export function signIn(email: string, password: string): boolean {
  const match = findByEmail(readAdmins(), email)
  if (match && match.password === password) {
    sessionStorage.setItem(SESSION_KEY, match.email)
    return true
  }
  return false
}

export function signOut(): void {
  sessionStorage.removeItem(SESSION_KEY)
}

/** True when a session exists AND still maps to a known admin. */
export function isAuthed(): boolean {
  const email = sessionStorage.getItem(SESSION_KEY)
  return Boolean(email) && Boolean(findByEmail(readAdmins(), email!))
}

/** Email of the currently signed-in admin (or ''). */
export function currentEmail(): string {
  return sessionStorage.getItem(SESSION_KEY) ?? ''
}

/** True when the signed-in admin is the owner (the main account). */
export function isOwner(): boolean {
  return findByEmail(readAdmins(), currentEmail())?.role === 'owner'
}

/** All admins as { email, isOwner } (never exposes passwords). */
export function listAdmins(): { email: string; owner: boolean }[] {
  return readAdmins().map((a) => ({ email: a.email, owner: a.role === 'owner' }))
}

/** Add a new admin (owner only). Returns an error message, or null on success. */
export function addAdmin(email: string, password: string): string | null {
  if (!isOwner()) return 'Only the main admin can add new admins.'
  const e = normEmail(email)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return 'Enter a valid email address.'
  if (password.length < 6) return 'Password must be at least 6 characters.'
  const admins = readAdmins()
  if (findByEmail(admins, e)) return 'An admin with that email already exists.'
  admins.push({ email: email.trim(), password, role: 'admin' })
  writeAdmins(admins)
  return null
}

/**
 * Remove an admin by email (owner only). The owner/main account can never be
 * removed, and you cannot remove the account you are signed in with.
 */
export function removeAdmin(email: string): string | null {
  if (!isOwner()) return 'Only the main admin can remove admins.'
  const admins = readAdmins()
  const target = findByEmail(admins, email)
  if (!target) return 'That admin no longer exists.'
  if (target.role === 'owner') return 'The main admin account cannot be removed.'
  if (normEmail(target.email) === normEmail(currentEmail())) return 'You cannot remove the account you are signed in with.'
  writeAdmins(admins.filter((a) => normEmail(a.email) !== normEmail(email)))
  return null
}

/**
 * Change the signed-in admin's password. Verifies the current password first.
 * Returns an error message, or null on success.
 */
export function changePassword(currentPassword: string, newPassword: string): string | null {
  if (newPassword.length < 6) return 'New password must be at least 6 characters.'
  const admins = readAdmins()
  const me = findByEmail(admins, currentEmail())
  if (!me) return 'Session expired — please sign in again.'
  if (me.password !== currentPassword) return 'Your current password is incorrect.'
  me.password = newPassword
  writeAdmins(admins)
  return null
}
