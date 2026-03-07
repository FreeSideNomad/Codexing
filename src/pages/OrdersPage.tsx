import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { useCatalogStore } from '@/stores/catalogStore'
import { OrderCard } from '@/components/orders/OrderCard'

export function OrdersPage() {
  const pastOrders = useCatalogStore((s) => s.pastOrders)

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-text-primary">Previous Orders</h1>
        <p className="text-text-secondary mt-1">
          Reorder from your rental history
        </p>
      </div>

      {pastOrders.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <p className="text-lg text-text-secondary">
            You haven't rented with us yet.
          </p>
          <p className="text-sm text-text-muted">
            Start with a{' '}
            <Link to="/request/new" className="text-accent hover:underline">
              new request
            </Link>{' '}
            or browse our{' '}
            <Link to="/bundles" className="text-accent hover:underline">
              bundles
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pastOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}
