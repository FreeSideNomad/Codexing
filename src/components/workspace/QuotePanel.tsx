import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useQuoteStore } from '@/stores/quoteStore'
import { useAuthStore } from '@/stores/authStore'
import { useTimelineStore } from '@/stores/timelineStore'
import { useChatStore } from '@/stores/chatStore'
import { QuoteSummary } from '@/components/shared/QuoteSummary'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface QuotePanelProps {
  quoteId: string
}

export function QuotePanel({ quoteId }: QuotePanelProps) {
  const navigate = useNavigate()
  const quote = useQuoteStore((s) => s.quotes.find((q) => q.id === quoteId))
  const setStatus = useQuoteStore((s) => s.setStatus)
  const addRevision = useQuoteStore((s) => s.addRevision)
  const setDiscount = useQuoteStore((s) => s.setDiscount)
  const setDeliveryFee = useQuoteStore((s) => s.setDeliveryFee)
  const currentUser = useAuthStore((s) => s.currentUser)
  const addEvent = useTimelineStore((s) => s.addEvent)
  const sendMessage = useChatStore((s) => s.sendMessage)

  const [discountInput, setDiscountInput] = useState('')
  const [deliveryFeeInput, setDeliveryFeeInput] = useState('')

  if (!quote || !currentUser) return null

  const role = currentUser.role
  const status = quote.status

  // Client actions
  function handleAcceptQuote() {
    setStatus(quoteId, 'Accepted')
    addRevision(quoteId, currentUser!.name, 'Quote accepted by client')
    addEvent(quoteId, 'Quote Accepted', currentUser!.name, 'Client accepted the quote')
  }

  function handleRequestChanges() {
    sendMessage(quoteId, 'I would like to request some changes to this quote.', {
      userId: currentUser!.id,
      name: currentUser!.name,
      role: currentUser!.role,
    })
    setStatus(quoteId, 'Negotiating')
  }

  function handleProceedToTerms() {
    navigate(`/workspace/${quoteId}/terms`)
  }

  // Staff actions
  function handleSendToClient() {
    setStatus(quoteId, 'Sent')
    addRevision(quoteId, currentUser!.name, 'Quote sent to client')
    addEvent(quoteId, 'Quote Sent', currentUser!.name, 'Quote was sent to the client for review')
  }

  function handleMarkConfirmed() {
    setStatus(quoteId, 'Confirmed')
    addRevision(quoteId, currentUser!.name, 'Booking confirmed by staff')
    addEvent(quoteId, 'Booking Confirmed', currentUser!.name, 'Staff confirmed the booking after deposit was received')
  }

  function handleApplyDiscount() {
    const amount = parseFloat(discountInput)
    if (isNaN(amount) || amount < 0) return
    setDiscount(quoteId, amount)
    addRevision(quoteId, currentUser!.name, `Discount set to R${amount.toLocaleString()}`)
    setDiscountInput('')
  }

  function handleApplyDeliveryFee() {
    const amount = parseFloat(deliveryFeeInput)
    if (isNaN(amount) || amount < 0) return
    setDeliveryFee(quoteId, amount)
    addRevision(quoteId, currentUser!.name, `Delivery fee adjusted to R${amount.toLocaleString()}`)
    setDeliveryFeeInput('')
  }

  const createdDate = new Date(quote.createdAt).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="space-y-4">
      {/* Quote metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Quote Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Quote Number</span>
            <span className="text-text-primary font-mono">{quote.quoteNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Created</span>
            <span className="text-text-primary">{createdDate}</span>
          </div>
        </CardContent>
      </Card>

      {/* Quote Summary */}
      <QuoteSummary quoteId={quoteId} />

      {/* Action buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Client actions */}
          {role === 'client' && (status === 'Sent' || status === 'Negotiating') && (
            <div className="space-y-3">
              <Button
                className="w-full bg-success text-white hover:bg-green-600"
                onClick={handleAcceptQuote}
              >
                Accept Quote
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleRequestChanges}
              >
                Request Changes
              </Button>
            </div>
          )}

          {role === 'client' && status === 'Accepted' && (
            <Button
              className="w-full"
              onClick={handleProceedToTerms}
            >
              Proceed to Terms
            </Button>
          )}

          {role === 'client' && status === 'DepositPaid' && (
            <div className="rounded-lg bg-success/10 border border-success/30 p-4 text-center">
              <p className="text-success text-sm font-medium">Deposit received</p>
              <p className="text-text-secondary text-xs mt-1">
                Your booking is being confirmed by our team.
              </p>
            </div>
          )}

          {role === 'client' && (status === 'Draft' || status === 'TermsAccepted' || status === 'Confirmed') && (
            <p className="text-text-muted text-sm text-center py-2">
              No actions available at this time.
            </p>
          )}

          {/* Staff actions */}
          {role === 'staff' && (
            <div className="space-y-4">
              {status === 'Draft' && (
                <Button className="w-full" onClick={handleSendToClient}>
                  Send to Client
                </Button>
              )}

              {status === 'DepositPaid' && (
                <Button
                  className="w-full bg-success text-white hover:bg-green-600"
                  onClick={handleMarkConfirmed}
                >
                  Mark as Confirmed
                </Button>
              )}

              {/* Discount */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Apply Discount (ZAR)
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="0"
                    placeholder="e.g. 500"
                    value={discountInput}
                    onChange={(e) => setDiscountInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" onClick={handleApplyDiscount}>
                    Apply
                  </Button>
                </div>
              </div>

              {/* Delivery fee */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Adjust Delivery Fee (ZAR)
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="0"
                    placeholder="e.g. 1500"
                    value={deliveryFeeInput}
                    onChange={(e) => setDeliveryFeeInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" onClick={handleApplyDeliveryFee}>
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
