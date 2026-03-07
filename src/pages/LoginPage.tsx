import { Clapperboard, User, Briefcase } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { Card } from '@/components/ui/card'

export function LoginPage() {
  const login = useAuthStore((s) => s.login)

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <Card className="w-full max-w-md p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Clapperboard className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-accent">Visual Impact</span>{' '}
            <span className="text-text-muted">SA</span>
          </h1>
          <p className="mt-2 text-sm text-text-muted">Workspace Prototype</p>
        </div>

        {/* Role buttons */}
        <div className="space-y-4">
          <button
            onClick={() => login('client')}
            className="group flex w-full items-start gap-4 rounded-xl border border-border-subtle bg-surface p-4 text-left transition-all hover:border-accent/50 hover:bg-surface-overlay"
          >
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success/10">
              <User className="h-5 w-5 text-success" />
            </div>
            <div>
              <span className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">
                Enter as Client
              </span>
              <p className="mt-1 text-xs text-text-muted">
                Browse equipment bundles, submit rental requests, review quotes, and manage your
                orders.
              </p>
            </div>
          </button>

          <button
            onClick={() => login('staff')}
            className="group flex w-full items-start gap-4 rounded-xl border border-border-subtle bg-surface p-4 text-left transition-all hover:border-accent/50 hover:bg-surface-overlay"
          >
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
              <Briefcase className="h-5 w-5 text-accent" />
            </div>
            <div>
              <span className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">
                Enter as Staff
              </span>
              <p className="mt-1 text-xs text-text-muted">
                Build custom quotes, manage rental requests, configure kit lists, and track order
                status.
              </p>
            </div>
          </button>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-text-muted">
          No authentication required. Select a role to explore the workspace.
        </p>
      </Card>
    </div>
  )
}
