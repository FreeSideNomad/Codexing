import { CreditCard, Building2, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PaymentMethod } from '@/types'

interface PaymentMethodSelectorProps {
  selected: PaymentMethod
  onSelect: (method: PaymentMethod) => void
}

const methods: { key: PaymentMethod; icon: typeof CreditCard; title: string; description: string }[] = [
  { key: 'card', icon: CreditCard, title: 'Pay by Card', description: 'Visa, Mastercard accepted' },
  { key: 'eft', icon: Building2, title: 'Bank Transfer', description: 'Manual EFT payment' },
  { key: 'account', icon: Wallet, title: 'Charge to Account', description: 'For account holders' },
]

export function PaymentMethodSelector({ selected, onSelect }: PaymentMethodSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {methods.map(({ key, icon: Icon, title, description }) => (
        <button
          key={key}
          type="button"
          onClick={() => onSelect(key)}
          className={cn(
            'flex flex-col items-center gap-3 rounded-xl border bg-surface-raised p-6 text-center transition-all cursor-pointer',
            selected === key
              ? 'border-accent shadow-[0_0_16px_rgba(0,112,243,0.15)]'
              : 'border-border-subtle hover:border-border-subtle/80',
          )}
        >
          <Icon
            className={cn(
              'h-8 w-8 transition-colors',
              selected === key ? 'text-accent' : 'text-text-secondary',
            )}
          />
          <div>
            <p className={cn(
              'font-medium text-sm',
              selected === key ? 'text-accent' : 'text-text-primary',
            )}>
              {title}
            </p>
            <p className="text-xs text-text-muted mt-1">{description}</p>
          </div>
        </button>
      ))}
    </div>
  )
}
