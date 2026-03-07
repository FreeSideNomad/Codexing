import type { QuoteStatus } from '@/types'
import { Badge } from '@/components/ui/badge'

const statusConfig: Record<QuoteStatus, { variant: 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'muted'; label: string }> = {
  Draft: { variant: 'muted', label: 'Draft' },
  Sent: { variant: 'default', label: 'Sent' },
  Negotiating: { variant: 'warning', label: 'Negotiating' },
  Accepted: { variant: 'success', label: 'Accepted' },
  TermsAccepted: { variant: 'success', label: 'Terms Accepted' },
  DepositPaid: { variant: 'accent', label: 'Deposit Paid' },
  Confirmed: { variant: 'success', label: 'Confirmed' },
}

interface StatusBadgeProps {
  status: QuoteStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]
  return <Badge variant={config.variant} className={className}>{config.label}</Badge>
}
