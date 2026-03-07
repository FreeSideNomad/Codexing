import { useState } from 'react'
import { useQuoteStore } from '@/stores/quoteStore'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface RevisionHistoryProps {
  quoteId: string
}

export function RevisionHistory({ quoteId }: RevisionHistoryProps) {
  const quote = useQuoteStore((s) => s.quotes.find((q) => q.id === quoteId))
  const [isOpen, setIsOpen] = useState(false)

  if (!quote) return null

  const revisions = [...quote.revisions].reverse()
  const count = revisions.length

  return (
    <Card>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-surface-overlay/50 transition-colors rounded-xl"
      >
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-text-primary">Revision History</h3>
          {count > 0 && (
            <span className="inline-flex items-center justify-center rounded-full bg-accent/20 text-accent text-xs font-medium w-5 h-5">
              {count}
            </span>
          )}
        </div>
        {/* Chevron */}
        <svg
          className={cn(
            'w-5 h-5 text-text-muted transition-transform',
            isOpen && 'rotate-180',
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <CardContent className="pt-0">
          {count === 0 ? (
            <p className="text-text-muted text-sm py-2">No revisions yet.</p>
          ) : (
            <div className="space-y-3">
              {revisions.map((revision) => {
                const formattedTime = new Date(revision.timestamp).toLocaleString('en-ZA', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })

                return (
                  <div
                    key={revision.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-surface-overlay border border-border-subtle"
                  >
                    {/* Timeline dot */}
                    <div className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-text-primary">
                          {revision.actor}
                        </span>
                        <span className="text-xs text-text-muted flex-shrink-0">
                          {formattedTime}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary mt-0.5">
                        {revision.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
