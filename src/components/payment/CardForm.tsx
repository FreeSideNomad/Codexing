import { useState } from 'react'
import { CheckCircle, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formatZAR } from '@/components/shared/PriceDisplay'

interface CardFormProps {
  depositAmount: number
  onSuccess: () => void
}

export function CardForm({ depositAmount, onSuccess }: CardFormProps) {
  const [cardholderName, setCardholderName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [state, setState] = useState<'idle' | 'processing' | 'success'>('idle')

  function formatCardNumber(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(.{4})/g, '$1 ').trim()
  }

  function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    if (digits.length > 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`
    }
    return digits
  }

  function handleSubmit() {
    if (state !== 'idle') return
    setState('processing')
    setTimeout(() => {
      setState('success')
      setTimeout(() => {
        onSuccess()
      }, 800)
    }, 1500)
  }

  if (state === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <p className="text-xl font-semibold text-text-primary">Payment Successful!</p>
      </div>
    )
  }

  const isValid =
    cardholderName.trim().length > 0 &&
    cardNumber.replace(/\s/g, '').length === 16 &&
    expiry.length === 5 &&
    cvv.length === 3

  return (
    <div className="space-y-5">
      <Input
        label="Cardholder Name"
        placeholder="Name on card"
        value={cardholderName}
        onChange={(e) => setCardholderName(e.target.value)}
      />
      <Input
        label="Card Number"
        placeholder="0000 0000 0000 0000"
        value={cardNumber}
        maxLength={19}
        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Expiry"
          placeholder="MM/YY"
          value={expiry}
          maxLength={5}
          onChange={(e) => setExpiry(formatExpiry(e.target.value))}
        />
        <Input
          label="CVV"
          placeholder="123"
          value={cvv}
          maxLength={3}
          onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
        />
      </div>
      <Button
        size="lg"
        className="w-full mt-2"
        disabled={!isValid || state === 'processing'}
        onClick={handleSubmit}
      >
        {state === 'processing' ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </span>
        ) : (
          `Pay Deposit — ${formatZAR(depositAmount)}`
        )}
      </Button>
    </div>
  )
}
