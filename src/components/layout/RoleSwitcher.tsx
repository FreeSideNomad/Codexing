import { LogOut } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { UserRole } from '@/types'

const roles: { value: UserRole; label: string }[] = [
  { value: 'client', label: 'Client' },
  { value: 'staff', label: 'Staff' },
]

export function RoleSwitcher() {
  const currentUser = useAuthStore((s) => s.currentUser)
  const switchRole = useAuthStore((s) => s.switchRole)
  const logout = useAuthStore((s) => s.logout)

  if (!currentUser) return null

  return (
    <div className="flex items-center gap-3">
      {/* User name and role badge */}
      <div className="hidden items-center gap-2 sm:flex">
        <span className="text-sm text-text-secondary">{currentUser.name}</span>
        <Badge variant={currentUser.role === 'staff' ? 'accent' : 'success'}>
          {currentUser.role}
        </Badge>
      </div>

      {/* Role toggle */}
      <div className="flex rounded-lg border border-border-subtle bg-surface p-0.5">
        {roles.map((role) => (
          <button
            key={role.value}
            onClick={() => switchRole(role.value)}
            className={cn(
              'rounded-md px-3 py-1 text-xs font-medium transition-colors',
              currentUser.role === role.value
                ? 'bg-accent text-white'
                : 'text-text-muted hover:text-text-primary',
            )}
          >
            {role.label}
          </button>
        ))}
      </div>

      {/* Log out */}
      <Button variant="ghost" size="sm" onClick={logout} className="gap-1.5">
        <LogOut className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Log out</span>
      </Button>
    </div>
  )
}
