import { useRef } from 'react'
import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { RequestBriefForm } from '@/components/request/RequestBriefForm'
import { CatalogBrowser } from '@/components/request/CatalogBrowser'

export function NewRequestPage() {
  const catalogRef = useRef<HTMLDivElement>(null)

  function handleContinue() {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      {/* Page heading */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">New Rental Request</h1>
        <p className="text-text-secondary mt-1">
          Describe your shoot and browse our catalog to build the perfect kit.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Brief form — left / top */}
        <div className="lg:w-2/5 lg:flex-shrink-0">
          <div className="lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Shoot Brief</h2>
            <RequestBriefForm onContinue={handleContinue} />
          </div>
        </div>

        {/* Catalog — right / bottom */}
        <div className="lg:w-3/5" ref={catalogRef}>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Equipment Catalog</h2>
          <CatalogBrowser />
        </div>
      </div>
    </div>
  )
}
