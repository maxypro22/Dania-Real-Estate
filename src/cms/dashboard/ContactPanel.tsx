import { useState } from 'react'
import { useCms } from '@/cms/cms-context'
import { baseCompany } from '@/cms/apply'
import type { CompanyOverride } from '@/cms/types'
import { cloneOverrides } from './helpers'
import { PanelHeader, Card, Field, TextInput, SaveBar } from './atoms'

type Key = keyof CompanyOverride

const FIELDS: { key: Key; label: string; hint?: string; rtl?: boolean }[] = [
  { key: 'name', label: 'Company name' },
  { key: 'nameAr', label: 'Company name (Arabic)', rtl: true },
  { key: 'tagline', label: 'Tagline' },
  { key: 'address', label: 'Office address (English)' },
  { key: 'addressAr', label: 'Office address (Arabic)', rtl: true },
  { key: 'phone', label: 'Phone 1 (display)', hint: 'e.g. +974 3326 0393' },
  { key: 'phone2', label: 'Phone 2 (display)', hint: 'e.g. +974 6662 6794' },
  { key: 'whatsapp', label: 'WhatsApp number (digits only)', hint: 'Used in wa.me links, e.g. 97433260393' },
  { key: 'whatsappDisplay', label: 'WhatsApp (display)' },
  { key: 'officePhone', label: 'Phone 3 / office landline', hint: 'e.g. +974 4444 0085' },
  { key: 'email', label: 'Email' },
  { key: 'hours', label: 'Working hours — Sun–Thu (English)' },
  { key: 'hoursAr', label: 'Working hours — Sun–Thu (Arabic)', rtl: true },
  { key: 'hoursSat', label: 'Working hours — Saturday (English)' },
  { key: 'hoursSatAr', label: 'Working hours — Saturday (Arabic)', rtl: true },
  { key: 'hoursShort', label: 'Header bar hours (English)', hint: 'Compact one-liner for the top bar' },
  { key: 'hoursShortAr', label: 'Header bar hours (Arabic)', rtl: true },
  { key: 'footerHours', label: 'Footer hours line (English)' },
  { key: 'footerHoursAr', label: 'Footer hours line (Arabic)', rtl: true },
  { key: 'facebook', label: 'Facebook URL' },
  { key: 'instagram', label: 'Instagram URL' },
  { key: 'linkedin', label: 'LinkedIn URL' },
  { key: 'founded', label: 'Founded (year)' },
  { key: 'properties', label: 'Stat — properties', hint: 'e.g. 500+' },
  { key: 'clients', label: 'Stat — clients', hint: 'e.g. 2,000+' },
  { key: 'experience', label: 'Stat — years experience', hint: 'e.g. 15+' },
]

function buildDraft(company: CompanyOverride): Record<string, string> {
  const d: Record<string, string> = {}
  for (const f of FIELDS) d[f.key] = company[f.key] ?? (baseCompany as Record<string, string>)[f.key] ?? ''
  return d
}

export function ContactPanel() {
  const { overrides, save } = useCms()
  const [draft, setDraft] = useState(() => buildDraft(overrides.company))

  const dirty = FIELDS.some((f) => draft[f.key] !== (overrides.company[f.key] ?? (baseCompany as Record<string, string>)[f.key] ?? ''))

  async function onSave() {
    const next = cloneOverrides(overrides)
    next.company = {}
    for (const f of FIELDS) {
      const def = (baseCompany as Record<string, string>)[f.key] ?? ''
      if (draft[f.key] !== def) next.company[f.key] = draft[f.key]
    }
    await save(next)
  }

  return (
    <div>
      <PanelHeader
        title="Contact & company details"
        subtitle="Phone, WhatsApp, email, address and social links. These update everywhere on the site instantly — header, footer, contact page, and structured data."
      />
      <Card title="Details">
        <div className="grid gap-4 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <Field key={f.key} label={f.label} hint={f.hint}>
              <TextInput
                rtl={f.rtl}
                value={draft[f.key]}
                onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
              />
            </Field>
          ))}
        </div>
      </Card>
      <SaveBar dirty={dirty} onSave={onSave} onReset={() => setDraft(buildDraft(overrides.company))} />
    </div>
  )
}
