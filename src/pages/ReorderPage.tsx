import { useState, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import type { KitItem } from '@/types'
import { useCatalogStore } from '@/stores/catalogStore'
import { useQuoteStore } from '@/stores/quoteStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { EquipmentCard } from '@/components/shared/EquipmentCard'
import { PriceDisplay } from '@/components/shared/PriceDisplay'

function toDateInputValue(date: Date): string {
  return date.toISOString().split('T')[0]
}

function daysBetween(startStr: string, endStr: string): number {
  const start = new Date(startStr)
  const end = new Date(endStr)
  const diff = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
  return diff
}

const categoryOptions: { value: string; label: string }[] = [
  { value: 'Camera', label: 'Camera' },
  { value: 'Lens', label: 'Lens' },
  { value: 'Audio', label: 'Audio' },
  { value: 'Lighting', label: 'Lighting' },
  { value: 'Support', label: 'Support' },
  { value: 'Accessories', label: 'Accessories' },
]

export function ReorderPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const getOrderById = useCatalogStore((s) => s.getOrderById)
  const allEquipment = useCatalogStore((s) => s.equipment)
  const createQuote = useQuoteStore((s) => s.createQuote)

  const order = id ? getOrderById(id) : undefined

  // Date state
  const defaultStart = toDateInputValue(new Date())
  const defaultEnd = toDateInputValue(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
  const [startDate, setStartDate] = useState(defaultStart)
  const [endDate, setEndDate] = useState(defaultEnd)

  // Items state — start with a copy of order items
  const [items, setItems] = useState<KitItem[]>(() => order?.items ? [...order.items] : [])

  // Category filter for the catalog browser
  const [categoryFilter, setCategoryFilter] = useState<string>('')

  const days = daysBetween(startDate, endDate)
  const dailyRate = items.reduce((sum, item) => sum + item.dailyRate, 0)
  const estimatedTotal = dailyRate * days

  // Equipment available to add (not already in the kit)
  const itemIds = useMemo(() => new Set(items.map((i) => i.id)), [items])
  const availableEquipment = useMemo(() => {
    let filtered = allEquipment.filter((e) => !itemIds.has(e.id))
    if (categoryFilter) {
      filtered = filtered.filter((e) => e.category === categoryFilter)
    }
    return filtered
  }, [allEquipment, itemIds, categoryFilter])

  function handleRemoveItem(itemId: string) {
    setItems((prev) => prev.filter((i) => i.id !== itemId))
  }

  function handleAddItem(item: KitItem) {
    setItems((prev) => [...prev, item])
  }

  function handleSubmitReorder() {
    if (!order || items.length === 0) return
    const quoteId = createQuote('reorder-' + order.id, items, days)
    navigate(`/workspace/${quoteId}`)
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>
        <div className="text-center py-16 space-y-3">
          <h1 className="text-2xl font-bold text-text-primary">Order not found</h1>
          <p className="text-text-secondary">
            We couldn't find the order you're looking for.{' '}
            <Link to="/orders" className="text-accent hover:underline">
              View all orders
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <Link
        to="/orders"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-text-primary">
          Reorder: {order.projectName}
        </h1>
      </div>

      {/* Date Adjustment */}
      <Card className="p-5 space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">Rental Dates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <p className="text-sm text-text-muted">
          {days} day{days !== 1 ? 's' : ''} rental
        </p>
      </Card>

      {/* Kit Items */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">
          Kit Items ({items.length})
        </h2>
        {items.length === 0 ? (
          <p className="text-sm text-text-muted py-4">
            No items in your kit. Add equipment from the catalog below.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <EquipmentCard
                key={item.id}
                item={item}
                onRemove={() => handleRemoveItem(item.id)}
                compact
              />
            ))}
          </div>
        )}
      </div>

      {/* Add More Equipment */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">
          Add More Equipment
        </h2>
        <div className="max-w-xs">
          <Select
            label="Filter by Category"
            options={categoryOptions}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          />
        </div>
        {availableEquipment.length === 0 ? (
          <p className="text-sm text-text-muted py-4">
            {categoryFilter
              ? 'No more equipment available in this category.'
              : 'All equipment has been added to your kit.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableEquipment.map((item) => (
              <EquipmentCard
                key={item.id}
                item={item}
                onAdd={() => handleAddItem(item)}
                compact
              />
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <Card className="p-5 space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">Summary</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-text-primary">{items.length}</p>
            <p className="text-sm text-text-muted">Items</p>
          </div>
          <div>
            <PriceDisplay amount={dailyRate} size="lg" />
            <p className="text-sm text-text-muted">Daily Rate</p>
          </div>
          <div>
            <PriceDisplay amount={estimatedTotal} size="lg" />
            <p className="text-sm text-text-muted">
              Est. Total ({days} day{days !== 1 ? 's' : ''})
            </p>
          </div>
        </div>
      </Card>

      {/* Submit */}
      <div className="flex justify-end pb-8">
        <Button
          size="lg"
          onClick={handleSubmitReorder}
          disabled={items.length === 0}
        >
          Submit Reorder
        </Button>
      </div>
    </div>
  )
}
