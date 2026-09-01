import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import { PropertiesPage } from '@/pages/PropertiesPage'
import { PropertyDetailPage } from '@/pages/PropertyDetailPage'
import { properties } from '@/data/mockData'

function renderAt(entry: string) {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={[entry]}>
        <Routes>
          <Route path="/properties/" element={<PropertiesPage />} />
          <Route path="/properties/:slug/" element={<PropertyDetailPage />} />
        </Routes>
      </MemoryRouter>
    </I18nextProvider>,
  )
}

describe('PropertiesPage', () => {
  beforeEach(() => { i18n.changeLanguage('en') })

  it('lists every property and says how many are listed', () => {
    renderAt('/properties/')
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent('Properties for rent in Qatar')
    expect(h1).toHaveTextContent(`${properties.length} listed`)
  })

  it('applies the filters carried in the URL', () => {
    renderAt('/properties/?type=villa&beds=4')
    const expected = properties.filter((p) => p.type === 'villa' && p.bedrooms === 4)
    expect(expected.length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(`${expected.length} listed`)
    expect(screen.getByText(expected[0].title)).toBeInTheDocument()
  })

  it('shows a recovery path when nothing matches', () => {
    renderAt('/properties/?min=999999')
    expect(screen.getByText(/No properties match your search/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Reset search/i })).toBeInTheDocument()
  })
})

describe('PropertyDetailPage', () => {
  beforeEach(() => { i18n.changeLanguage('en') })

  it('shows price, key facts, amenities, and a WhatsApp enquiry prefilled with the reference', () => {
    const p = properties.find((x) => x.type === 'apartment' && x.bedrooms === 3)!
    renderAt(`/properties/${p.slug}/`)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(p.title)
    expect(screen.getAllByText(new RegExp(p.price.toLocaleString('en-US'))).length).toBeGreaterThan(0)

    for (const a of p.amenities.slice(0, 3)) {
      expect(screen.getAllByText(a).length).toBeGreaterThan(0)
    }

    const wa = screen.getAllByRole('link', { name: /WhatsApp/i })[0]
    expect(wa).toHaveAttribute('href', expect.stringContaining(`wa.me/${p.agent.whatsapp}`))
    expect(decodeURIComponent(wa.getAttribute('href')!)).toContain(p.reference)
  })

  it('renders the 404 page for an unknown slug instead of crashing', () => {
    renderAt('/properties/not-a-real-listing/')
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('links each breadcrumb back to the listing hub', () => {
    const p = properties[0]
    renderAt(`/properties/${p.slug}/`)
    const nav = screen.getByRole('navigation', { name: /breadcrumb/i })
    expect(within(nav).getByRole('link', { name: 'Properties' })).toHaveAttribute('href', '/properties/')
  })
})
