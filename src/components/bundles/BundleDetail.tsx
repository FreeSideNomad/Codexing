import type { Bundle, BundleTier } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EquipmentCard } from '@/components/shared/EquipmentCard'
import { PriceDisplay } from '@/components/shared/PriceDisplay'
import { ArrowLeft } from 'lucide-react'

interface BundleDetailProps {
  bundle: Bundle
  onSelect: () => void
  onClose: () => void
}

const tierVariant: Record<BundleTier, 'default' | 'accent' | 'warning'> = {
  Essential: 'default',
  Professional: 'accent',
  Premium: 'warning',
}

const shootTypeLabel: Record<string, string> = {
  MusicVideo: 'Music Video',
}

function formatShootType(shootType: string): string {
  return shootTypeLabel[shootType] ?? shootType
}

export function BundleDetail({ bundle, onSelect, onClose }: BundleDetailProps) {
  const totalDailyRate = bundle.items.reduce((sum, item) => sum + item.dailyRate, 0)

  return (
    <div className="space-y-8">
      {/* Back link */}
      <button
        onClick={onClose}
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Bundles
      </button>

      {/* Hero image */}
      <img
        src={bundle.imageUrl}
        alt={bundle.name}
        className="w-full h-64 sm:h-80 object-cover rounded-xl"
      />

      {/* Bundle info */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-text-primary">{bundle.name}</h2>

        <div className="flex flex-wrap gap-2">
          <Badge variant="muted">{formatShootType(bundle.shootType)}</Badge>
          <Badge variant={tierVariant[bundle.tier]}>{bundle.tier}</Badge>
        </div>

        <p className="text-text-secondary">{bundle.description}</p>

        <div className="flex items-center gap-4">
          <div className="flex items-baseline gap-1">
            <span className="text-sm text-text-muted">Total daily rate:</span>
            <PriceDisplay amount={totalDailyRate} size="lg" />
            <span className="text-sm text-text-muted">/day</span>
          </div>
          <span className="text-sm text-text-muted">
            {bundle.items.length} items
          </span>
        </div>
      </div>

      {/* Included equipment */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">Included Equipment</h3>
        <div className="space-y-3">
          {bundle.items.map((item) => (
            <EquipmentCard key={item.id} item={item} compact />
          ))}
        </div>
      </div>

      {/* Action button */}
      <div className="flex gap-4 pt-4">
        <Button size="lg" onClick={onSelect} className="flex-1 sm:flex-none">
          Select This Bundle
        </Button>
      </div>
    </div>
  )
}
