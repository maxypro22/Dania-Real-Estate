import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import type { ReactElement } from 'react'
import i18n from '@/i18n'
import { Header } from '@/components/layout/Header'
import { FloatingContact } from '@/components/shared/FloatingContact'
import { QuickCategoryBoxes } from '@/components/search/QuickCategoryBoxes'
import { company } from '@/data/mockData'

// Locks in the client's "Website Structure Plan": navigation shape, the header
// action area, and the dual-number floating widgets.

function renderUi(ui: ReactElement) {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>{ui}</MemoryRouter>
    </I18nextProvider>,
  )
}

describe('header navigation structure', () => {
  beforeEach(() => { i18n.changeLanguage('en') })

  it('has exactly the five specified top-level entries', () => {
    const { container } = renderUi(<Header />)
    const nav = container.querySelector('nav')!
    const tops = [...nav.children].map((el) => el.textContent?.trim() ?? '')
    expect(tops).toHaveLength(5)
    expect(tops[0]).toBe('Home')
    expect(tops[1]).toContain('Properties for Rent')
    expect(tops[2]).toContain('Areas')
    expect(tops[3]).toContain('About Company')
    expect(tops[4]).toBe('Contact Us')
  })

  it('keeps "Properties for Rent" a non-clickable dropdown title', () => {
    renderUi(<Header />)
    const trigger = screen.getByRole('button', { name: /Properties for Rent/i })
    // A <button>, never a link — it can only ever open the panel.
    expect(trigger.tagName).toBe('BUTTON')
    expect(trigger.closest('a')).toBeNull()
    // …and no link anywhere points at a "properties for rent" page, because
    // the section deliberately has none.
    expect(document.querySelector('a[href="/properties-for-rent/"]')).toBeNull()
  })

  it('exposes all five rental sub-categories, with the BHK and villa levels', () => {
    const { container } = renderUi(<Header />)
    const panel = container.querySelector('nav > div:nth-child(2)')!
    for (const href of [
      '/apartments-for-rent/', '/villas-for-rent/', '/studio-partition-rentals/',
      '/staff-accommodation/', '/shops-for-rent/',
      '/apartments-for-rent/1-bedroom/', '/apartments-for-rent/2-bedroom/',
      '/apartments-for-rent/3-bedroom/', '/villas-for-rent/standard-villas/',
      '/villas-for-rent/compound-villas/',
    ]) {
      expect(within(panel as HTMLElement).getByRole('link', { name: (_, el) => el.getAttribute('href') === href }))
        .toBeInTheDocument()
    }
  })

  it('lists the named locations under Areas and the About sub-pages', () => {
    const { container } = renderUi(<Header />)
    for (const href of ['/areas/al-sadd/', '/areas/bin-mahmoud/', '/areas/al-wakra/']) {
      expect(container.querySelector(`a[href="${href}"]`)).not.toBeNull()
    }
    for (const href of ['/about-company/', '/about-company/why-choose-us/', '/about-company/gallery/', '/faq/']) {
      expect(container.querySelector(`a[href="${href}"]`)).not.toBeNull()
    }
  })
})

describe('header action area', () => {
  beforeEach(() => { i18n.changeLanguage('en') })

  it('carries a Find Us On Map button opening the maps link in a new tab', () => {
    const { container } = renderUi(<Header />)
    const link = container.querySelector(`a[href="${company.mapUrl}"]`)
    expect(link).not.toBeNull()
    expect(link).toHaveAttribute('target', '_blank')
    expect(link!.getAttribute('rel')).toContain('noopener')
  })

  it('no longer shows the green WhatsApp button beside the language switcher', () => {
    const { container } = renderUi(<Header />)
    // The social-icon row in the top utility bar keeps its WhatsApp link — the
    // spec only removed the green circular button from the navbar action area.
    // So exactly one wa.me link should remain, and it must be the social one,
    // sitting alongside Facebook rather than next to the AR switcher.
    const waLinks = [...container.querySelectorAll('a[href^="https://wa.me/"]')]
    expect(waLinks).toHaveLength(1)

    const socialRow = container.querySelector(`a[href="${company.facebook}"]`)!.parentElement
    expect(waLinks[0].parentElement).toBe(socialRow)

    // Nothing WhatsApp-shaped is left in the action area next to Contact Us.
    const contactCta = container.querySelector('a[href="/contact-us/"], a[href^="/contact-us"]')
    expect(contactCta?.parentElement?.querySelector('a[href^="https://wa.me/"]')).toBeFalsy()
  })
})

describe('floating call + whatsapp widgets', () => {
  beforeEach(() => { i18n.changeLanguage('en') })

  it('offers both lines as tel: links when Call is tapped', () => {
    renderUi(<FloatingContact />)
    expect(screen.queryByRole('dialog')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: /Call us now/i }))
    const sheet = screen.getByRole('dialog')
    for (const display of [company.phone, company.phone2]) {
      const link = within(sheet).getByRole('link', {
        name: (_, el) => el.getAttribute('href') === `tel:${display.replace(/\s/g, '')}`,
      })
      expect(link).toBeInTheDocument()
    }
    expect(within(sheet).getByText('Line 1')).toBeInTheDocument()
    expect(within(sheet).getByText('Line 2')).toBeInTheDocument()
  })

  it('offers both lines as wa.me links when WhatsApp is tapped', () => {
    renderUi(<FloatingContact />)
    fireEvent.click(screen.getByRole('button', { name: /Chat on WhatsApp/i }))
    const sheet = screen.getByRole('dialog')
    for (const display of [company.phone, company.phone2]) {
      const href = `https://wa.me/${display.replace(/\D/g, '')}`
      const link = within(sheet).getByRole('link', { name: (_, el) => el.getAttribute('href') === href })
      expect(link).toHaveAttribute('target', '_blank')
    }
  })

  it('shows one sheet at a time and closes on Escape', () => {
    renderUi(<FloatingContact />)
    fireEvent.click(screen.getByRole('button', { name: /Call us now/i }))
    fireEvent.click(screen.getByRole('button', { name: /Chat on WhatsApp/i }))
    expect(screen.getAllByRole('dialog')).toHaveLength(1)
    expect(screen.getByRole('dialog')).toHaveAccessibleName(/WhatsApp/i)

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})

describe('quick category boxes', () => {
  beforeEach(() => { i18n.changeLanguage('en') })

  it('links the five categories to their landing pages', () => {
    const { container } = renderUi(<QuickCategoryBoxes />)
    const links = [...container.querySelectorAll('a')]
    expect(links).toHaveLength(5)
    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      '/apartments-for-rent/',
      '/villas-for-rent/',
      '/studio-partition-rentals/',
      '/staff-accommodation/',
      '/shops-for-rent/',
    ])
    expect(container.textContent).toContain('Studios & Partitions')
    expect(container.textContent).toContain('Staff Accommodation')
  })
})
