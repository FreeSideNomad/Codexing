# Visual Impact SA Workspace — Complete Rebuild Design

## Context

The current prototype is a shallow single-file demo built by Codex. Most features are stubbed (PDF downloads, payments, role-based views). This design replaces it with a proper multi-page app that demonstrates the full rental kit journey.

## Audience

Potential customers of Visual Impact SA. The demo must feel like a real product they'd use.

## Approach

Complete rebuild. The current codebase is a liability — nearly all code needs replacing. Clean architecture from scratch with React Router, split Zustand stores, and a dark cinematic theme.

## Screens

### Landing / Home
- Dark cinematic hero with Visual Impact SA branding
- Three entry paths (client view):
  - **New Request** — describe needs or browse catalog
  - **From Previous Order** — duplicate and modify a past order
  - **Browse Bundles** — pre-configured kits by shoot type or equipment tier
- Staff view: incoming requests list instead of 3 paths
- Persistent role switcher (Client / Staff) in top nav

### New Request Flow
1. Brief form: shoot type, dates, location, notes
2. Optional equipment catalog browser (filterable by category)
3. Submit — request goes to staff

### Previous Orders
- List of past orders (date, kit summary, total)
- Click to duplicate into Kit Editor with items pre-loaded
- Customer can swap items, adjust quantities, change dates

### Bundle Browser
- Grid filterable by shoot type (Documentary, Commercial, Event, Music Video, Corporate) and equipment tier (Essential, Professional, Premium)
- Each bundle: name, description, items preview, starting daily rate
- Select → loads into Kit Editor

### Kit Editor / Quote Workspace (core screen)
- Left panel: kit items with images, swap/remove actions
- Right panel: live quote (line items, subtotal, discount, delivery, VAT, total)
- Bottom panel: collapsible chat with staff
- Status bar: Draft → Sent → Negotiating → Accepted → Terms → Deposit → Confirmed
- "Request Changes" flags specific items

### Terms & Acceptance
- Rental terms displayed
- Acceptance checkbox
- Simulated PDF download

### Payment
- Payment method selection: Card, EFT, Account
- Card: simulated form → simulates success
- EFT: bank details + reference number
- Account: charge to account button
- All advance quote status on success

### Staff View
- Landing: incoming requests instead of 3 paths
- Kit Editor: staff can add/remove/swap items, set pricing, apply discounts
- Chat: staff side of conversation
- Quote: staff controls status transitions

## Data Model

### Core Types

```typescript
User { id, name, email, role: 'client' | 'staff', company }

KitItem { id, name, category, brand, model, serialNumber, dailyRate, replacementValue, condition, imageUrl }

Bundle { id, name, description, shootType, tier, items: KitItem[], startingDailyRate }

PastOrder { id, date, projectName, items: KitItem[], total, status }

Request { id, clientId, shootType, dates: { start, end }, location, notes, status, items?: KitItem[] }

Quote { id, requestId, quoteNumber, items: QuoteLineItem[], discount, deliveryFee, vatRate, status, revisions: Revision[] }

QuoteLineItem { kitItemId, name, dailyRate, quantity, days }

Revision { id, timestamp, actor, description, changes }

ChatMessage { id, quoteId, sender: { userId, role }, text, timestamp, attachments: string[], readBy: string[] }

TimelineEvent { id, quoteId, timestamp, label, actor, description }
```

### Zustand Stores (split by domain)
- **authStore** — user, role switching, login/logout
- **catalogStore** — equipment, bundles, past orders
- **requestStore** — new request creation
- **quoteStore** — active quote, line items, status, revisions
- **chatStore** — messages, send/receive, read tracking
- **timelineStore** — events for active quote

## Routing

```
/                           → Landing
/request/new                → New Request wizard
/orders                     → Previous Orders list
/orders/:id/reorder         → Kit Editor from past order
/bundles                    → Bundle Browser
/workspace/:quoteId         → Kit Editor / Quote Workspace
/workspace/:quoteId/terms   → Terms & Acceptance
/workspace/:quoteId/payment → Payment
```

## Layout

```
AppShell
├── TopNav (logo, nav links, RoleSwitcher)
├── <Outlet /> (route content)
└── Footer
```

## Component Architecture

### Shared
- TopNav, RoleSwitcher, StatusBadge, PriceDisplay (ZAR formatting)
- EquipmentCard — reused in catalog, bundles, kit editor, past orders
- QuoteSummary — live pricing sidebar

### Landing
- PathCard (3 entry points, client), IncomingRequestList (staff)

### Request
- RequestBriefForm, CatalogBrowser

### Bundles
- BundleGrid, BundleDetail

### Workspace
- KitPanel, QuotePanel, ChatPanel, StatusBar, RevisionHistory

### Payment
- PaymentMethodSelector, CardForm, EftDetails, AccountCharge

## Visual Theme

Dark cinematic:
- Background: near-black (#0a0a0f) with subtle gradient
- Cards/panels: dark gray (#1a1a2e) with subtle borders
- Accent: warm orange/red (Visual Impact brand)
- Text: off-white primary, muted gray secondary
- Clean sans-serif, cinematic headings
- Equipment images prominent on dark backgrounds
- Subtle film-industry touches (grid texture, accent glows)
