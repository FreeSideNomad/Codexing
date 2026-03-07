import { useQuoteStore } from '@/stores/quoteStore'
import { useAuthStore } from '@/stores/authStore'
import { useCatalogStore } from '@/stores/catalogStore'
import { useChatStore } from '@/stores/chatStore'
import { PriceDisplay, formatZAR } from '@/components/shared/PriceDisplay'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import type { QuoteLineItem, EquipmentCategory } from '@/types'

interface KitPanelProps {
  quoteId: string
}

const categoryVariant: Record<EquipmentCategory, 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'muted'> = {
  Camera: 'accent',
  Lens: 'success',
  Audio: 'warning',
  Lighting: 'muted',
  Support: 'default',
  Accessories: 'danger',
}

export function KitPanel({ quoteId }: KitPanelProps) {
  const quote = useQuoteStore((s) => s.quotes.find((q) => q.id === quoteId))
  const removeLineItem = useQuoteStore((s) => s.removeLineItem)
  const currentUser = useAuthStore((s) => s.currentUser)
  const getEquipmentById = useCatalogStore((s) => s.getEquipmentById)
  const sendMessage = useChatStore((s) => s.sendMessage)

  if (!quote || !currentUser) return null

  const role = currentUser.role

  // Group items by category
  const grouped = quote.items.reduce<Record<string, QuoteLineItem[]>>((acc, item) => {
    const cat = item.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})

  const categories = Object.keys(grouped).sort()

  function handleRequestChange(item: QuoteLineItem) {
    sendMessage(quoteId, `I'd like to request a change for: ${item.name}`, {
      userId: currentUser!.id,
      name: currentUser!.name,
      role: currentUser!.role,
    })
  }

  function handleRemove(kitItemId: string) {
    removeLineItem(quoteId, kitItemId)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Kit Items</CardTitle>
          <span className="text-sm text-text-muted">
            {quote.items.length} item{quote.items.length !== 1 ? 's' : ''}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {categories.length === 0 && (
          <p className="text-text-muted text-sm py-4 text-center">No items in this quote yet.</p>
        )}

        {categories.map((category) => {
          const items = grouped[category]
          return (
            <div key={category}>
              {/* Category header */}
              <div className="flex items-center gap-2 mb-3">
                <Badge variant={categoryVariant[category as EquipmentCategory] ?? 'default'}>
                  {category}
                </Badge>
                <span className="text-xs text-text-muted">
                  {items.length} item{items.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Items in this category */}
              <div className="space-y-3">
                {items.map((item) => {
                  const lineTotal = item.dailyRate * item.quantity * item.days
                  const catalogItem = getEquipmentById(item.kitItemId)

                  return (
                    <div
                      key={item.kitItemId}
                      className="flex items-start gap-3 p-3 rounded-lg bg-surface-overlay border border-border-subtle"
                    >
                      {/* Image thumbnail (if available from catalog) */}
                      {catalogItem?.imageUrl && (
                        <img
                          src={catalogItem.imageUrl}
                          alt={item.name}
                          className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                        />
                      )}

                      {/* Item details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-text-primary text-sm font-medium truncate">
                          {item.name}
                        </p>
                        {catalogItem && (
                          <p className="text-text-muted text-xs">
                            {catalogItem.brand} {catalogItem.model}
                          </p>
                        )}
                        <p className="text-text-secondary text-xs mt-1">
                          {formatZAR(item.dailyRate)} x {item.quantity} x {item.days} day{item.days !== 1 ? 's' : ''}
                        </p>
                      </div>

                      {/* Line total + action */}
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <PriceDisplay amount={lineTotal} size="sm" />
                        {role === 'client' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRequestChange(item)}
                          >
                            Request Change
                          </Button>
                        )}
                        {role === 'staff' && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRemove(item.kitItemId)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Total item count at bottom */}
        {quote.items.length > 0 && (
          <div className="pt-3 border-t border-border-subtle">
            <p className="text-sm text-text-secondary">
              Total: {quote.items.length} item{quote.items.length !== 1 ? 's' : ''} in kit
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
