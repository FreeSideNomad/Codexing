import type { Bundle, BundleTier } from '@/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PriceDisplay } from '@/components/shared/PriceDisplay'

interface BundleCardProps {
  bundle: Bundle
  onClick: () => void
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

export function BundleCard({ bundle, onClick }: BundleCardProps) {
  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all hover:border-accent/60 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/10"
      onClick={onClick}
    >
      <img
        src={bundle.imageUrl}
        alt={bundle.name}
        className="h-[200px] w-full object-cover rounded-t-xl"
      />
      <div className="px-4 py-4 space-y-3">
        <h3 className="text-lg font-semibold text-text-primary">{bundle.name}</h3>

        <div className="flex flex-wrap gap-2">
          <Badge variant="muted">{formatShootType(bundle.shootType)}</Badge>
          <Badge variant={tierVariant[bundle.tier]}>{bundle.tier}</Badge>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-xs text-text-muted">from</span>
          <PriceDisplay amount={bundle.startingDailyRate} size="md" />
          <span className="text-xs text-text-muted">/day</span>
        </div>

        <p className="text-sm text-text-secondary">{bundle.items.length} items</p>

        <p className="text-sm text-text-muted line-clamp-2">{bundle.description}</p>
      </div>
    </Card>
  )
}
