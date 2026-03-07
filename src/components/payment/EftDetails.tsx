import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatZAR } from '@/components/shared/PriceDisplay'

interface EftDetailsProps {
  depositAmount: number
  quoteNumber: string
  onConfirm: () => void
}

const bankDetails = [
  { label: 'Bank', value: 'First National Bank' },
  { label: 'Account Name', value: 'Visual Impact South Africa (Pty) Ltd' },
  { label: 'Account Number', value: '62845901234' },
  { label: 'Branch Code', value: '250655' },
]

export function EftDetails({ depositAmount, quoteNumber, onConfirm }: EftDetailsProps) {
  const [copied, setCopied] = useState(false)

  function handleCopyReference() {
    navigator.clipboard.writeText(quoteNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        {bankDetails.map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center rounded-lg bg-surface-overlay px-4 py-3">
            <span className="text-sm text-text-secondary">{label}</span>
            <span className="text-sm text-text-primary font-medium">{value}</span>
          </div>
        ))}

        {/* Reference with copy button */}
        <div className="flex justify-between items-center rounded-lg bg-surface-overlay px-4 py-3">
          <span className="text-sm text-text-secondary">Reference</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-primary font-mono font-medium">{quoteNumber}</span>
            <button
              type="button"
              onClick={handleCopyReference}
              className="inline-flex items-center gap-1 rounded-md bg-surface-raised px-2 py-1 text-xs text-text-secondary hover:text-accent transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Amount due */}
        <div className="flex justify-between items-center rounded-lg bg-surface-overlay px-4 py-3 border border-accent/30">
          <span className="text-sm text-text-secondary">Amount Due</span>
          <span className="text-sm text-accent font-semibold">{formatZAR(depositAmount)}</span>
        </div>
      </div>

      <Button size="lg" className="w-full" onClick={onConfirm}>
        I've Made the Payment
      </Button>
    </div>
  )
}
