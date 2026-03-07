import { useRequestStore } from '@/stores/requestStore'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const shootTypeOptions = [
  { value: 'Documentary', label: 'Documentary' },
  { value: 'Commercial', label: 'Commercial' },
  { value: 'Event', label: 'Event' },
  { value: 'MusicVideo', label: 'Music Video' },
  { value: 'Corporate', label: 'Corporate' },
]

interface RequestBriefFormProps {
  onContinue: () => void
}

export function RequestBriefForm({ onContinue }: RequestBriefFormProps) {
  const shootType = useRequestStore((s) => s.draftShootType)
  const startDate = useRequestStore((s) => s.draftStartDate)
  const endDate = useRequestStore((s) => s.draftEndDate)
  const location = useRequestStore((s) => s.draftLocation)
  const notes = useRequestStore((s) => s.draftNotes)
  const setDraftField = useRequestStore((s) => s.setDraftField)

  return (
    <div className="space-y-5">
      <Select
        label="Shoot Type"
        options={shootTypeOptions}
        value={shootType}
        onChange={(e) => setDraftField('draftShootType', e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setDraftField('draftStartDate', e.target.value)}
        />
        <Input
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setDraftField('draftEndDate', e.target.value)}
        />
      </div>

      <Input
        label="Location"
        type="text"
        placeholder="e.g., Camps Bay, Cape Town"
        value={location}
        onChange={(e) => setDraftField('draftLocation', e.target.value)}
      />

      <div className="space-y-1.5">
        <label htmlFor="notes" className="block text-sm font-medium text-text-secondary">
          Notes / Brief Description
        </label>
        <textarea
          id="notes"
          rows={4}
          placeholder="Describe your project, any special requirements..."
          value={notes}
          onChange={(e) => setDraftField('draftNotes', e.target.value)}
          className="w-full rounded-lg border border-border-subtle bg-surface-overlay px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent resize-none"
        />
      </div>

      <Button className="w-full" onClick={onContinue}>
        Continue to Equipment
      </Button>
    </div>
  )
}
