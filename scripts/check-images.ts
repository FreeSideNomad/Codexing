/**
 * Checks that all image URLs in mock data return HTTP 200.
 * Run with: bun run scripts/check-images.ts
 */
import { equipment } from '../src/data/equipment'
import { bundles } from '../src/data/bundles'

const urls: { label: string; url: string }[] = []

for (const item of equipment) {
  urls.push({ label: `Equipment: ${item.name}`, url: item.imageUrl })
}

for (const bundle of bundles) {
  urls.push({ label: `Bundle: ${bundle.name}`, url: bundle.imageUrl })
}

let failed = 0

for (const { label, url } of urls) {
  try {
    const res = await fetch(url, { method: 'HEAD' })
    if (res.ok) {
      console.log(`✓ ${label}`)
    } else {
      console.error(`✗ ${label} — HTTP ${res.status}: ${url}`)
      failed++
    }
  } catch (err) {
    console.error(`✗ ${label} — Network error: ${url}`)
    failed++
  }
}

console.log(`\n${urls.length - failed}/${urls.length} images OK`)

if (failed > 0) {
  console.error(`\n${failed} broken image URL(s) found!`)
  process.exit(1)
}
