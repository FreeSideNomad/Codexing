import { useState } from 'react'
import { CheckCircle, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { formatZAR } from '@/components/shared/PriceDisplay'

interface AccountChargeProps {
  depositAmount: number
  onSuccess: () => void
}

const AVAILABLE_CREDIT = 150_000

export function AccountCharge({ depositAmount, onSuccess }: AccountChargeProps) {
  const currentUser = useAuthStore((s) => s.currentUser)
  const [state, setState] = useState<'idle' | 'processing' | 'success'>('idle')

  const remainingCredit = AVAILABLE_CREDIT - depositAmount

  function handleCharge() {
    if (state !== 'idle') return
    setState('processing')
    setTimeout(() => {
      setState('success')
      setTimeout(() => {
        onSuccess()
      }, 800)
    }, 1000)
  }

  if (state === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <p className="text-xl font-semibold text-text-primary">Payment Successful!</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="flex justify-between items-center rounded-lg bg-surface-overlay px-4 py-3">
          <span className="text-sm text-text-secondary">Account Holder</span>
          <span className="text-sm text-text-primary font-medium">{currentUser?.name ?? 'N/A'}</span>
        </div>
        <div className="flex justify-between items-center rounded-lg bg-surface-overlay px-4 py-3">
          <span className="text-sm text-text-secondary">Company</span>
          <span className="text-sm text-text-primary font-medium">{currentUser?.company ?? 'N/A'}</span>
        </div>
        <div className="flex justify-between items-center rounded-lg bg-surface-overlay px-4 py-3">
          <span className="text-sm text-text-secondary">Available Credit</span>
          <span className="text-sm text-green-500 font-semibold">{formatZAR(AVAILABLE_CREDIT)}</span>
        </div>
        <div className="flex justify-between items-center rounded-lg bg-surface-overlay px-4 py-3 border border-accent/30">
          <span className="text-sm text-text-secondary">Deposit Amount</span>
          <span className="text-sm text-accent font-semibold">{formatZAR(depositAmount)}</span>
        </div>
        <div className="flex justify-between items-center rounded-lg bg-surface-overlay px-4 py-3">
          <span className="text-sm text-text-secondary">Remaining Credit</span>
          <span className="text-sm text-text-primary font-medium">{formatZAR(remainingCredit)}</span>
        </div>
      </div>

      <Button
        size="lg"
        className="w-full"
        disabled={state === 'processing'}
        onClick={handleCharge}
      >
        {state === 'processing' ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </span>
        ) : (
          'Charge Deposit to Account'
        )}
      </Button>
    </div>
  )
}
