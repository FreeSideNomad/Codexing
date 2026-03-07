import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { cn } from '@/lib/utils'

interface PathCardProps {
  icon: ReactNode
  title: string
  description: string
  linkTo: string
  accentColor?: string
}

export function PathCard({ icon, title, description, linkTo, accentColor = 'text-accent' }: PathCardProps) {
  return (
    <Link
      to={linkTo}
      className={cn(
        'group flex flex-col rounded-xl border border-border-subtle bg-surface-raised p-6',
        'transition-all duration-300',
        'hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1',
      )}
    >
      <div className={cn('mb-4', accentColor)}>
        <div className="h-12 w-12">{icon}</div>
      </div>

      <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>

      <p className="text-text-secondary text-sm leading-relaxed mb-6 flex-1">{description}</p>

      <span className="inline-flex items-center text-sm font-medium text-accent group-hover:translate-x-1 transition-transform duration-200">
        Get Started <span className="ml-1">&rarr;</span>
      </span>
    </Link>
  )
}
