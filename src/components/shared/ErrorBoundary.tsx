import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}
interface State {
  hasError: boolean
}

/**
 * App-level error boundary. A client-rendered SPA has no server to fall back to,
 * so a single thrown render error (e.g. a mis-mapped i18n `returnObjects` array)
 * would otherwise blank the entire site. This catches it and shows an on-brand
 * recovery panel with a way back, instead of a white screen.
 *
 * Rendered keyed by pathname in Layout, so navigating to another route clears
 * the error state automatically.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface to the console for now; F-019 (Batch 10) wires this to a reporter.
    console.error('Render error caught by ErrorBoundary:', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <section className="bg-forest text-white" role="alert">
        <div className="max-w-[1280px] mx-auto px-6 py-24 md:py-32 text-center">
          <p className="text-lime text-5xl md:text-6xl font-extrabold mb-4">Oops</p>
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Something went wrong on this page</h1>
          <p className="text-white/70 max-w-xl mx-auto mb-10 text-sm md:text-base leading-relaxed">
            Please reload the page. If it keeps happening, reach our leasing desk directly and we'll help right away.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 bg-lime text-forest font-bold px-6 py-3 rounded-full text-sm hover:bg-white transition-colors"
            >
              Reload page
            </button>
            <a
              href="/"
              className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-white/20 transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </section>
    )
  }
}
