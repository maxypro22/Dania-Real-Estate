import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { company, companyPhones } from '@/data/mockData'

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>{ui}</MemoryRouter>
    </I18nextProvider>,
  )
}

// Regression for F-001: every phone number comes from `company` (no hardcoded
// literals). The client's Developer Note requires all THREE lines to be shown
// and individually clickable in both the header and the footer.
// Regression for F-017: tel: hrefs must be dial-safe (no spaces).
const noSpaces = (href: string | null) => {
  expect(href).not.toBeNull()
  expect(href!).not.toMatch(/\s/)
}

const expectAllThreeLines = (container: HTMLElement) => {
  const phones = companyPhones()
  expect(phones).toHaveLength(3)
  const hrefs = [...container.querySelectorAll('a[href^="tel:"]')].map((a) => {
    noSpaces(a.getAttribute('href'))
    return a.getAttribute('href')
  })
  for (const p of phones) {
    expect(container.textContent).toContain(p.display)
    expect(hrefs).toContain(p.tel)
  }
}

describe('phone numbers are sourced from company data', () => {
  it('Header shows all three lines, each with a dial-safe tel:', () => {
    const { container } = renderWithProviders(<Header />)
    expectAllThreeLines(container)
  })

  it('Footer shows all three lines, each with a dial-safe tel:', () => {
    const { container } = renderWithProviders(<Footer />)
    expectAllThreeLines(container)
  })

  it('the three lines are distinct and all defined', () => {
    const displays = companyPhones().map((p) => p.display)
    expect(new Set(displays).size).toBe(3)
    for (const d of displays) expect(d).toBeTruthy()
    expect(company.phone).not.toBe(company.officePhone)
  })

  it('the header top bar no longer exposes the email address', () => {
    const { container } = renderWithProviders(<Header />)
    expect(container.querySelector('a[href^="mailto:"]')).toBeNull()
    expect(container.textContent).not.toContain(company.email)
  })

  it('Header and Footer both link LinkedIn alongside Facebook and Instagram', () => {
    for (const ui of [<Header key="h" />, <Footer key="f" />]) {
      const { container } = renderWithProviders(ui)
      for (const url of [company.facebook, company.instagram, company.linkedin]) {
        expect(container.querySelector(`a[href="${url}"]`)).not.toBeNull()
      }
    }
  })
})
