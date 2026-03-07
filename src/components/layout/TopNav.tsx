import { useState } from 'react'
import { NavLink } from 'react-router'
import { Clapperboard, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RoleSwitcher } from './RoleSwitcher'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/bundles', label: 'Bundles' },
  { to: '/orders', label: 'Orders' },
]

export function TopNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

        {/* Nav Links — desktop */}
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

        {/* Right side: Role Switcher + Mobile menu button */}
        <div className="flex items-center gap-2">
          <RoleSwitcher />
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="sm:hidden p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-overlay transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <nav className="sm:hidden border-t border-border-subtle bg-surface-raised px-4 py-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  'block px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'text-accent bg-surface-overlay'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-overlay',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
