import { useState } from 'react'
import { Package } from 'lucide-react'
import { useQuoteStore } from '@/stores/quoteStore'
import { useAuthStore } from '@/stores/authStore'
import { useCatalogStore } from '@/stores/catalogStore'
import { useChatStore } from '@/stores/chatStore'
import { PriceDisplay, formatZAR } from '@/components/shared/PriceDisplay'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
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
  const addLineItem = useQuoteStore((s) => s.addLineItem)
  const updateLineItem = useQuoteStore((s) => s.updateLineItem)
  const currentUser = useAuthStore((s) => s.currentUser)
  const allEquipment = useCatalogStore((s) => s.equipment)
  const getEquipmentById = useCatalogStore((s) => s.getEquipmentById)
  const sendMessage = useChatStore((s) => s.sendMessage)

  const [selectedEquipmentId, setSelectedEquipmentId] = useState('')
  const [editingRates, setEditingRates] = useState<Record<string, string>>({})

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

  // Equipment available for adding (not already in the quote)
  const existingItemIds = new Set(quote.items.map((i) => i.kitItemId))
  const availableEquipment = allEquipment.filter((e) => !existingItemIds.has(e.id))
  const equipmentOptions = availableEquipment.map((e) => ({
    value: e.id,
    label: `${e.name} — ${formatZAR(e.dailyRate)}/day`,
  }))

  // Get default days from first line item or default to 1
  const defaultDays = quote.items.length > 0 ? quote.items[0].days : 1

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

  function handleAddEquipment() {
    if (!selectedEquipmentId) return
    const equipment = getEquipmentById(selectedEquipmentId)
    if (!equipment) return

    const lineItem: QuoteLineItem = {
      kitItemId: equipment.id,
      name: equipment.name,
      category: equipment.category,
      dailyRate: equipment.dailyRate,
      quantity: 1,
      days: defaultDays,
    }

    addLineItem(quoteId, lineItem)
    setSelectedEquipmentId('')
  }

  function handleRateEdit(kitItemId: string, value: string) {
    setEditingRates((prev) => ({ ...prev, [kitItemId]: value }))
  }

  function handleRateCommit(kitItemId: string) {
    const value = editingRates[kitItemId]
    if (value === undefined) return
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0) {
      updateLineItem(quoteId, kitItemId, { dailyRate: numValue })
    }
    setEditingRates((prev) => {
      const next = { ...prev }
      delete next[kitItemId]
      return next
    })
  }

  function handleRateKeyDown(e: React.KeyboardEvent, kitItemId: string) {
    if (e.key === 'Enter') {
      handleRateCommit(kitItemId)
    }
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
          <div className="flex flex-col items-center justify-center py-10 space-y-3">
            <Package className="h-10 w-10 text-text-muted" />
            <p className="text-text-muted text-sm text-center">
              No items in kit yet. Add equipment to get started.
            </p>
          </div>
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
                  const isEditingRate = editingRates[item.kitItemId] !== undefined

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
                        <div className="text-text-secondary text-xs mt-1 flex items-center gap-1">
                          {role === 'staff' ? (
                            <>
                              <span>R</span>
                              <input
                                type="number"
                                min="0"
                                step="50"
                                className="w-20 rounded border border-border-subtle bg-surface-overlay px-1.5 py-0.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent/50"
                                value={
                                  isEditingRate
                                    ? editingRates[item.kitItemId]
                                    : item.dailyRate
                                }
                                onChange={(e) => handleRateEdit(item.kitItemId, e.target.value)}
                                onFocus={() => {
                                  if (!isEditingRate) {
                                    setEditingRates((prev) => ({
                                      ...prev,
                                      [item.kitItemId]: String(item.dailyRate),
                                    }))
                                  }
                                }}
                                onBlur={() => handleRateCommit(item.kitItemId)}
                                onKeyDown={(e) => handleRateKeyDown(e, item.kitItemId)}
                              />
                              <span>x {item.quantity} x {item.days} day{item.days !== 1 ? 's' : ''}</span>
                            </>
                          ) : (
                            <span>
                              {formatZAR(item.dailyRate)} x {item.quantity} x {item.days} day{item.days !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
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

        {/* Staff: Add Equipment section */}
        {role === 'staff' && (
          <div className="pt-3 border-t border-border-subtle">
            <p className="text-sm font-medium text-text-secondary mb-2">Add Equipment</p>
            <div className="flex gap-2">
              <div className="flex-1">
                <Select
                  options={equipmentOptions}
                  value={selectedEquipmentId}
                  onChange={(e) => setSelectedEquipmentId(e.target.value)}
                />
              </div>
              <Button
                size="sm"
                disabled={!selectedEquipmentId}
                onClick={handleAddEquipment}
              >
                Add
              </Button>
            </div>
            {availableEquipment.length === 0 && (
              <p className="text-text-muted text-xs mt-2">All equipment has been added.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
