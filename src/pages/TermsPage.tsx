import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { useQuoteStore } from '@/stores/quoteStore'
import { useAuthStore } from '@/stores/authStore'
import { useTimelineStore } from '@/stores/timelineStore'
import { PriceDisplay } from '@/components/shared/PriceDisplay'
import { TermsDisplay } from '@/components/workspace/TermsDisplay'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export function TermsPage() {
  const { quoteId } = useParams<{ quoteId: string }>()
  const navigate = useNavigate()
  const quote = useQuoteStore((s) => s.quotes.find((q) => q.id === quoteId))
  const setStatus = useQuoteStore((s) => s.setStatus)
  const addRevision = useQuoteStore((s) => s.addRevision)
  const getTotal = useQuoteStore((s) => s.getTotal)
  const getDepositAmount = useQuoteStore((s) => s.getDepositAmount)
  const currentUser = useAuthStore((s) => s.currentUser)
  const addEvent = useTimelineStore((s) => s.addEvent)

  const [accepted, setAccepted] = useState(false)

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

  const total = getTotal(quoteId)
  const deposit = getDepositAmount(quoteId)

  function handleAcceptTerms() {
    if (!quoteId || !currentUser) return
    setStatus(quoteId, 'TermsAccepted')
    addRevision(quoteId, currentUser.name, 'Terms and conditions accepted')
    addEvent(quoteId, 'Terms Accepted', currentUser.name, 'Client accepted rental terms and conditions')
    navigate(`/workspace/${quoteId}/payment`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-6 pb-12 animate-fade-in">
      {/* Back link */}
      <div>
        <Link
          to={`/workspace/${quoteId}`}
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-accent transition-colors mb-3"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Workspace
        </Link>
        <h1 className="text-2xl font-bold text-text-primary">Rental Terms & Conditions</h1>
        <p className="text-text-secondary text-sm mt-1">{quote.quoteNumber}</p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column (~65%) */}
        <div className="lg:col-span-8">
          <TermsDisplay />
        </div>

        {/* Right column (~35%) */}
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Quote Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Quote Number</span>
                <span className="text-text-primary font-mono">{quote.quoteNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Total Amount</span>
                <PriceDisplay amount={total} size="sm" />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Deposit (30%)</span>
                <PriceDisplay amount={deposit} size="sm" />
              </div>

              <div className="border-t border-border-subtle pt-4 space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-border-subtle bg-surface-overlay accent-accent"
                  />
                  <span className="text-sm text-text-secondary leading-snug">
                    I have read and accept the rental terms and conditions
                  </span>
                </label>

                <Button
                  size="lg"
                  className="w-full"
                  disabled={!accepted}
                  onClick={handleAcceptTerms}
                >
                  Accept Terms & Continue to Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
