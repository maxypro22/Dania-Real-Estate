import type { ReactNode } from 'react'

/**
 * Renders inline content in a forced left-to-right, bidi-isolated box.
 *
 * Latin phone numbers, WhatsApp numbers and emails are direction-neutral, so in
 * an Arabic (RTL) context the browser's bidi algorithm reorders them — e.g.
 * "+974 3326 0393" renders with the "+" on the wrong side or the groups
 * reversed. Wrapping the value here keeps it in the same correct order as the
 * English site, regardless of the surrounding text direction.
 */
export function Ltr({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span dir="ltr" style={{ unicodeBidi: 'isolate' }} className={className}>
      {children}
    </span>
  )
}
