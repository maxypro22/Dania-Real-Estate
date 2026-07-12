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

// Regression for F-001: every phone number comes from `company` (no hardcoded
// literals), and the two numbers are intentional and distinct — the office
// landline (header) and the mobile/WhatsApp line (footer/contact).
// Regression for F-017: tel: hrefs must be dial-safe (no spaces).
const noSpaces = (href: string | null) => {
  expect(href).not.toBeNull()
  expect(href!).not.toMatch(/\s/)
}

describe('phone numbers are sourced from company data', () => {
  it('Header shows the office landline with a dial-safe tel:', () => {
    const { container } = renderWithProviders(<Header />)
    expect(container.textContent).toContain(company.officePhone)
    const telLinks = [...container.querySelectorAll('a[href^="tel:"]')]
    expect(telLinks.length).toBeGreaterThan(0)
    for (const a of telLinks) {
      noSpaces(a.getAttribute('href'))
      expect(a.getAttribute('href')).toBe(`tel:${company.officePhone.replace(/\s/g, '')}`)
    }
  })

  it('Footer links a dial-safe tel: to the mobile line', () => {
    const { container } = renderWithProviders(<Footer />)
    const tel = container.querySelector('a[href^="tel:"]')!
    expect(tel.getAttribute('href')).toBe(`tel:${company.phone.replace(/\s/g, '')}`)
    noSpaces(tel.getAttribute('href'))
  })

  it('the two lines are distinct and both defined', () => {
    expect(company.phone).not.toBe(company.officePhone)
    expect(company.officePhone).toBeTruthy()
  })
})
