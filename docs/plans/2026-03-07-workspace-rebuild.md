# Visual Impact SA Workspace — Complete Rebuild Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the Visual Impact SA rental-kit workspace as a polished, multi-page demo showing the full journey from request to confirmation — targeting potential customers.

**Architecture:** React 19 + React Router for multi-page navigation, Zustand stores split by domain (auth, catalog, request, quote, chat, timeline), dark cinematic theme via Tailwind CSS v4. Client-only with localStorage persistence. All data mocked but realistic.

**Tech Stack:** React 19, React Router 7, Zustand 5, Tailwind CSS 4, Lucide React, Vite 7, TypeScript 5.9, Bun

**Design Doc:** `docs/plans/2026-03-07-workspace-rebuild-design.md`

---

### Task 1: Project Setup — Install Dependencies & Clean Old Files

**Files:**
- Modify: `package.json`
- Delete: `src/App.css`, `src/assets/react.svg`
- Modify: `index.html` (update title, favicon)

**Step 1: Install react-router**

Run: `bun add react-router`

**Step 2: Delete unused files**

```bash
rm src/App.css src/assets/react.svg public/vite.svg
rmdir src/assets 2>/dev/null || true
```

**Step 3: Update index.html**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Visual Impact SA — Workspace</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎬</text></svg>" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Step 4: Verify clean build**

Run: `bun run build`
Expected: Build succeeds (may have unused import warnings — that's fine, we'll replace App.tsx soon)

**Step 5: Commit**

```bash
git add -A && git commit -m "chore: install react-router, clean unused files, update title"
```

---

### Task 2: Types & Mock Data

**Files:**
- Create: `src/types/index.ts`
- Create: `src/data/equipment.ts`
- Create: `src/data/bundles.ts`
- Create: `src/data/orders.ts`
- Create: `src/data/users.ts`
- Delete: `src/data/mockData.ts` (replaced by the above)

**Step 1: Create type definitions**

Create `src/types/index.ts`:

```typescript
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
```

**Step 2: Create mock users**

Create `src/data/users.ts`:

```typescript
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
```

**Step 3: Create mock equipment catalog**

Create `src/data/equipment.ts` with at least 12 items across all categories (Camera, Lens, Audio, Lighting, Support, Accessories). Use realistic Visual Impact SA equipment — Sony, ARRI, Canon, Sennheiser, etc. Use Unsplash image URLs for photos. Include 2+ items per category with realistic daily rates in ZAR (e.g., ARRI Alexa Mini: R4,500/day, Sony A7S III: R1,800/day).

**Step 4: Create mock bundles**

Create `src/data/bundles.ts` with 6 bundles covering shoot types and tiers:

- Documentary Essential, Documentary Professional
- Commercial Professional, Commercial Premium
- Event Essential
- Music Video Premium

Each bundle references items from the equipment catalog.

**Step 5: Create mock past orders**

Create `src/data/orders.ts` with 3 past orders referencing equipment items.

**Step 6: Delete old mock data**

```bash
rm src/data/mockData.ts
```

**Step 7: Verify build**

Run: `bun run build`
Expected: Build succeeds (App.tsx will break since it imports mockData — that's expected, we'll replace it next task)

**Step 8: Commit**

```bash
git add -A && git commit -m "feat: add type definitions and comprehensive mock data"
```

---

### Task 3: Zustand Stores

**Files:**
- Create: `src/stores/authStore.ts`
- Create: `src/stores/catalogStore.ts`
- Create: `src/stores/requestStore.ts`
- Create: `src/stores/quoteStore.ts`
- Create: `src/stores/chatStore.ts`
- Create: `src/stores/timelineStore.ts`
- Delete: `src/store/useWorkspaceStore.ts`

**Step 1: Create authStore**

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserRole } from '@/types'
import { users } from '@/data/users'

interface AuthState {
  isLoggedIn: boolean
  currentUser: User | null
  login: (role: UserRole) => void
  logout: () => void
  switchRole: (role: UserRole) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      currentUser: null,
      login: (role) => set({ isLoggedIn: true, currentUser: users[role] }),
      logout: () => set({ isLoggedIn: false, currentUser: null }),
      switchRole: (role) => set({ currentUser: users[role] }),
    }),
    { name: 'vi-auth' },
  ),
)
```

**Step 2: Create catalogStore**

Exposes equipment items, bundles, past orders. Includes filtering helpers for bundles (by shootType, by tier) and equipment (by category).

**Step 3: Create requestStore**

Manages new request form state: shootType, dates, location, notes, optional selected items. Actions: createRequest, clearRequest. Generates a RentalRequest with UUID and status 'pending'.

**Step 4: Create quoteStore**

Manages active quote state. Actions: createQuoteFromRequest, createQuoteFromOrder, createQuoteFromBundle, addLineItem, removeLineItem, updateQuantity, setDiscount, setStatus, addRevision. Computed: subtotal, vatAmount, total, depositAmount (30%). Persists to localStorage.

**Step 5: Create chatStore**

Manages messages for the active quote. Actions: sendMessage, markAsRead. Persists to localStorage.

**Step 6: Create timelineStore**

Manages timeline events. Actions: addEvent. Auto-adds events when quote status changes (called from quoteStore).

**Step 7: Delete old store**

```bash
rm -rf src/store
```

**Step 8: Verify build**

Run: `bun run build`
Expected: Will fail because App.tsx still imports old store — that's fine, next task replaces App.tsx.

**Step 9: Commit**

```bash
git add -A && git commit -m "feat: add domain-split Zustand stores"
```

---

### Task 4: Dark Cinematic Theme & Shared UI Components

**Files:**
- Modify: `src/index.css` (dark theme, custom properties, font import)
- Modify: `src/components/ui/button.tsx` (dark theme variants)
- Modify: `src/components/ui/card.tsx` (dark theme)
- Modify: `src/components/ui/badge.tsx` (dark theme + status variants)
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/select.tsx`
- Create: `src/components/shared/PriceDisplay.tsx`
- Create: `src/components/shared/EquipmentCard.tsx`
- Create: `src/components/shared/StatusBadge.tsx`
- Create: `src/components/shared/QuoteSummary.tsx`

**Step 1: Update index.css for dark cinematic theme**

```css
@import 'tailwindcss';

@theme {
  --color-surface: #0a0a0f;
  --color-surface-raised: #1a1a2e;
  --color-surface-overlay: #252542;
  --color-border-subtle: #2a2a4a;
  --color-accent: #e8632b;
  --color-accent-hover: #f47a3e;
  --color-text-primary: #f0f0f5;
  --color-text-secondary: #8888a0;
  --color-text-muted: #55556a;
  --color-success: #22c55e;
  --color-warning: #eab308;
  --color-danger: #ef4444;
}

@font-face {
  font-family: 'Inter';
  src: url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
}

:root {
  font-family: Inter, system-ui, -apple-system, sans-serif;
  color: var(--color-text-primary);
  -webkit-font-smoothing: antialiased;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--color-surface);
  min-height: 100vh;
}
```

Note: The `@theme` directive is Tailwind v4's way of defining custom theme values. These become available as `bg-surface`, `text-accent`, `border-border-subtle`, etc.

**Step 2: Restyle Button, Card, Badge for dark theme**

- Button default: `bg-accent text-white hover:bg-accent-hover`. Secondary: `bg-surface-raised`. Outline: `border-border-subtle`. Ghost: transparent.
- Card: `bg-surface-raised border-border-subtle`. No shadow on dark background.
- Badge: dark variants for status colors.

**Step 3: Create Input and Select components**

Dark-themed form inputs matching the design system.

**Step 4: Create PriceDisplay component**

Formats numbers as ZAR with `Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' })`.

**Step 5: Create EquipmentCard component**

Reusable card showing a kit item: image, name, brand/model, daily rate, condition badge. Used in catalog browser, bundle detail, kit editor, past orders. Accepts an optional `onAdd`/`onRemove` callback to show action buttons.

**Step 6: Create StatusBadge component**

Maps QuoteStatus to colored badges: Draft=gray, Sent=blue, Negotiating=amber, Accepted=green, TermsAccepted=green, DepositPaid=accent, Confirmed=success.

**Step 7: Create QuoteSummary component**

Pricing sidebar: lists line items, subtotal, discount, delivery, VAT, total, deposit. Uses PriceDisplay. Reads from quoteStore.

**Step 8: Verify components render**

Run: `bun run dev`
Manually check the dev server loads without errors (App.tsx may still be broken — that's OK).

**Step 9: Commit**

```bash
git add -A && git commit -m "feat: dark cinematic theme and shared UI components"
```

---

### Task 5: App Shell — Layout, Router, TopNav, RoleSwitcher

**Files:**
- Rewrite: `src/App.tsx` (replace monolith with router setup)
- Rewrite: `src/main.tsx` (wrap with BrowserRouter)
- Create: `src/components/layout/AppShell.tsx`
- Create: `src/components/layout/TopNav.tsx`
- Create: `src/components/layout/RoleSwitcher.tsx`
- Create: `src/components/layout/Footer.tsx`
- Create: `src/pages/LandingPage.tsx` (placeholder)

**Step 1: Set up router in main.tsx**

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App'
import './index.css'

const base = import.meta.env.BASE_URL

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={base}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

**Step 2: Create AppShell layout**

```typescript
// src/components/layout/AppShell.tsx
import { Outlet } from 'react-router'
import { TopNav } from './TopNav'
import { Footer } from './Footer'

export function AppShell() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <TopNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
```

**Step 3: Create TopNav with RoleSwitcher**

TopNav: dark bar with Visual Impact SA logo (text-based), nav links (Home, Bundles, Orders), and RoleSwitcher on the right.

RoleSwitcher: toggle between Client and Staff. Shows current role as badge. Clicking swaps via authStore.switchRole. If not logged in, shows Login button.

**Step 4: Create Footer**

Minimal dark footer: "Visual Impact SA" copyright, year.

**Step 5: Replace App.tsx with route definitions**

```typescript
import { Routes, Route, Navigate } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { LandingPage } from '@/pages/LandingPage'
import { useAuthStore } from '@/stores/authStore'

export default function App() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  if (!isLoggedIn) {
    return <LoginPage />
  }

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<LandingPage />} />
        {/* More routes added in later tasks */}
      </Route>
    </Routes>
  )
}
```

Include a simple LoginPage component inline or in `src/pages/LoginPage.tsx` — dark themed, "Welcome to Visual Impact SA", choose Client or Staff.

**Step 6: Create placeholder LandingPage**

Just renders "Landing Page" text so we can verify routing works.

**Step 7: Verify in browser**

Run: `bun run dev`
Expected: Login screen → select role → landing page with TopNav, RoleSwitcher, Footer.

**Step 8: Commit**

```bash
git add -A && git commit -m "feat: app shell with router, top nav, role switcher"
```

---

### Task 6: Landing Page

**Files:**
- Rewrite: `src/pages/LandingPage.tsx`
- Create: `src/components/landing/PathCard.tsx`
- Create: `src/components/landing/IncomingRequestList.tsx`

**Step 1: Build PathCard component**

A large, cinematic card with icon, title, description, and CTA button. Used for the 3 entry paths. Accepts: icon, title, description, linkTo, gradient color.

**Step 2: Build client landing view**

Three PathCards in a responsive grid:
- "New Request" (Film icon) → links to `/request/new`
- "From Previous Order" (History icon) → links to `/orders`
- "Browse Bundles" (Package icon) → links to `/bundles`

Hero section above: "Your Rental Kit Workspace" headline with cinematic gradient text.

**Step 3: Build IncomingRequestList (staff view)**

Shows a list of pending rental requests. Each item: client name, shoot type, dates, status badge. Clicking opens the workspace. Uses mock data from requestStore (pre-seed 2-3 sample requests).

**Step 4: Wire LandingPage to show correct view based on role**

```typescript
const role = useAuthStore((s) => s.currentUser?.role)
return role === 'staff' ? <IncomingRequestList /> : <ClientLanding />
```

**Step 5: Verify in browser**

Run: `bun run dev`
Expected: Client sees 3 path cards. Switch to staff → sees incoming requests.

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: landing page with client paths and staff request list"
```

---

### Task 7: New Request Flow

**Files:**
- Create: `src/pages/NewRequestPage.tsx`
- Create: `src/components/request/RequestBriefForm.tsx`
- Create: `src/components/request/CatalogBrowser.tsx`
- Modify: `src/App.tsx` (add route)

**Step 1: Build RequestBriefForm**

Form with:
- Shoot type (select dropdown: Documentary, Commercial, Event, MusicVideo, Corporate)
- Start date, end date (date inputs)
- Location (text input)
- Notes / brief description (textarea)
- "Continue" button → advances to optional catalog step

All fields update requestStore state.

**Step 2: Build CatalogBrowser**

- Grid of EquipmentCards from catalogStore
- Filter tabs by category (All, Camera, Lens, Audio, Lighting, Support, Accessories)
- Each card has "Add to Kit" button → adds to requestStore.items
- Shows selected count badge
- "Submit Request" button at bottom → creates request, generates a quote, navigates to `/workspace/:quoteId`

**Step 3: Build NewRequestPage**

Two-step layout:
1. Brief form (left/top)
2. Optional catalog browser (right/bottom) — revealed after "Continue"

**Step 4: Add route**

In App.tsx: `<Route path="request/new" element={<NewRequestPage />} />`

**Step 5: Verify in browser**

Run: `bun run dev`
Expected: Click "New Request" → fill form → browse catalog → add items → submit → redirects to workspace.

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: new request flow with brief form and catalog browser"
```

---

### Task 8: Bundle Browser

**Files:**
- Create: `src/pages/BundlesPage.tsx`
- Create: `src/components/bundles/BundleGrid.tsx`
- Create: `src/components/bundles/BundleCard.tsx`
- Create: `src/components/bundles/BundleDetail.tsx`
- Modify: `src/App.tsx` (add route)

**Step 1: Build BundleCard**

Shows bundle: image, name, shoot type badge, tier badge, starting daily rate, item count. Click → expands to BundleDetail.

**Step 2: Build BundleGrid**

- Grid of BundleCards
- Filter bar: shoot type tabs + tier toggle (Essential / Professional / Premium)
- Filters from catalogStore

**Step 3: Build BundleDetail**

Expanded view of a bundle:
- Full description
- List of all included EquipmentCards
- Total daily rate
- "Select This Bundle" button → creates quote from bundle items, navigates to `/workspace/:quoteId`

**Step 4: Build BundlesPage**

Composes BundleGrid. When a bundle is selected, shows BundleDetail overlay/panel.

**Step 5: Add route**

In App.tsx: `<Route path="bundles" element={<BundlesPage />} />`

**Step 6: Verify in browser**

Expected: Browse bundles → filter by shoot type/tier → click → see details → select → workspace.

**Step 7: Commit**

```bash
git add -A && git commit -m "feat: bundle browser with filtering and detail view"
```

---

### Task 9: Previous Orders & Reorder

**Files:**
- Create: `src/pages/OrdersPage.tsx`
- Create: `src/pages/ReorderPage.tsx`
- Create: `src/components/orders/OrderCard.tsx`
- Modify: `src/App.tsx` (add routes)

**Step 1: Build OrderCard**

Shows past order: project name, date, item count, total, status badge. "Reorder" button → links to `/orders/:id/reorder`.

**Step 2: Build OrdersPage**

List of OrderCards from catalogStore.pastOrders.

**Step 3: Build ReorderPage**

- Pre-loads kit items from past order into a quote
- Shows items as editable EquipmentCards (can remove)
- "Add More Equipment" section with catalog browser
- Date adjustment inputs (new start/end dates)
- "Submit Reorder" button → creates quote, navigates to workspace

**Step 4: Add routes**

```typescript
<Route path="orders" element={<OrdersPage />} />
<Route path="orders/:id/reorder" element={<ReorderPage />} />
```

**Step 5: Verify in browser**

Expected: View past orders → click Reorder → modify items/dates → submit → workspace.

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: previous orders list and reorder flow"
```

---

### Task 10: Kit Editor / Quote Workspace (Core Screen)

**Files:**
- Create: `src/pages/WorkspacePage.tsx`
- Create: `src/components/workspace/KitPanel.tsx`
- Create: `src/components/workspace/QuotePanel.tsx`
- Create: `src/components/workspace/StatusBar.tsx`
- Create: `src/components/workspace/RevisionHistory.tsx`
- Modify: `src/App.tsx` (add route)

**Step 1: Build StatusBar**

Horizontal bar showing quote status workflow: Draft → Sent → Negotiating → Accepted → TermsAccepted → DepositPaid → Confirmed. Active status highlighted with accent color. Staff can click to advance status. Client sees status read-only (except Accept action).

**Step 2: Build KitPanel**

Left panel:
- List of kit items grouped by category
- Each item: EquipmentCard with remove button (staff: also swap/edit pricing)
- Client: "Request Change" button flags items for review
- Item count and category breakdown at top

**Step 3: Build QuotePanel**

Right panel: QuoteSummary component + action buttons:
- Client: "Accept Quote", "Request Changes" (opens chat)
- Staff: "Send to Client", "Apply Discount" (input), adjust delivery fee
- Shows quote number, dates, project reference

**Step 4: Build RevisionHistory**

Collapsible section at bottom of QuotePanel. Lists all revisions with timestamp, actor, description.

**Step 5: Build WorkspacePage**

Composes all panels in a responsive layout:
- StatusBar at top (full width)
- KitPanel (left, ~60%) + QuotePanel (right, ~40%)
- ChatPanel placeholder (added in next task)

**Step 6: Add route**

```typescript
<Route path="workspace/:quoteId" element={<WorkspacePage />} />
```

**Step 7: Verify in browser**

Expected: Any flow → workspace shows kit items, live quote, status bar. Client and staff see different actions.

**Step 8: Commit**

```bash
git add -A && git commit -m "feat: kit editor and quote workspace"
```

---

### Task 11: Chat Panel

**Files:**
- Create: `src/components/workspace/ChatPanel.tsx`
- Create: `src/components/workspace/ChatMessage.tsx`
- Modify: `src/pages/WorkspacePage.tsx` (integrate ChatPanel)

**Step 1: Build ChatMessage component**

Single message bubble:
- Left-aligned for other party, right-aligned for current user
- Role badge (client/staff/system) with color coding
- Timestamp
- Attachment indicators
- Read status ("Read by ...")

**Step 2: Build ChatPanel**

Collapsible bottom panel (toggle with chat icon button):
- Message list with auto-scroll to bottom
- Input field + send button
- Messages color-coded by role: client=accent-tinted, staff=surface-overlay, system=muted
- Pre-seeded with 2-3 sample messages from mock data
- Send action: chatStore.sendMessage with current user info

**Step 3: Integrate into WorkspacePage**

Add ChatPanel below the KitPanel/QuotePanel grid. Collapsible — starts expanded.

**Step 4: Verify in browser**

Expected: Chat visible in workspace. Can send messages. Switch roles → messages appear from correct side.

**Step 5: Commit**

```bash
git add -A && git commit -m "feat: collapsible chat panel in workspace"
```

---

### Task 12: Terms & Acceptance

**Files:**
- Create: `src/pages/TermsPage.tsx`
- Create: `src/components/workspace/TermsDisplay.tsx`
- Modify: `src/App.tsx` (add route)

**Step 1: Build TermsDisplay**

- Numbered list of rental terms (from mock data — 7+ terms covering late fees, liability, insurance, cancellation)
- Clean typography on dark background
- Checkbox: "I have read and accept the rental terms and conditions"
- "Download Terms PDF" button — opens a simple rendered view in new tab (or simulates download)

**Step 2: Build TermsPage**

- Shows TermsDisplay
- Quote summary sidebar (condensed)
- "Accept Terms & Continue to Payment" button — enabled only when checkbox checked
- On accept: updates quote status to 'TermsAccepted', adds timeline event, navigates to payment

**Step 3: Add route**

```typescript
<Route path="workspace/:quoteId/terms" element={<TermsPage />} />
```

**Step 4: Add "Proceed to Terms" button in WorkspacePage**

Visible when quote status is 'Accepted'. Navigates to `/workspace/:quoteId/terms`.

**Step 5: Verify in browser**

Expected: Accept quote → "Proceed to Terms" appears → terms page → check box → continue to payment.

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: terms and acceptance page"
```

---

### Task 13: Payment

**Files:**
- Create: `src/pages/PaymentPage.tsx`
- Create: `src/components/payment/PaymentMethodSelector.tsx`
- Create: `src/components/payment/CardForm.tsx`
- Create: `src/components/payment/EftDetails.tsx`
- Create: `src/components/payment/AccountCharge.tsx`
- Modify: `src/App.tsx` (add route)

**Step 1: Build PaymentMethodSelector**

Three tabs/cards: Card, EFT, Account. Each with icon and description. Selecting one reveals the corresponding form below.

**Step 2: Build CardForm**

Simulated card form (dark themed):
- Card number (formatted with spaces), expiry (MM/YY), CVV, cardholder name
- "Pay Deposit — R X,XXX.XX" button
- On submit: 1-second simulated processing → success state → updates quote to 'DepositPaid'
- Shows deposit amount (30% of total) and remaining balance

**Step 3: Build EftDetails**

Display bank details for manual EFT:
- Bank: First National Bank
- Account: Visual Impact SA
- Account number, branch code, reference (quote number)
- "I've Made the Payment" button → updates status

**Step 4: Build AccountCharge**

For customers with account terms:
- Shows account info and available credit
- "Charge Deposit to Account" button → updates status

**Step 5: Build PaymentPage**

- Quote summary (condensed) at top
- PaymentMethodSelector
- Active payment form below
- On successful payment: add timeline event, navigate back to workspace with 'DepositPaid' status

**Step 6: Add route**

```typescript
<Route path="workspace/:quoteId/payment" element={<PaymentPage />} />
```

**Step 7: Verify full flow in browser**

Run: `bun run dev`
Expected: Full journey works end-to-end: Landing → New Request → Workspace → Accept → Terms → Payment → Confirmed.

**Step 8: Commit**

```bash
git add -A && git commit -m "feat: payment page with card, EFT, and account options"
```

---

### Task 14: Staff-Specific Views & Actions

**Files:**
- Modify: `src/components/workspace/KitPanel.tsx` (staff actions)
- Modify: `src/components/workspace/QuotePanel.tsx` (staff controls)
- Modify: `src/components/workspace/StatusBar.tsx` (staff transitions)
- Modify: `src/components/landing/IncomingRequestList.tsx` (enhance)

**Step 1: Enhance staff kit panel**

Staff-specific actions on each item:
- Edit daily rate (inline input)
- Swap item (opens mini catalog browser)
- Remove item
- Add item from catalog

**Step 2: Enhance staff quote panel**

Staff controls:
- "Send Quote to Client" button (Sent status)
- Discount input (percentage or flat amount)
- Delivery fee adjustment
- "Mark as Accepted" override
- Add revision note

**Step 3: Enhance StatusBar for staff**

Staff can click forward/backward on status transitions. Client can only see status and click "Accept" when status is 'Sent' or 'Negotiating'.

**Step 4: Enhance IncomingRequestList**

- Show client name, company, shoot type, dates
- Status badges
- "Prepare Kit" button → creates a quote from request, navigates to workspace
- Sort by date, filter by status

**Step 5: Verify both roles**

Switch between Client and Staff in the same quote workspace. Verify different actions appear.

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: staff-specific views and actions"
```

---

### Task 15: Polish & Integration

**Files:**
- Various component files (animations, responsive fixes)
- Modify: `src/index.css` (final theme polish)

**Step 1: Add page transitions**

Simple fade-in/slide-up for page loads using CSS transitions or a minimal transition wrapper.

**Step 2: Add loading states**

Simulated loading states for:
- Submitting a request (500ms delay)
- Processing payment (1.5s delay with spinner)
- Sending quote (500ms delay)

**Step 3: Responsive polish**

Verify all pages work on mobile:
- Workspace: stack KitPanel above QuotePanel on small screens
- Chat: full-width on mobile
- Bundle grid: single column on mobile
- TopNav: hamburger menu on mobile

**Step 4: Empty states**

Add empty state illustrations/messages for:
- No past orders ("You haven't rented with us yet")
- No incoming requests (staff: "All caught up!")
- Empty kit (before adding items)

**Step 5: Seed demo data for walkthrough**

Pre-seed the stores with a sample in-progress quote so the demo starts with content. Include:
- 1 pending request from a client
- 1 active quote in 'Sent' status with chat messages
- Past orders with realistic data

**Step 6: Final build and deploy test**

Run: `bun run build`
Expected: Clean build, no errors, no warnings.

Run: `bun run preview`
Verify all routes work with the base path.

**Step 7: Commit**

```bash
git add -A && git commit -m "feat: polish, transitions, responsive layout, demo data"
```

---

## Task Dependency Graph

```
Task 1 (Setup)
  └→ Task 2 (Types & Data)
       └→ Task 3 (Stores)
            └→ Task 4 (Theme & Shared Components)
                 └→ Task 5 (App Shell & Router)
                      ├→ Task 6 (Landing Page)
                      ├→ Task 7 (New Request)
                      ├→ Task 8 (Bundles)
                      └→ Task 9 (Previous Orders)
                           └→ Task 10 (Workspace — core)
                                └→ Task 11 (Chat)
                                └→ Task 12 (Terms)
                                     └→ Task 13 (Payment)
                                          └→ Task 14 (Staff Views)
                                               └→ Task 15 (Polish)
```

Tasks 6-9 can be parallelized (independent pages). Tasks 10+ are sequential (workspace depends on entry flows existing).
