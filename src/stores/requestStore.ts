import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RentalRequest, ShootType, KitItem, RequestStatus } from '@/types'

interface RequestState {
  requests: RentalRequest[]
  draftShootType: ShootType | ''
  draftStartDate: string
  draftEndDate: string
  draftLocation: string
  draftNotes: string
  draftItems: KitItem[]
  setDraftField: (field: string, value: string) => void
  addDraftItem: (item: KitItem) => void
  removeDraftItem: (itemId: string) => void
  clearDraft: () => void
  submitRequest: (clientId: string) => string // returns request ID
  updateRequestStatus: (requestId: string, status: RequestStatus) => void
}

export const useRequestStore = create<RequestState>()(
  persist(
    (set, get) => ({
      requests: [
        {
          id: 'req-demo-001',
          clientId: 'u-client-01',
          shootType: 'Documentary',
          dates: { start: '2026-03-15', end: '2026-03-19' },
          location: 'Soweto, Johannesburg',
          notes: 'Heritage documentary about local artisans. Need a versatile camera setup with good audio.',
          status: 'pending',
          createdAt: '2026-03-05T09:30:00Z',
        },
        {
          id: 'req-demo-002',
          clientId: 'u-client-01',
          shootType: 'Commercial',
          dates: { start: '2026-03-22', end: '2026-03-24' },
          location: 'Camps Bay, Cape Town',
          notes: 'Beach resort commercial, 30-second spot. Need cinema-quality with good stabilization.',
          status: 'pending',
          createdAt: '2026-03-06T14:15:00Z',
        },
      ],
      draftShootType: '',
      draftStartDate: '',
      draftEndDate: '',
      draftLocation: '',
      draftNotes: '',
      draftItems: [],
      setDraftField: (field, value) => set({ [field]: value } as Partial<RequestState>),
      addDraftItem: (item) =>
        set((s) => ({
          draftItems: s.draftItems.some((i) => i.id === item.id)
            ? s.draftItems
            : [...s.draftItems, item],
        })),
      removeDraftItem: (itemId) =>
        set((s) => ({ draftItems: s.draftItems.filter((i) => i.id !== itemId) })),
      clearDraft: () =>
        set({
          draftShootType: '',
          draftStartDate: '',
          draftEndDate: '',
          draftLocation: '',
          draftNotes: '',
          draftItems: [],
        }),
      submitRequest: (clientId) => {
        const s = get()
        const id = `req-${Date.now()}`
        const request: RentalRequest = {
          id,
          clientId,
          shootType: s.draftShootType as ShootType,
          dates: { start: s.draftStartDate, end: s.draftEndDate },
          location: s.draftLocation,
          notes: s.draftNotes,
          status: 'pending',
          items: s.draftItems.length > 0 ? s.draftItems : undefined,
          createdAt: new Date().toISOString(),
        }
        set((prev) => ({ requests: [...prev.requests, request] }))
        return id
      },
      updateRequestStatus: (requestId, status) =>
        set((s) => ({
          requests: s.requests.map((r) => (r.id === requestId ? { ...r, status } : r)),
        })),
    }),
    {
      name: 'vi-requests',
      version: 2,
      migrate: () => ({
        requests: [],
        draftShootType: '',
        draftStartDate: '',
        draftEndDate: '',
        draftLocation: '',
        draftNotes: '',
        draftItems: [],
      }),
    },
  ),
)
