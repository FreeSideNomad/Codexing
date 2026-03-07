import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { useQuoteStore } from '@/stores/quoteStore'
import { useAuthStore } from '@/stores/authStore'
import { useTimelineStore } from '@/stores/timelineStore'
import { PriceDisplay, formatZAR } from '@/components/shared/PriceDisplay'
import { Card, CardContent } from '@/components/ui/card'
import { PaymentMethodSelector } from '@/components/payment/PaymentMethodSelector'
import { CardForm } from '@/components/payment/CardForm'
import { EftDetails } from '@/components/payment/EftDetails'
import { AccountCharge } from '@/components/payment/AccountCharge'
import type { PaymentMethod } from '@/types'

const methodLabels: Record<PaymentMethod, string> = {
  card: 'Credit Card',
  eft: 'EFT / Bank Transfer',
  account: 'Account Charge',
}

export function PaymentPage() {
  const { quoteId } = useParams<{ quoteId: string }>()
  const navigate = useNavigate()
  const quote = useQuoteStore((s) => s.quotes.find((q) => q.id === quoteId))
  const setStatus = useQuoteStore((s) => s.setStatus)
  const addRevision = useQuoteStore((s) => s.addRevision)
  const getTotal = useQuoteStore((s) => s.getTotal)
  const getDepositAmount = useQuoteStore((s) => s.getDepositAmount)
  const currentUser = useAuthStore((s) => s.currentUser)
  const addEvent = useTimelineStore((s) => s.addEvent)

  const [method, setMethod] = useState<PaymentMethod>('card')

  if (!quoteId || !quote || quote.status !== 'TermsAccepted') {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          {!quote ? 'Quote not found' : 'Payment not available'}
        </h2>
        <p className="text-text-secondary mb-6">
          {!quote
            ? 'The quote you are looking for does not exist or has been removed.'
            : 'Terms must be accepted before proceeding to payment.'}
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
  const balance = total - deposit

  function handlePaymentSuccess() {
    if (!quoteId || !currentUser) return
    setStatus(quoteId, 'DepositPaid')
    addRevision(quoteId, currentUser.name, `Deposit paid via ${methodLabels[method]}`)
    addEvent(quoteId, 'Deposit Paid', currentUser.name, 'Deposit payment received')
    navigate(`/workspace/${quoteId}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-6 pb-12 animate-fade-in">
      {/* Back link */}
      <div>
        <Link
          to={`/workspace/${quoteId}/terms`}
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-accent transition-colors mb-3"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Terms
        </Link>
        <h1 className="text-2xl font-bold text-text-primary">Payment</h1>
        <p className="text-text-secondary text-sm mt-1">{quote.quoteNumber}</p>
      </div>

      {/* Quote summary card */}
      <Card>
        <CardContent className="flex flex-wrap gap-8 py-5">
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Total Amount</p>
            <PriceDisplay amount={total} size="lg" />
          </div>
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Deposit (30%)</p>
            <p className="text-xl font-semibold text-accent">{formatZAR(deposit)}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Balance Remaining</p>
            <PriceDisplay amount={balance} size="lg" />
          </div>
        </CardContent>
      </Card>

      {/* Payment method selector */}
      <PaymentMethodSelector selected={method} onSelect={setMethod} />

      {/* Active payment form */}
      <Card>
        <CardContent className="py-6">
          {method === 'card' && (
            <CardForm depositAmount={deposit} onSuccess={handlePaymentSuccess} />
          )}
          {method === 'eft' && (
            <EftDetails
              depositAmount={deposit}
              quoteNumber={quote.quoteNumber}
              onConfirm={handlePaymentSuccess}
            />
          )}
          {method === 'account' && (
            <AccountCharge depositAmount={deposit} onSuccess={handlePaymentSuccess} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
