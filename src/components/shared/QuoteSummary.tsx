import { useQuoteStore } from '@/stores/quoteStore'
import { PriceDisplay, formatZAR } from './PriceDisplay'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface QuoteSummaryProps {
  quoteId: string
}

export function QuoteSummary({ quoteId }: QuoteSummaryProps) {
  const quote = useQuoteStore((s) => s.quotes.find((q) => q.id === quoteId))
  const getSubtotal = useQuoteStore((s) => s.getSubtotal)
  const getVatAmount = useQuoteStore((s) => s.getVatAmount)
  const getTotal = useQuoteStore((s) => s.getTotal)
  const getDepositAmount = useQuoteStore((s) => s.getDepositAmount)

  if (!quote) return null

  const subtotal = getSubtotal(quoteId)
  const vat = getVatAmount(quoteId)
  const total = getTotal(quoteId)
  const deposit = getDepositAmount(quoteId)
  const balance = total - deposit

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quote Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Line items */}
        <div className="space-y-2">
          {quote.items.map((item) => {
            const lineTotal = item.dailyRate * item.quantity * item.days
            return (
              <div key={item.kitItemId} className="flex justify-between text-sm">
                <div className="min-w-0 flex-1">
                  <p className="text-text-primary truncate">{item.name}</p>
                  <p className="text-text-muted text-xs">
                    {formatZAR(item.dailyRate)} x {item.quantity} x {item.days} day{item.days !== 1 ? 's' : ''}
                  </p>
                </div>
                <PriceDisplay amount={lineTotal} size="sm" />
              </div>
            )
          })}
        </div>

        {/* Divider */}
        <div className="border-t border-border-subtle" />

        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Subtotal</span>
          <PriceDisplay amount={subtotal} size="sm" />
        </div>

        {/* Discount */}
        {quote.discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Discount</span>
            <span className="text-success text-sm">-{formatZAR(quote.discount)}</span>
          </div>
        )}

        {/* Delivery fee */}
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Delivery</span>
          <PriceDisplay amount={quote.deliveryFee} size="sm" />
        </div>

        {/* VAT */}
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">VAT (15%)</span>
          <PriceDisplay amount={vat} size="sm" />
        </div>

        {/* Divider */}
        <div className="border-t border-border-subtle" />

        {/* Total */}
        <div className="flex justify-between items-baseline">
          <span className="text-text-primary font-semibold">Total</span>
          <PriceDisplay amount={total} size="lg" />
        </div>

        {/* Divider */}
        <div className="border-t border-border-subtle" />

        {/* Deposit & balance */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Deposit required (30%)</span>
            <PriceDisplay amount={deposit} size="sm" />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Balance remaining</span>
            <PriceDisplay amount={balance} size="sm" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
