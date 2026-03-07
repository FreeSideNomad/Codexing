import type { Quote, ChatMessage, TimelineEvent } from '@/types'
import { equipment } from './equipment'

// A pre-built quote in "Sent" status with chat messages,
// so users can see the workspace in action immediately

export const demoQuote: Quote = {
  id: 'qt-demo-001',
  requestId: 'req-demo-001',
  quoteNumber: 'VI-QT-2026-0418',
  items: [
    { kitItemId: equipment[0].id, name: equipment[0].name, category: equipment[0].category, dailyRate: equipment[0].dailyRate, quantity: 1, days: 5 },
    { kitItemId: equipment[2].id, name: equipment[2].name, category: equipment[2].category, dailyRate: equipment[2].dailyRate, quantity: 1, days: 5 },
    { kitItemId: equipment[6].id, name: equipment[6].name, category: equipment[6].category, dailyRate: equipment[6].dailyRate, quantity: 1, days: 5 },
    { kitItemId: equipment[7].id, name: equipment[7].name, category: equipment[7].category, dailyRate: equipment[7].dailyRate, quantity: 1, days: 5 },
    { kitItemId: equipment[10].id, name: equipment[10].name, category: equipment[10].category, dailyRate: equipment[10].dailyRate, quantity: 1, days: 5 },
  ],
  discount: 2500,
  deliveryFee: 1500,
  vatRate: 0.15,
  status: 'Sent',
  revisions: [
    { id: 'rev-demo-01', timestamp: '2026-03-06T10:00:00Z', actor: 'James Mthembu', description: 'Initial quote created from documentary request' },
    { id: 'rev-demo-02', timestamp: '2026-03-06T14:30:00Z', actor: 'James Mthembu', description: 'Applied 10% discount for returning client' },
  ],
  createdAt: '2026-03-06T09:30:00Z',
}

export const demoMessages: ChatMessage[] = [
  {
    id: 'msg-demo-01',
    quoteId: 'qt-demo-001',
    sender: { userId: 'u-staff-01', name: 'James Mthembu', role: 'staff' },
    text: "Hi Sarah! I've put together a kit based on your documentary brief. The Alexa Mini LF will give you stunning cinematic footage, and I've included the Sennheiser and MixPre for broadcast-quality audio.",
    timestamp: '2026-03-06T10:15:00Z',
    readBy: ['u-staff-01'],
  },
  {
    id: 'msg-demo-02',
    quoteId: 'qt-demo-001',
    sender: { userId: 'u-client-01', name: 'Sarah Chen', role: 'client' },
    text: "Thanks James! The kit looks great. Could we possibly add a lens set? We're shooting some tight interview setups and need something versatile.",
    timestamp: '2026-03-06T11:30:00Z',
    readBy: ['u-client-01'],
  },
  {
    id: 'msg-demo-03',
    quoteId: 'qt-demo-001',
    sender: { userId: 'u-staff-01', name: 'James Mthembu', role: 'staff' },
    text: "Absolutely! I'd recommend the Zeiss CP.3 set — perfect for interviews and very versatile for documentary work. I've also applied a returning client discount for you.",
    timestamp: '2026-03-06T14:45:00Z',
    readBy: ['u-staff-01'],
  },
]

export const demoTimeline: TimelineEvent[] = [
  {
    id: 'evt-demo-01',
    quoteId: 'qt-demo-001',
    timestamp: '2026-03-05T09:30:00Z',
    label: 'Request Received',
    actor: 'Sarah Chen',
    description: 'New rental request submitted for heritage documentary',
  },
  {
    id: 'evt-demo-02',
    quoteId: 'qt-demo-001',
    timestamp: '2026-03-06T10:00:00Z',
    label: 'Quote Created',
    actor: 'James Mthembu',
    description: 'Kit assembled and quote prepared',
  },
  {
    id: 'evt-demo-03',
    quoteId: 'qt-demo-001',
    timestamp: '2026-03-06T14:30:00Z',
    label: 'Quote Sent',
    actor: 'James Mthembu',
    description: 'Quote sent to client for review',
  },
]
