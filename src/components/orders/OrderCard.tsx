import { Link } from 'react-router'
import type { PastOrder } from '@/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PriceDisplay } from '@/components/shared/PriceDisplay'

interface OrderCardProps {
  order: PastOrder
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function truncatedItemList(items: PastOrder['items']): string {
  if (items.length === 0) return 'No items'
  const shown = items.slice(0, 3).map((i) => i.name)
  const remaining = items.length - 3
  if (remaining > 0) {
    return `${shown.join(', ')}, +${remaining} more`
  }
  return shown.join(', ')
}

export function OrderCard({ order }: OrderCardProps) {
  const statusVariant = order.status === 'Completed' ? 'success' : 'danger'

  return (
    <Card className="bg-surface-raised border-border-subtle p-5 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-text-primary truncate">
            {order.projectName}
          </h3>
          <p className="text-sm text-text-secondary">{formatDate(order.date)}</p>
        </div>
        <Badge variant={statusVariant}>{order.status}</Badge>
      </div>

      <p className="text-sm text-text-secondary">
        {order.items.length} items &middot; {order.daysRented} days
      </p>

      <p className="text-sm text-text-muted truncate">
        {truncatedItemList(order.items)}
      </p>

      <div className="flex items-center justify-between pt-1">
        <PriceDisplay amount={order.total} size="md" />
        <Link to={`/orders/${order.id}/reorder`}>
          <Button variant="default" size="sm">
            Reorder
          </Button>
        </Link>
      </div>
    </Card>
  )
}
