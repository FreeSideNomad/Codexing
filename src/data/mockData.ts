export type KitItem = {
  id: string
  category: string
  name: string
  brand: string
  model: string
  serial: string
  quantity: number
  dailyRate: number
  replacementValue: number
  condition: string
  image: string
}

export type QuoteStatus = 'Draft' | 'Sent' | 'Accepted' | 'Deposit Paid' | 'Confirmed'

export type TimelineEvent = {
  id: string
  label: string
  at: string
  actor: string
}

export type Message = {
  id: string
  from: string
  role: 'client' | 'employee' | 'system'
  text: string
  time: string
  readBy: string[]
  attachment?: string
}

export type EmailReply = {
  id: string
  from: string
  subject: string
  body: string
  receivedAt: string
}

export const terms = [
  'Rental period: 15–18 April 2026. Collection and return windows are fixed.',
  'Deposit required: 30% to confirm booking. Remaining amount due before dispatch.',
  'Late return fee: charged per day at 1.5× daily rate per item.',
  'Liability: customer responsible for loss/damage up to replacement value.',
  'Insurance: customer insurance confirmation required before dispatch.',
  'Usage restrictions: no underwater/high-risk use unless approved in writing.',
  'Cancellation: 50% of quote value if canceled within 48 hours of dispatch.',
]

export const kitItems: KitItem[] = [
  {
    id: 'k1',
    category: 'Camera',
    name: 'Cinema Body A-Cam',
    brand: 'Sony',
    model: 'FX6',
    serial: 'FX6-AV-1292',
    quantity: 1,
    dailyRate: 1900,
    replacementValue: 145000,
    condition: 'Checked, sensor clean, cage mounted',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600',
  },
  {
    id: 'k2',
    category: 'Lens',
    name: 'Zoom Lens',
    brand: 'Canon',
    model: '24-70mm f/2.8',
    serial: 'LENS-CN-8841',
    quantity: 1,
    dailyRate: 850,
    replacementValue: 42000,
    condition: 'Glass clean, minor barrel wear',
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=600',
  },
  {
    id: 'k3',
    category: 'Audio',
    name: 'Shotgun Mic',
    brand: 'Rode',
    model: 'NTG5',
    serial: 'AUD-RD-5512',
    quantity: 2,
    dailyRate: 300,
    replacementValue: 7800,
    condition: 'With shockmount and wind protection',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600',
  },
  {
    id: 'k4',
    category: 'Support',
    name: 'Tripod System',
    brand: 'Sachtler',
    model: 'Ace XL',
    serial: 'SUP-SA-9110',
    quantity: 1,
    dailyRate: 520,
    replacementValue: 26000,
    condition: 'Fluid head calibrated',
    image: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=600',
  },
]

export const quote = {
  number: 'VI-QT-2026-0418',
  status: 'Sent' as QuoteStatus,
  discount: 1500,
  vatRate: 0.15,
  delivery: 950,
}

export const timeline: TimelineEvent[] = [
  { id: 't1', label: 'Inquiry Received', at: '2026-04-03 09:14', actor: 'Client: K. Naidoo' },
  { id: 't2', label: 'Quote Sent', at: '2026-04-03 14:20', actor: 'Employee: L. Smith' },
  { id: 't3', label: 'Kit Revised by Request', at: '2026-04-04 10:02', actor: 'Employee: L. Smith' },
  { id: 't4', label: 'Sent for Approval', at: '2026-04-04 10:16', actor: 'Employee: L. Smith' },
]

export const revisionLog: TimelineEvent[] = [
  { id: 'r1', label: 'Lens changed to 24-70mm f/2.8', at: '2026-04-04 09:58', actor: 'Requested by K. Naidoo' },
  { id: 'r2', label: 'Added second shotgun mic', at: '2026-04-04 10:00', actor: 'Requested by P. Jacobs' },
]

export const messages: Message[] = [
  {
    id: 'm1',
    from: 'L. Smith',
    role: 'employee',
    text: 'We assembled this kit for a 2-camera interview + b-roll day. Please confirm if you need wireless audio too.',
    time: '10:12',
    readBy: ['K. Naidoo'],
  },
  {
    id: 'm2',
    from: 'K. Naidoo',
    role: 'client',
    text: 'Looks good. Please add one more NTG5 and include a PDF of terms and quote.',
    time: '10:18',
    readBy: ['L. Smith', 'T. Adams'],
    attachment: 'brief-v2.pdf',
  },
]

export const emailReplies: EmailReply[] = [
  {
    id: 'e1',
    from: 'k.naidoo@clientagency.co.za',
    subject: 'Re: Quote VI-QT-2026-0418 - approved with one note',
    body: 'Approved. Please add one extra battery kit and confirm card payment link for deposit.',
    receivedAt: '10:31',
  },
  {
    id: 'e2',
    from: 'random@vendor.com',
    subject: 'Delivery truck estimate',
    body: 'Unrelated operational message.',
    receivedAt: '10:35',
  },
]
