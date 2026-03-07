import { rentalTerms } from '@/data/terms'

export function TermsDisplay() {
  return (
    <div className="rounded-xl bg-surface-raised p-6 space-y-6">
      <h2 className="text-lg font-semibold text-text-primary">Terms & Conditions</h2>
      <ol className="space-y-5">
        {rentalTerms.map((term, index) => (
          <li key={index} className="flex gap-4">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-surface-overlay flex items-center justify-center text-sm font-semibold text-text-primary">
              {index + 1}
            </span>
            <div className="space-y-1">
              <h3 className="font-semibold text-text-primary">{term.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{term.content}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
