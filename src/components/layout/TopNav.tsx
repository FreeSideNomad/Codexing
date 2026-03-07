import { NavLink } from 'react-router'
import { Clapperboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RoleSwitcher } from './RoleSwitcher'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/bundles', label: 'Bundles' },
  { to: '/orders', label: 'Orders' },
]

export function TopNav() {
  return (
    <header className="bg-surface-raised border-b border-border-subtle">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Clapperboard className="h-6 w-6 text-accent" />
          <span className="text-lg font-bold tracking-tight">
            <span className="text-accent">Visual Impact</span>{' '}
            <span className="text-text-muted">SA</span>
          </span>
        </div>

        {/* Nav Links */}
        <nav className="hidden items-center gap-1 sm:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'text-accent border-b-2 border-accent'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-overlay',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Role Switcher */}
        <RoleSwitcher />
      </div>
    </header>
  )
}
