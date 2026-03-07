import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useCatalogStore } from '@/stores/catalogStore'
import { useRequestStore } from '@/stores/requestStore'
import { useQuoteStore } from '@/stores/quoteStore'
import { useAuthStore } from '@/stores/authStore'
import { EquipmentCard } from '@/components/shared/EquipmentCard'
import { Button } from '@/components/ui/button'
import type { EquipmentCategory } from '@/types'

const categories: Array<EquipmentCategory | 'All'> = [
  'All',
  'Camera',
  'Lens',
  'Audio',
  'Lighting',
  'Support',
  'Accessories',
]

export function CatalogBrowser() {
  const [activeCategory, setActiveCategory] = useState<EquipmentCategory | 'All'>('All')
  const navigate = useNavigate()

  const equipment = useCatalogStore((s) => s.equipment)
  const draftItems = useRequestStore((s) => s.draftItems)
  const addDraftItem = useRequestStore((s) => s.addDraftItem)
  const removeDraftItem = useRequestStore((s) => s.removeDraftItem)
  const shootType = useRequestStore((s) => s.draftShootType)
  const startDate = useRequestStore((s) => s.draftStartDate)
  const endDate = useRequestStore((s) => s.draftEndDate)
  const location = useRequestStore((s) => s.draftLocation)
  const submitRequest = useRequestStore((s) => s.submitRequest)
  const clearDraft = useRequestStore((s) => s.clearDraft)
  const createQuote = useQuoteStore((s) => s.createQuote)
  const currentUser = useAuthStore((s) => s.currentUser)

  const selectedIds = new Set(draftItems.map((i) => i.id))

  const filteredEquipment =
    activeCategory === 'All'
      ? equipment
      : equipment.filter((e) => e.category === activeCategory)

  const isFormValid = shootType !== '' && startDate !== '' && endDate !== '' && location !== ''

  function handleSubmit() {
    if (!currentUser) return

    const requestId = submitRequest(currentUser.id)

    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffMs = end.getTime() - start.getTime()
    const days = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))

    const quoteId = createQuote(requestId, draftItems, days)

    clearDraft()

    navigate(`/workspace/${quoteId}`)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          <span className="font-semibold text-text-primary">{draftItems.length}</span>{' '}
          {draftItems.length === 1 ? 'item' : 'items'} selected
        </p>
      </div>

      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-accent text-white'
                : 'bg-surface-overlay text-text-secondary hover:text-text-primary hover:bg-surface-raised'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Equipment grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredEquipment.map((item) => {
          const isSelected = selectedIds.has(item.id)
          return (
            <EquipmentCard
              key={item.id}
              item={item}
              selected={isSelected}
              onAdd={isSelected ? undefined : () => addDraftItem(item)}
              onRemove={isSelected ? () => removeDraftItem(item.id) : undefined}
            />
          )
        })}
      </div>

      {/* Submit button */}
      <div className="pt-4">
        <Button
          size="lg"
          className="w-full"
          disabled={!isFormValid}
          onClick={handleSubmit}
        >
          Submit Request
        </Button>
        {!isFormValid && (
          <p className="text-xs text-text-muted mt-2 text-center">
            Fill in shoot type, dates, and location to submit
          </p>
        )}
      </div>
    </div>
  )
}
