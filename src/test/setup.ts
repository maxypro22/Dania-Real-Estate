import '@testing-library/jest-dom/vitest'

// jsdom implements neither of these browser APIs, but the shared scroll-reveal
// components (`useScrollReveal` → IntersectionObserver, `ScrollRevealText` →
// matchMedia) call them on mount. Stub them so rendering real pages under test
// doesn't throw. Both stubs report "not intersecting / no reduced-motion",
// which is the inert default and keeps animations out of the assertions.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
globalThis.IntersectionObserver =
  IntersectionObserverStub as unknown as typeof IntersectionObserver

if (!window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {
        return false
      },
    }) as unknown as MediaQueryList
}
