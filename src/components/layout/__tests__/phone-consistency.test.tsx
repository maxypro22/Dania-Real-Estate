import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { company } from '@/data/mockData'

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>{ui}</MemoryRouter>
    </I18nextProvider>,
  )
}

// Regression for F-001: the header must advertise the company phone, not a
// different hardcoded number. Regression for F-017: tel: hrefs must be
// dial-safe (no spaces).
describe('phone number is a single source of truth', () => {
  const dialSafe = `tel:${company.phone.replace(/\s/g, '')}`

  it('Header shows company.phone and links a space-free tel:', () => {
    const { container } = renderWithProviders(<Header />)
    expect(container.textContent).toContain(company.phone)
    // The retired wrong number must be gone.
    expect(container.innerHTML).not.toContain('4444 0085')
    const telLinks = [...container.querySelectorAll('a[href^="tel:"]')]
    expect(telLinks.length).toBeGreaterThan(0)
    for (const a of telLinks) {
      const href = a.getAttribute('href')!
      expect(href).toBe(dialSafe)
      expect(href).not.toMatch(/\s/)
    }
  })

  it('Footer links a space-free tel: to company.phone', () => {
    const { container } = renderWithProviders(<Footer />)
    const tel = container.querySelector('a[href^="tel:"]')!
    expect(tel.getAttribute('href')).toBe(dialSafe)
  })
})
