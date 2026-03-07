import { Link } from 'react-router'
import { useAuthStore } from '@/stores/authStore'
import { PathCard } from '@/components/landing/PathCard'
import { IncomingRequestList } from '@/components/landing/IncomingRequestList'
import { Send, History, Package, ArrowRight } from 'lucide-react'

function ClientLanding() {
  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-3 bg-gradient-to-r from-text-primary via-accent to-text-primary bg-clip-text text-transparent">
          Your Rental Kit Workspace
        </h1>
        <p className="text-lg text-text-secondary">
          Professional equipment for your next production
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PathCard
          icon={<Send className="h-12 w-12" />}
          title="New Request"
          description="Tell us about your shoot and we'll prepare the perfect kit, or browse our catalog to build your own."
          linkTo="/request/new"
          accentColor="text-accent"
        />
        <PathCard
          icon={<History className="h-12 w-12" />}
          title="From Previous Order"
          description="Loved your last setup? Duplicate a previous order and modify it for your new project."
          linkTo="/orders"
          accentColor="text-success"
        />
        <PathCard
          icon={<Package className="h-12 w-12" />}
          title="Browse Bundles"
          description="Explore our curated equipment packages organized by shoot type and production level."
          linkTo="/bundles"
          accentColor="text-warning"
        />
      </div>

      {/* Demo workspace link */}
      <div className="text-center mt-10 pt-8 border-t border-border-subtle">
        <p className="text-text-muted text-sm mb-2">Or explore our demo workspace:</p>
        <Link
          to="/workspace/qt-demo-001"
          className="inline-flex items-center gap-1.5 text-accent hover:text-accent-hover font-medium transition-colors"
        >
          View Demo Quote
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}

function StaffLanding() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <IncomingRequestList />
    </div>
  )
}

export function LandingPage() {
  const role = useAuthStore((s) => s.currentUser?.role)

  if (role === 'staff') {
    return <StaffLanding />
  }

  return <ClientLanding />
}
