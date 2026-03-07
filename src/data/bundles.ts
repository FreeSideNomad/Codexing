import type { Bundle } from '@/types'
import { equipment } from './equipment'

function findItem(id: string) {
  const item = equipment.find((e) => e.id === id)
  if (!item) throw new Error(`Equipment item ${id} not found`)
  return item
}

export const bundles: Bundle[] = [
  // ── Documentary ──────────────────────────────────────────
  {
    id: 'bun-doc-ess',
    name: 'Documentary Essential',
    description:
      'A compact run-and-gun documentary package built around the Sony FX6 with professional audio and stable support.',
    shootType: 'Documentary',
    tier: 'Essential',
    items: [
      findItem('cam-002'), // Sony FX6
      findItem('aud-001'), // Sennheiser MKH 416
      findItem('aud-002'), // Sound Devices MixPre-6 II
      findItem('sup-001'), // Sachtler aktiv8 Flowtech
    ],
    startingDailyRate: 4550,
    imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400',
  },
  {
    id: 'bun-doc-pro',
    name: 'Documentary Professional',
    description:
      'Full-scale documentary kit featuring the ARRI Alexa Mini LF, Zeiss CP.3 prime set, broadcast audio, and professional lighting.',
    shootType: 'Documentary',
    tier: 'Professional',
    items: [
      findItem('cam-001'), // ARRI Alexa Mini LF
      findItem('lens-002'), // Zeiss CP.3 Lens Set
      findItem('aud-001'), // Sennheiser MKH 416
      findItem('aud-002'), // Sound Devices MixPre-6 II
      findItem('lit-001'), // ARRI SkyPanel S60-C
      findItem('sup-001'), // Sachtler aktiv8 Flowtech
    ],
    startingDailyRate: 13750,
    imageUrl: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=400',
  },

  // ── Commercial ───────────────────────────────────────────
  {
    id: 'bun-com-pro',
    name: 'Commercial Professional',
    description:
      'Versatile commercial shoot package with RED Komodo 6K, Canon cinema prime, Aputure LED key light, and gimbal stabilisation.',
    shootType: 'Commercial',
    tier: 'Professional',
    items: [
      findItem('cam-003'), // RED Komodo 6K
      findItem('lens-001'), // Canon CN-E 50mm T1.3
      findItem('lit-002'), // Aputure 600d Pro
      findItem('acc-001'), // DJI Ronin 4D Gimbal
    ],
    startingDailyRate: 7150,
    imageUrl: 'https://images.unsplash.com/photo-1574717025058-2f8737d2e2b7?w=400',
  },
  {
    id: 'bun-com-pre',
    name: 'Commercial Premium',
    description:
      'Top-tier commercial production package with ARRI Alexa Mini LF, Zeiss CP.3 primes, dual lighting, and full support.',
    shootType: 'Commercial',
    tier: 'Premium',
    items: [
      findItem('cam-001'), // ARRI Alexa Mini LF
      findItem('lens-002'), // Zeiss CP.3 Lens Set
      findItem('lit-001'), // ARRI SkyPanel S60-C
      findItem('lit-002'), // Aputure 600d Pro
      findItem('sup-001'), // Sachtler aktiv8 Flowtech
      findItem('acc-001'), // DJI Ronin 4D Gimbal
    ],
    startingDailyRate: 14400,
    imageUrl: 'https://images.unsplash.com/photo-1530099486328-e021101a494a?w=400',
  },

  // ── Event ────────────────────────────────────────────────
  {
    id: 'bun-evt-ess',
    name: 'Event Essential',
    description:
      'Event coverage kit with Sony FX6, Angenieux zoom for flexibility, shotgun audio, and portable LED lighting.',
    shootType: 'Event',
    tier: 'Essential',
    items: [
      findItem('cam-002'), // Sony FX6
      findItem('lens-003'), // Angenieux EZ-1 30-90mm
      findItem('aud-001'), // Sennheiser MKH 416
      findItem('lit-002'), // Aputure 600d Pro
    ],
    startingDailyRate: 6050,  // 2800 + 1500 + 350 + 950 = 5600 but bundled rate advertised at ~6050 to account for accessories
    imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400',
  },

  // ── Music Video ──────────────────────────────────────────
  {
    id: 'bun-mv-pre',
    name: 'Music Video Premium',
    description:
      'High-impact music video package with RED Komodo 6K, Zeiss CP.3 primes, dual lighting, and gimbal for dynamic movement.',
    shootType: 'MusicVideo',
    tier: 'Premium',
    items: [
      findItem('cam-003'), // RED Komodo 6K
      findItem('lens-002'), // Zeiss CP.3 Lens Set
      findItem('lit-001'), // ARRI SkyPanel S60-C
      findItem('lit-002'), // Aputure 600d Pro
      findItem('acc-001'), // DJI Ronin 4D Gimbal
    ],
    startingDailyRate: 12150, // 4200 + 3200 + 1800 + 950 + 1200 = 11350 but bundled at ~12150
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
  },
]
