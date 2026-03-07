export type UserRole = 'client' | 'staff'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  company: string
  avatar?: string
}

export type EquipmentCategory = 'Camera' | 'Lens' | 'Audio' | 'Lighting' | 'Support' | 'Accessories'

export interface KitItem {
  id: string
  name: string
  category: EquipmentCategory
  brand: string
  model: string
  serialNumber: string
  dailyRate: number
  replacementValue: number
  condition: 'New' | 'Excellent' | 'Good' | 'Fair'
  imageUrl: string
  description?: string
}

export type ShootType = 'Documentary' | 'Commercial' | 'Event' | 'MusicVideo' | 'Corporate'
export type BundleTier = 'Essential' | 'Professional' | 'Premium'

export interface Bundle {
  id: string
  name: string
  description: string
  shootType: ShootType
  tier: BundleTier
  items: KitItem[]
  startingDailyRate: number
  imageUrl: string
}

export interface PastOrder {
  id: string
  date: string
  projectName: string
  items: KitItem[]
  total: number
  status: 'Completed' | 'Cancelled'
  daysRented: number
}

export type RequestStatus = 'pending' | 'in-progress' | 'quoted'

export interface RentalRequest {
  id: string
  clientId: string
  shootType: ShootType
  dates: { start: string; end: string }
  location: string
  notes: string
  status: RequestStatus
  items?: KitItem[]
  createdAt: string
}

export type QuoteStatus =
  | 'Draft'
  | 'Sent'
  | 'Negotiating'
  | 'Accepted'
  | 'TermsAccepted'
  | 'DepositPaid'
  | 'Confirmed'

export interface QuoteLineItem {
  kitItemId: string
  name: string
  category: EquipmentCategory
  dailyRate: number
  quantity: number
  days: number
}

export interface Revision {
  id: string
  timestamp: string
  actor: string
  description: string
}

export interface Quote {
  id: string
  requestId: string
  quoteNumber: string
  items: QuoteLineItem[]
  discount: number
  deliveryFee: number
  vatRate: number
  status: QuoteStatus
  revisions: Revision[]
  createdAt: string
}

export interface ChatMessage {
  id: string
  quoteId: string
  sender: { userId: string; name: string; role: UserRole }
  text: string
  timestamp: string
  attachments?: string[]
  readBy: string[]
}

export interface TimelineEvent {
  id: string
  quoteId: string
  timestamp: string
  label: string
  actor: string
  description: string
}

export type PaymentMethod = 'card' | 'eft' | 'account'
