import type { KitItem } from '@/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PriceDisplay } from './PriceDisplay'
import { cn } from '@/lib/utils'

interface EquipmentCardProps {
  item: KitItem
  onAdd?: () => void
  onRemove?: () => void
  selected?: boolean
  compact?: boolean
}

const conditionVariant: Record<KitItem['condition'], 'success' | 'accent' | 'default' | 'warning'> = {
  New: 'success',
  Excellent: 'accent',
  Good: 'default',
  Fair: 'warning',
}

export function EquipmentCard({ item, onAdd, onRemove, selected, compact }: EquipmentCardProps) {
  if (compact) {
    return (
      <Card
        className={cn(
          'flex overflow-hidden transition-all',
          selected && 'border-accent ring-1 ring-accent/40',
        )}
      >
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-24 w-24 object-cover flex-shrink-0"
        />
        <div className="flex flex-1 items-center justify-between px-4 py-2 min-w-0">
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{item.name}</p>
            <p className="text-xs text-text-secondary truncate">
              {item.brand} {item.model}
            </p>
            <PriceDisplay amount={item.dailyRate} size="sm" />
            <span className="text-xs text-text-muted"> /day</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            {onAdd && (
              <Button size="sm" onClick={onAdd}>
                Add
              </Button>
            )}
            {onRemove && (
              <Button size="sm" variant="danger" onClick={onRemove}>
                Remove
              </Button>
            )}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        'overflow-hidden transition-all',
        selected && 'border-accent ring-1 ring-accent/40',
      )}
    >
      <img
        src={item.imageUrl}
        alt={item.name}
        className="h-48 w-full object-cover"
      />
      <div className="px-4 py-4 space-y-3">
        <div>
          <h4 className="text-base font-semibold text-text-primary">{item.name}</h4>
          <p className="text-sm text-text-secondary">
            {item.brand} {item.model}
          </p>
        </div>

        <div className="flex items-baseline gap-1">
          <PriceDisplay amount={item.dailyRate} size="md" />
          <span className="text-xs text-text-muted">/day</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant={conditionVariant[item.condition]}>{item.condition}</Badge>
          <Badge variant="muted">{item.category}</Badge>
        </div>

        {(onAdd || onRemove) && (
          <div className="flex gap-2 pt-1">
            {onAdd && (
              <Button size="sm" className="flex-1" onClick={onAdd}>
                Add
              </Button>
            )}
            {onRemove && (
              <Button size="sm" variant="danger" className="flex-1" onClick={onRemove}>
                Remove
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
