import { useQuoteStore } from '@/stores/quoteStore'
import { useAuthStore } from '@/stores/authStore'
import type { QuoteStatus } from '@/types'
import { cn } from '@/lib/utils'

const STATUSES: QuoteStatus[] = [
  'Draft',
  'Sent',
  'Negotiating',
  'Accepted',
  'TermsAccepted',
  'DepositPaid',
  'Confirmed',
]

const FULL_LABELS: Record<QuoteStatus, string> = {
  Draft: 'Draft',
  Sent: 'Sent',
  Negotiating: 'Negotiating',
  Accepted: 'Accepted',
  TermsAccepted: 'Terms Accepted',
  DepositPaid: 'Deposit Paid',
  Confirmed: 'Confirmed',
}

const SHORT_LABELS: Record<QuoteStatus, string> = {
  Draft: 'Draft',
  Sent: 'Sent',
  Negotiating: 'Negot.',
  Accepted: 'Accept',
  TermsAccepted: 'Terms',
  DepositPaid: 'Deposit',
  Confirmed: 'Done',
}

interface StatusBarProps {
  quoteId: string
}

export function StatusBar({ quoteId }: StatusBarProps) {
  const quote = useQuoteStore((s) => s.quotes.find((q) => q.id === quoteId))
  const setStatus = useQuoteStore((s) => s.setStatus)
  const role = useAuthStore((s) => s.currentUser?.role)

  if (!quote) return null

  const currentIndex = STATUSES.indexOf(quote.status)

  function handleStepClick(status: QuoteStatus) {
    if (role !== 'staff') return
    setStatus(quoteId, status)
  }

  return (
    <div className="w-full bg-surface-raised rounded-xl border border-border-subtle px-4 py-4 sm:px-6 sm:py-5 overflow-x-auto">
      <div className="flex items-center min-w-[540px]">
        {STATUSES.map((status, index) => {
          const isPast = index < currentIndex
          const isCurrent = index === currentIndex
          const isFuture = index > currentIndex
          const isClickable = role === 'staff'
          const isLast = index === STATUSES.length - 1

          return (
            <div key={status} className="flex items-center flex-1 last:flex-none">
              {/* Step dot + label */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => handleStepClick(status)}
                  className={cn(
                    'w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all flex items-center justify-center flex-shrink-0',
                    isPast && 'bg-success border-success',
                    isCurrent && 'bg-accent border-accent ring-2 ring-accent/30',
                    isFuture && 'bg-transparent border-text-muted',
                    isClickable && 'hover:ring-2 hover:ring-accent/20 cursor-pointer',
                    !isClickable && 'cursor-default',
                  )}
                  aria-label={`Status: ${status}`}
                >
                  {isPast && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {isCurrent && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </button>
                <span
                  className={cn(
                    'mt-2 text-xs text-center leading-tight whitespace-nowrap',
                    isPast && 'text-success',
                    isCurrent && 'text-accent font-semibold',
                    isFuture && 'text-text-muted',
                  )}
                >
                  <span className="hidden sm:inline">{FULL_LABELS[status]}</span>
                  <span className="sm:hidden">{SHORT_LABELS[status]}</span>
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    'h-0.5 flex-1 mx-1 sm:mx-2 mb-6',
                    index < currentIndex ? 'bg-success' : 'bg-border-subtle',
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
