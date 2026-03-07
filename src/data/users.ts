import type { User } from '@/types'

export const users: Record<string, User> = {
  client: {
    id: 'u-client-01',
    name: 'Sarah Chen',
    email: 'sarah@studioflow.co.za',
    role: 'client',
    company: 'StudioFlow Productions',
  },
  staff: {
    id: 'u-staff-01',
    name: 'James Mthembu',
    email: 'james@visualimpact.co.za',
    role: 'staff',
    company: 'Visual Impact SA',
  },
}
