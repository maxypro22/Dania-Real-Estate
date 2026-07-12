import { describe, it, expect, vi, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'

function Boom(): never {
  throw new Error('boom')
}

// Regression for F-003: a thrown render error must degrade to a recovery panel,
// not blank the whole SPA.
describe('ErrorBoundary', () => {
  afterEach(() => vi.restoreAllMocks())

  it('shows a recovery panel when a child throws', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { getByRole, container } = render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    )
    expect(getByRole('alert')).toBeTruthy()
    expect(container.textContent).toContain('Something went wrong')
  })

  it('renders children unchanged when nothing throws', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <p>all good</p>
      </ErrorBoundary>,
    )
    expect(getByText('all good')).toBeTruthy()
  })
})
