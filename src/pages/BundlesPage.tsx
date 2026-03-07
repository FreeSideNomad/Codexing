import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import type { Bundle } from '@/types'
import { useQuoteStore } from '@/stores/quoteStore'
import { BundleGrid } from '@/components/bundles/BundleGrid'
import { BundleDetail } from '@/components/bundles/BundleDetail'

export function BundlesPage() {
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null)
  const navigate = useNavigate()
  const createQuote = useQuoteStore((s) => s.createQuote)

  function handleSelectBundle(bundle: Bundle) {
    const quoteId = createQuote('bundle-' + bundle.id, bundle.items, 1)
    navigate(`/workspace/${quoteId}`)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Back link — only shown when browsing (detail has its own back) */}
      {!selectedBundle && (
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      )}

      {/* Page heading */}
      {!selectedBundle && (
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Equipment Bundles</h1>
          <p className="text-text-secondary mt-1">
            Curated packages for every production
          </p>
        </div>
      )}

      {/* Content: browsing or detail view */}
      {selectedBundle ? (
        <BundleDetail
          bundle={selectedBundle}
          onSelect={() => handleSelectBundle(selectedBundle)}
          onClose={() => setSelectedBundle(null)}
        />
      ) : (
        <BundleGrid onSelectBundle={(bundle) => setSelectedBundle(bundle)} />
      )}
    </div>
  )
}
