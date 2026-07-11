import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import { ContactPage } from '@/pages/ContactPage'
import { company } from '@/data/mockData'

function renderContact() {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    </I18nextProvider>,
  )
}

function fillForm(container: HTMLElement) {
  fireEvent.change(container.querySelector('#contact-name')!, { target: { value: 'Sara Ali' } })
  fireEvent.change(container.querySelector('#contact-phone')!, { target: { value: '55123456' } })
  fireEvent.change(container.querySelector('#contact-email')!, { target: { value: 'sara@example.com' } })
  fireEvent.change(container.querySelector('#contact-message')!, { target: { value: 'Need a 2BHK in Al Sadd' } })
}

describe('ContactPage — WhatsApp lead handoff', () => {
  beforeEach(() => {
    i18n.changeLanguage('en')
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('hands the lead to wa.me with every field prefilled and URL-encoded', () => {
    const openSpy = vi.spyOn(window, 'open').mockReturnValue({} as Window)
    const { container } = renderContact()

    fillForm(container)
    fireEvent.submit(container.querySelector('form')!)

    expect(openSpy).toHaveBeenCalledTimes(1)
    const url = openSpy.mock.calls[0][0] as string
    expect(url.startsWith(`https://wa.me/${company.whatsapp}?text=`)).toBe(true)

    const decoded = decodeURIComponent(url.slice(url.indexOf('text=') + 'text='.length))
    expect(decoded).toContain(company.name)
    expect(decoded).toContain('Name: Sara Ali')
    expect(decoded).toContain('Phone: 55123456')
    expect(decoded).toContain('Email: sara@example.com')
    expect(decoded).toContain('Message: Need a 2BHK in Al Sadd')
  })

  // Regression for F-009: a blocked popup (window.open → null) must NOT show a
  // false success; it must surface a direct link to the same prefilled URL.
  it('shows a direct WhatsApp link instead of "success" when the popup is blocked', () => {
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null)
    const { container } = renderContact()

    fillForm(container)
    fireEvent.submit(container.querySelector('form')!)

    expect(openSpy).toHaveBeenCalledTimes(1)
    const attempted = openSpy.mock.calls[0][0] as string

    // The prefilled fallback link is the only wa.me link carrying ?text=.
    const fallback = container.querySelector<HTMLAnchorElement>('a[href*="wa.me"][href*="text="]')
    expect(fallback).not.toBeNull()
    expect(fallback!.getAttribute('href')).toBe(attempted)

    // And we did not falsely claim the inquiry was submitted.
    expect(container.textContent).not.toContain('Inquiry Submitted')
  })
})
