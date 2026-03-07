import { useRequestStore } from '@/stores/requestStore'
import { users } from '@/data/users'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, FileText } from 'lucide-react'
import type { RequestStatus } from '@/types'

const statusVariant: Record<RequestStatus, 'warning' | 'accent' | 'success'> = {
  pending: 'warning',
  'in-progress': 'accent',
  quoted: 'success',
}

const statusLabel: Record<RequestStatus, string> = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  quoted: 'Quoted',
}

function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const startDay = startDate.getDate()
  const endDay = endDate.getDate()
  const month = endDate.toLocaleString('en-GB', { month: 'short' })
  const year = endDate.getFullYear()

  if (startDate.getMonth() === endDate.getMonth()) {
    return `${startDay} - ${endDay} ${month} ${year}`
  }

  const startMonth = startDate.toLocaleString('en-GB', { month: 'short' })
  return `${startDay} ${startMonth} - ${endDay} ${month} ${year}`
}

function getClientInfo(clientId: string) {
  const clientUser = users.client
  if (clientUser.id === clientId) {
    return { name: clientUser.name, company: clientUser.company }
  }
  return { name: 'Unknown Client', company: '' }
}

export function IncomingRequestList() {
  const requests = useRequestStore((s) => s.requests)

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-semibold text-text-primary">Incoming Requests</h2>
        <Badge variant={requests.length > 0 ? 'accent' : 'muted'}>{requests.length}</Badge>
      </div>

      {requests.length === 0 ? (
        <div className="flex items-center justify-center rounded-xl border border-border-subtle bg-surface-raised py-16">
          <p className="text-text-muted text-lg">All caught up! No pending requests.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => {
            const client = getClientInfo(request.clientId)

            return (
              <div
                key={request.id}
                className="rounded-xl border border-border-subtle bg-surface-raised p-5 transition-colors hover:border-border-subtle/80"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-base font-semibold text-text-primary">{client.name}</span>
                      {client.company && (
                        <span className="text-sm text-text-muted">{client.company}</span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge variant="default">{request.shootType}</Badge>
                      <Badge variant={statusVariant[request.status]}>
                        {statusLabel[request.status]}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDateRange(request.dates.start, request.dates.end)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {request.location}
                      </span>
                    </div>

                    {request.notes && (
                      <p className="mt-2 text-sm text-text-muted truncate flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                        {request.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    <Button
                      size="sm"
                      onClick={() => {
                        console.log(`Prepare kit for request ${request.id}`)
                        window.location.href = '/workspace/new'
                      }}
                    >
                      Prepare Kit
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
