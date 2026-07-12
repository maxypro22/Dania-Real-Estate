import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import { Layout } from '@/components/layout/Layout'

function renderLayout() {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<div>home content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </I18nextProvider>,
  )
}

// Regression for F-002: a skip link must target a <main id>.
describe('layout landmarks', () => {
  it('renders a skip link pointing at the main landmark', () => {
    const { container } = renderLayout()
    const skip = container.querySelector('a[href="#main-content"]')
    expect(skip).not.toBeNull()
    const main = container.querySelector('main#main-content')
    expect(main).not.toBeNull()
  })
})
