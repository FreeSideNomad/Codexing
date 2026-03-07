import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Quote, QuoteLineItem, QuoteStatus, Revision, KitItem } from '@/types'
import { demoQuote } from '@/data/demo'

interface QuoteState {
  quotes: Quote[]
  activeQuoteId: string | null
  setActiveQuote: (id: string) => void
  getActiveQuote: () => Quote | undefined
  createQuote: (requestId: string, items: KitItem[], days: number) => string // returns quote ID
  addLineItem: (quoteId: string, item: QuoteLineItem) => void
  removeLineItem: (quoteId: string, kitItemId: string) => void
  updateLineItem: (quoteId: string, kitItemId: string, updates: Partial<QuoteLineItem>) => void
  setDiscount: (quoteId: string, discount: number) => void
  setDeliveryFee: (quoteId: string, fee: number) => void
  setStatus: (quoteId: string, status: QuoteStatus) => void
  addRevision: (quoteId: string, actor: string, description: string) => void
  getSubtotal: (quoteId: string) => number
  getVatAmount: (quoteId: string) => number
  getTotal: (quoteId: string) => number
  getDepositAmount: (quoteId: string) => number
}

export const useQuoteStore = create<QuoteState>()(
  persist(
    (set, get) => ({
      quotes: [demoQuote],
      activeQuoteId: null,
      setActiveQuote: (id) => set({ activeQuoteId: id }),
      getActiveQuote: () => {
        const s = get()
        return s.quotes.find((q) => q.id === s.activeQuoteId)
      },
      createQuote: (requestId, items, days) => {
        const id = `qt-${Date.now()}`
        const quoteNumber = `VI-QT-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`
        const lineItems: QuoteLineItem[] = items.map((item) => ({
          kitItemId: item.id,
          name: item.name,
          category: item.category,
          dailyRate: item.dailyRate,
          quantity: 1,
          days,
        }))
        const quote: Quote = {
          id,
          requestId,
          quoteNumber,
          items: lineItems,
          discount: 0,
          deliveryFee: 1500,
          vatRate: 0.15,
          status: 'Draft',
          revisions: [],
          createdAt: new Date().toISOString(),
        }
        set((s) => ({ quotes: [...s.quotes, quote], activeQuoteId: id }))
        return id
      },
      addLineItem: (quoteId, item) =>
        set((s) => ({
          quotes: s.quotes.map((q) =>
            q.id === quoteId ? { ...q, items: [...q.items, item] } : q,
          ),
        })),
      removeLineItem: (quoteId, kitItemId) =>
        set((s) => ({
          quotes: s.quotes.map((q) =>
            q.id === quoteId
              ? { ...q, items: q.items.filter((i) => i.kitItemId !== kitItemId) }
              : q,
          ),
        })),
      updateLineItem: (quoteId, kitItemId, updates) =>
        set((s) => ({
          quotes: s.quotes.map((q) =>
            q.id === quoteId
              ? {
                  ...q,
                  items: q.items.map((i) => (i.kitItemId === kitItemId ? { ...i, ...updates } : i)),
                }
              : q,
          ),
        })),
      setDiscount: (quoteId, discount) =>
        set((s) => ({
          quotes: s.quotes.map((q) => (q.id === quoteId ? { ...q, discount } : q)),
        })),
      setDeliveryFee: (quoteId, fee) =>
        set((s) => ({
          quotes: s.quotes.map((q) => (q.id === quoteId ? { ...q, deliveryFee: fee } : q)),
        })),
      setStatus: (quoteId, status) =>
        set((s) => ({
          quotes: s.quotes.map((q) => (q.id === quoteId ? { ...q, status } : q)),
        })),
      addRevision: (quoteId, actor, description) => {
        const revision: Revision = {
          id: `rev-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor,
          description,
        }
        set((s) => ({
          quotes: s.quotes.map((q) =>
            q.id === quoteId ? { ...q, revisions: [...q.revisions, revision] } : q,
          ),
        }))
      },
      getSubtotal: (quoteId) => {
        const quote = get().quotes.find((q) => q.id === quoteId)
        if (!quote) return 0
        return quote.items.reduce((sum, i) => sum + i.dailyRate * i.quantity * i.days, 0)
      },
      getVatAmount: (quoteId) => {
        const quote = get().quotes.find((q) => q.id === quoteId)
        if (!quote) return 0
        const subtotal = get().getSubtotal(quoteId)
        return (subtotal - quote.discount + quote.deliveryFee) * quote.vatRate
      },
      getTotal: (quoteId) => {
        const quote = get().quotes.find((q) => q.id === quoteId)
        if (!quote) return 0
        const subtotal = get().getSubtotal(quoteId)
        const vat = get().getVatAmount(quoteId)
        return subtotal - quote.discount + quote.deliveryFee + vat
      },
      getDepositAmount: (quoteId) => get().getTotal(quoteId) * 0.3,
    }),
    {
      name: 'vi-quotes',
      version: 2,
      migrate: () => ({
        quotes: [demoQuote],
        activeQuoteId: null,
      }),
    },
  ),
)
