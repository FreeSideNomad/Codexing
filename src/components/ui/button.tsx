import { type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: 'sm' | 'md' | 'lg'
}

const variants: Record<ButtonVariant, string> = {
  default: 'bg-accent text-white hover:bg-accent-hover',
  secondary: 'bg-surface-overlay text-text-primary hover:bg-surface-raised',
  outline: 'border border-border-subtle text-text-primary hover:bg-surface-overlay',
  ghost: 'text-text-secondary hover:text-text-primary hover:bg-surface-overlay',
  danger: 'bg-danger text-white hover:bg-red-600',
}

const sizes: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({ variant = 'default', size = 'md', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}
