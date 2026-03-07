import { useEffect } from 'react'
import { useParams, Link } from 'react-router'
import { useQuoteStore } from '@/stores/quoteStore'
import { StatusBar } from '@/components/workspace/StatusBar'
import { KitPanel } from '@/components/workspace/KitPanel'
import { QuotePanel } from '@/components/workspace/QuotePanel'
import { RevisionHistory } from '@/components/workspace/RevisionHistory'

export function WorkspacePage() {
  const { quoteId } = useParams<{ quoteId: string }>()
  const quote = useQuoteStore((s) => s.quotes.find((q) => q.id === quoteId))
  const setActiveQuote = useQuoteStore((s) => s.setActiveQuote)

  useEffect(() => {
    if (quoteId) {
      setActiveQuote(quoteId)
    }
  }, [quoteId, setActiveQuote])

  if (!quoteId || !quote) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <h2 className="text-xl font-semibold text-text-primary mb-2">Quote not found</h2>
        <p className="text-text-secondary mb-6">
          The quote you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/"
          className="text-accent hover:text-accent-hover transition-colors font-medium"
        >
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top: Back link + heading */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-accent transition-colors mb-3"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
        <h1 className="text-2xl font-bold text-text-primary">
          {quote.quoteNumber}
        </h1>
      </div>

      {/* Status bar */}
      <StatusBar quoteId={quoteId} />

      {/* Main content: two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left column (~60%) */}
        <div className="lg:col-span-3">
          <KitPanel quoteId={quoteId} />
        </div>

        {/* Right column (~40%) */}
        <div className="lg:col-span-2 space-y-4">
          <QuotePanel quoteId={quoteId} />
          <RevisionHistory quoteId={quoteId} />
        </div>
      </div>

      {/* Placeholder for ChatPanel (Task 11) */}
      <div className="rounded-xl border border-border-subtle border-dashed bg-surface-raised/50 p-8 text-center">
        <p className="text-text-muted text-sm">Chat panel will appear here</p>
      </div>
    </div>
  )
}
