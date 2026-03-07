interface PriceDisplayProps {
  amount: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const formatter = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export function PriceDisplay({ amount, size = 'md', className }: PriceDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl font-semibold',
  }
  return <span className={`${sizeClasses[size]} text-text-primary ${className ?? ''}`}>{formatter.format(amount)}</span>
}

export function formatZAR(amount: number): string {
  return formatter.format(amount)
}
