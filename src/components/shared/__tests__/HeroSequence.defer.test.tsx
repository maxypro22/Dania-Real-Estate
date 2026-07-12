import { describe, it, expect, vi, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import { HeroSequence } from '@/components/shared/HeroSequence'

// Regression for F-002: the hero must NOT fire all 120 frame requests on mount.
// jsdom has no 2D canvas, so we stub getContext (otherwise the effect bails
// early) and count Image() constructions synchronously after mount.
describe('HeroSequence frame loading', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    delete (navigator as unknown as { connection?: unknown }).connection
  })

  function stubCanvas() {
    const ctx = { setTransform() {}, drawImage() {} }
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      ctx as unknown as CanvasRenderingContext2D,
    )
  }

  function countImages() {
    const counter = { n: 0 }
    const RealImage = globalThis.Image
    vi.stubGlobal(
      'Image',
      class extends RealImage {
        constructor() {
          super()
          counter.n++
        }
      },
    )
    return counter
  }

  it('loads only the first frame on mount and defers the rest to idle', () => {
    const ctx = { setTransform() {}, drawImage() {} }
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      ctx as unknown as CanvasRenderingContext2D,
    )

    // Keep the idle scheduler from running synchronously so we observe the
    // state immediately after mount, before any deferred batch loads.
    const idleSpy = vi.fn(() => 1)
    vi.stubGlobal('requestIdleCallback', idleSpy)

    let created = 0
    const RealImage = globalThis.Image
    vi.stubGlobal(
      'Image',
      class extends RealImage {
        constructor() {
          super()
          created++
        }
      },
    )

    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <HeroSequence />
        </MemoryRouter>
      </I18nextProvider>,
    )

    // Only frame 0 is fetched eagerly; the remaining frames are scheduled.
    expect(created).toBe(1)
    expect(idleSpy).toHaveBeenCalled()
  })

  // Regression for F-010: on a Save-Data connection the ~4.9 MB frame sequence
  // must NOT preload — even when idle time is available — leaving only frame 0.
  it('skips the frame-sequence preload on Save-Data connections', () => {
    stubCanvas()
    // Run idle callbacks synchronously so the batch loader would fire if allowed.
    vi.stubGlobal('requestIdleCallback', (cb: () => void) => {
      cb()
      return 1
    })
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: { saveData: true },
    })
    const counter = countImages()

    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <HeroSequence />
        </MemoryRouter>
      </I18nextProvider>,
    )

    // Frame 0 only (LCP); the 119-frame sequence is gated off.
    expect(counter.n).toBe(1)
  })
})
