import { useState } from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import { SearchFilterBar } from '@/components/search/SearchFilterBar'
import { emptyFilters, type Filters } from '@/lib/search'

function Harness() {
  const [f, setF] = useState<Filters>(emptyFilters)
  return <SearchFilterBar value={f} onChange={setF} showSort />
}

function renderBar() {
  return render(
    <I18nextProvider i18n={i18n}>
      <Harness />
    </I18nextProvider>,
  )
}

const chip = (name: RegExp) => screen.getByRole('button', { name })

/** The panel the given chip controls, looked up by its aria-controls id. */
function panelOf(button: HTMLElement) {
  const id = button.getAttribute('aria-controls')
  expect(id).toBeTruthy()
  return document.getElementById(id!)
}

describe('filter dropdowns', () => {
  beforeEach(() => { i18n.changeLanguage('en') })

  it('opens on click and closes on Escape', () => {
    renderBar()
    expect(screen.queryByText('Bedrooms')).toBeNull()

    fireEvent.click(chip(/Beds & Baths/))
    expect(screen.getByText('Bedrooms')).toBeInTheDocument()
    expect(screen.getByText('Bathrooms')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByText('Bedrooms')).toBeNull()
  })

  it('renders the panel in a portal on <body>, not inside the scrolling chip row', () => {
    // Regression guard: the chip rows use overflow-x-auto, and CSS forces the
    // cross axis of a scroll container to clip — an in-flow panel is sliced off
    // at the row's edge and never becomes visible.
    renderBar()
    const button = chip(/Property type/)
    fireEvent.click(button)

    const panel = panelOf(button)
    expect(panel).not.toBeNull()
    expect(panel!.parentElement).toBe(document.body)
    expect(button.closest('body > div')).not.toBe(panel!.parentElement)
  })

  it('stays open when the panel itself is clicked, and applies the choice', () => {
    renderBar()
    fireEvent.click(chip(/Property type/))

    const villa = screen.getByRole('button', { name: /^Villa/ })
    fireEvent.pointerDown(villa)
    fireEvent.click(villa)

    // Panel still open (a click inside it must not count as "outside")…
    expect(screen.getByRole('button', { name: /^Compound/ })).toBeInTheDocument()
    // …and the chip now reports the selection.
    expect(screen.getByRole('button', { name: /Villas/ })).toBeInTheDocument()
  })

  it('closes when the pointer goes down outside it', () => {
    renderBar()
    fireEvent.click(chip(/Property type/))
    expect(screen.getByRole('button', { name: /^Apartment/ })).toBeInTheDocument()

    fireEvent.pointerDown(document.body)
    expect(screen.queryByRole('button', { name: /^Apartment/ })).toBeNull()
  })

  it('offers the sort options as a radio group with Featured selected', () => {
    renderBar()
    fireEvent.click(chip(/Featured/))

    const group = screen.getByRole('radiogroup', { name: 'Sort by' })
    expect(group).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Featured' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'Price (low)' })).toHaveAttribute('aria-checked', 'false')

    fireEvent.click(screen.getByRole('radio', { name: 'Price (low)' }))
    // Choosing an option closes the panel and relabels the chip.
    expect(screen.queryByRole('radiogroup')).toBeNull()
    expect(chip(/Price \(low\)/)).toBeInTheDocument()
  })

  it('collapses long option lists behind View more', () => {
    renderBar()
    fireEvent.click(chip(/Property type/))

    // Seven types, six shown.
    expect(screen.queryByRole('button', { name: /^Shop/ })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'View more' }))
    expect(screen.getByRole('button', { name: /^Shop/ })).toBeInTheDocument()
  })
})
