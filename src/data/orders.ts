import type { PastOrder } from '@/types'
import { equipment } from './equipment'

function findItem(id: string) {
  const item = equipment.find((e) => e.id === id)
  if (!item) throw new Error(`Equipment item ${id} not found`)
  return item
}

export const pastOrders: PastOrder[] = [
  {
    id: 'ord-001',
    date: '2026-01-15',
    projectName: 'Mandela Day Documentary',
    items: [
      findItem('cam-001'), // ARRI Alexa Mini LF
      findItem('lens-002'), // Zeiss CP.3 Lens Set
      findItem('aud-001'), // Sennheiser MKH 416
      findItem('aud-002'), // Sound Devices MixPre-6 II
      findItem('lit-001'), // ARRI SkyPanel S60-C
      findItem('sup-001'), // Sachtler aktiv8 Flowtech
    ],
    total: 68750,
    status: 'Completed',
    daysRented: 5,
  },
  {
    id: 'ord-002',
    date: '2026-02-08',
    projectName: 'Cape Town Wine Advert',
    items: [
      findItem('cam-003'), // RED Komodo 6K
      findItem('lens-001'), // Canon CN-E 50mm T1.3
      findItem('lit-002'), // Aputure 600d Pro
      findItem('acc-001'), // DJI Ronin 4D Gimbal
    ],
    total: 21450,
    status: 'Completed',
    daysRented: 3,
  },
  {
    id: 'ord-003',
    date: '2026-02-22',
    projectName: 'Joburg Music Fest',
    items: [
      findItem('cam-002'), // Sony FX6
      findItem('lens-003'), // Angenieux EZ-1 30-90mm
      findItem('aud-001'), // Sennheiser MKH 416
      findItem('lit-002'), // Aputure 600d Pro
    ],
    total: 12100,
    status: 'Completed',
    daysRented: 2,
  },
]
