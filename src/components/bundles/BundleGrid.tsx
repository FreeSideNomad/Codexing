import { useState } from 'react'
import type { Bundle, ShootType, BundleTier } from '@/types'
import { useCatalogStore } from '@/stores/catalogStore'
import { BundleCard } from './BundleCard'
import { cn } from '@/lib/utils'

interface BundleGridProps {
  onSelectBundle: (bundle: Bundle) => void
}

type ShootTypeFilter = 'All' | ShootType
type TierFilter = 'All Tiers' | BundleTier

const shootTypeOptions: { value: ShootTypeFilter; label: string }[] = [
  { value: 'All', label: 'All' },
  { value: 'Documentary', label: 'Documentary' },
  { value: 'Commercial', label: 'Commercial' },
  { value: 'Event', label: 'Event' },
  { value: 'MusicVideo', label: 'Music Video' },
  { value: 'Corporate', label: 'Corporate' },
]

const tierOptions: { value: TierFilter; label: string }[] = [
  { value: 'All Tiers', label: 'All Tiers' },
  { value: 'Essential', label: 'Essential' },
  { value: 'Professional', label: 'Professional' },
  { value: 'Premium', label: 'Premium' },
]

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
        active
          ? 'bg-accent text-white'
          : 'bg-surface-overlay text-text-secondary hover:text-text-primary hover:bg-surface-raised border border-border-subtle',
      )}
    >
      {label}
    </button>
  )
}

export function BundleGrid({ onSelectBundle }: BundleGridProps) {
  const bundles = useCatalogStore((s) => s.bundles)
  const [shootTypeFilter, setShootTypeFilter] = useState<ShootTypeFilter>('All')
  const [tierFilter, setTierFilter] = useState<TierFilter>('All Tiers')

  const filtered = bundles.filter((b) => {
    if (shootTypeFilter !== 'All' && b.shootType !== shootTypeFilter) return false
    if (tierFilter !== 'All Tiers' && b.tier !== tierFilter) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {shootTypeOptions.map((opt) => (
            <FilterPill
              key={opt.value}
              label={opt.label}
              active={shootTypeFilter === opt.value}
              onClick={() => setShootTypeFilter(opt.value)}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {tierOptions.map((opt) => (
            <FilterPill
              key={opt.value}
              label={opt.label}
              active={tierFilter === opt.value}
              onClick={() => setTierFilter(opt.value)}
            />
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((bundle) => (
            <BundleCard
              key={bundle.id}
              bundle={bundle}
              onClick={() => onSelectBundle(bundle)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-text-muted text-lg">No bundles match your filters</p>
        </div>
      )}
    </div>
  )
}
