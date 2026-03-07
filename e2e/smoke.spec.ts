import { test, expect } from '@playwright/test'

/**
 * Smoke tests for the Visual Impact SA app.
 *
 * Run against deployed site:
 *   bunx playwright test
 *
 * Run against local dev/preview:
 *   BASE_URL=http://localhost:4567 bunx playwright test
 */

// Helper: set up a logged-in session via localStorage
async function loginViaStorage(page: import('@playwright/test').Page) {
  await page.goto('/')
  await page.evaluate(() => {
    // Clear any stale state
    localStorage.clear()
    // Set auth state directly
    const authState = {
      state: {
        isLoggedIn: true,
        currentUser: {
          id: 'u-client-01',
          name: 'Sarah Chen',
          role: 'client',
          email: 'sarah@example.com',
          company: 'Indigo Productions',
        },
      },
      version: 2,
    }
    localStorage.setItem('vi-auth', JSON.stringify(authState))
  })
  await page.reload()
  // Wait for the app to render with the authenticated state
  await page.waitForTimeout(1000)
}

test.describe('Page rendering — no blank screens', () => {
  test('login page renders', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForTimeout(1000)

    await expect(page.locator('text=Visual Impact')).toBeVisible({ timeout: 10_000 })
    await expect(page.locator('text=Enter as Client')).toBeVisible()
    await expect(page.locator('text=Enter as Staff')).toBeVisible()
  })

  test('login via button works', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForTimeout(1000)

    await page.click('button:has-text("Enter as Client")')
    await page.waitForTimeout(1000)

    // Should see the landing page nav
    const bodyText = await page.locator('body').innerText()
    expect(bodyText).toContain('Visual Impact')
  })

  test('landing page renders after login', async ({ page }) => {
    await loginViaStorage(page)
    const bodyText = await page.locator('body').innerText()
    expect(bodyText.length).toBeGreaterThan(20)
  })

  test('/bundles page renders', async ({ page }) => {
    await loginViaStorage(page)
    await page.goto('/bundles')
    await page.waitForTimeout(1000)

    const bodyText = await page.locator('body').innerText()
    expect(bodyText.length).toBeGreaterThan(20)
    // Should show bundle-related content
    await expect(page.locator('body')).not.toHaveText('404')
  })

  test('/orders page renders', async ({ page }) => {
    await loginViaStorage(page)
    await page.goto('/orders')
    await page.waitForTimeout(1000)

    const bodyText = await page.locator('body').innerText()
    expect(bodyText.length).toBeGreaterThan(20)
    await expect(page.locator('body')).not.toHaveText('404')
  })

  test('/orders/ord-001/reorder renders', async ({ page }) => {
    await loginViaStorage(page)
    await page.goto('/orders/ord-001/reorder')
    await page.waitForTimeout(1000)

    const bodyText = await page.locator('body').innerText()
    expect(bodyText.length).toBeGreaterThan(20)
  })

  test('/workspace/qt-demo-001 renders', async ({ page }) => {
    await loginViaStorage(page)
    await page.goto('/workspace/qt-demo-001')
    await page.waitForTimeout(1000)

    const bodyText = await page.locator('body').innerText()
    expect(bodyText.length).toBeGreaterThan(20)
    // Should show the demo quote number (appears in heading and details)
    await expect(page.locator('h1:has-text("VI-QT-2026-0418")')).toBeVisible({ timeout: 5000 })
  })

  test('/request/new renders', async ({ page }) => {
    await loginViaStorage(page)
    await page.goto('/request/new')
    await page.waitForTimeout(1000)

    const bodyText = await page.locator('body').innerText()
    expect(bodyText.length).toBeGreaterThan(20)
  })
})

test.describe('Navigation flows', () => {
  test('reorder flow: orders -> reorder page', async ({ page }) => {
    await loginViaStorage(page)
    await page.goto('/orders')
    await page.waitForTimeout(1000)

    // Click reorder on first order
    const reorderLink = page.locator('a:has-text("Reorder")').first()
    if (await reorderLink.isVisible()) {
      await reorderLink.click()
      await page.waitForTimeout(1000)

      const url = page.url()
      expect(url).toContain('/reorder')

      const bodyText = await page.locator('body').innerText()
      expect(bodyText.length).toBeGreaterThan(20)
    }
  })

  test('workspace then navigate away — app stays alive', async ({ page }) => {
    await loginViaStorage(page)

    // Visit workspace
    await page.goto('/workspace/qt-demo-001')
    await page.waitForTimeout(1500)

    // Page should have content (not blank/crashed)
    let bodyText = await page.locator('body').innerText()
    expect(bodyText.length).toBeGreaterThan(20)

    // Navigate to bundles via direct URL
    await page.goto('/bundles')
    await page.waitForTimeout(1000)

    bodyText = await page.locator('body').innerText()
    expect(bodyText.length).toBeGreaterThan(20)

    // Navigate to orders
    await page.goto('/orders')
    await page.waitForTimeout(1000)

    bodyText = await page.locator('body').innerText()
    expect(bodyText.length).toBeGreaterThan(20)
  })

  test('submit reorder creates quote and navigates to workspace', async ({ page }) => {
    await loginViaStorage(page)
    await page.goto('/orders/ord-001/reorder')
    await page.waitForTimeout(1000)

    // Click Submit Reorder
    const submitBtn = page.locator('button:has-text("Submit Reorder")')
    if (await submitBtn.isVisible() && await submitBtn.isEnabled()) {
      await submitBtn.click()
      await page.waitForTimeout(2000)

      // Should be on a workspace page
      const url = page.url()
      expect(url).toContain('/workspace/')

      // Page should have content
      const bodyText = await page.locator('body').innerText()
      expect(bodyText.length).toBeGreaterThan(20)
    }
  })
})

test.describe('Console errors', () => {
  test('no uncaught exceptions on main pages', async ({ page }) => {
    const fatalErrors: string[] = []
    page.on('pageerror', err => {
      fatalErrors.push(err.message)
    })

    await loginViaStorage(page)

    const routes = [
      '/',
      '/bundles',
      '/orders',
      '/orders/ord-001/reorder',
      '/workspace/qt-demo-001',
      '/request/new',
    ]

    for (const route of routes) {
      await page.goto(route)
      await page.waitForTimeout(1500)
    }

    expect(fatalErrors).toEqual([])
  })
})

test.describe('Image loading', () => {
  test('equipment images on bundles page return HTTP 200', async ({ page }) => {
    await loginViaStorage(page)
    await page.goto('/bundles')
    await page.waitForTimeout(2000)

    const imgUrls = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img'))
        .map(img => img.src)
        .filter(src => src.startsWith('http'))
    })

    const broken: string[] = []
    for (const url of imgUrls) {
      try {
        const response = await page.request.head(url)
        if (!response.ok()) {
          broken.push(`${url} => ${response.status()}`)
        }
      } catch {
        broken.push(`${url} => network error`)
      }
    }

    expect(broken, `Broken images: ${broken.join(', ')}`).toEqual([])
  })
})
