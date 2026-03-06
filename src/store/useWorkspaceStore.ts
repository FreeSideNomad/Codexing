import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  emailReplies,
  kitItems,
  messages,
  quote,
  revisionLog,
  terms,
  timeline,
  type Message,
  type QuoteStatus,
} from '@/data/mockData'

type WorkspaceState = {
  isLoggedIn: boolean
  userType: 'client' | 'staff'
  quoteStatus: QuoteStatus
  termsAccepted: boolean
  chat: Message[]
  selectedKitIds: string[]
  processedEmailReplyIds: string[]
  login: (userType: 'client' | 'staff') => void
  logout: () => void
  toggleKitSelection: (kitId: string) => void
  sendMessage: (text: string, role?: 'client' | 'employee' | 'system') => void
  setQuoteStatus: (status: QuoteStatus) => void
  setTermsAccepted: (value: boolean) => void
  syncQuoteEmailRepliesToChat: () => number
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      userType: 'client',
      quoteStatus: quote.status,
      termsAccepted: false,
      chat: messages,
      selectedKitIds: [],
      processedEmailReplyIds: [],
      login: (userType) => set({ isLoggedIn: true, userType }),
      logout: () => set({ isLoggedIn: false }),
      toggleKitSelection: (kitId) =>
        set((state) => ({
          selectedKitIds: state.selectedKitIds.includes(kitId)
            ? state.selectedKitIds.filter((id) => id !== kitId)
            : [...state.selectedKitIds, kitId],
        })),
      sendMessage: (text, role = 'client') =>
        set((state) => ({
          chat: [
            ...state.chat,
            {
              id: `m-${crypto.randomUUID()}`,
              from: role === 'employee' ? 'Employee User' : role === 'system' ? 'System' : 'Client User',
              role,
              text,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              readBy: [],
            },
          ],
        })),
      setQuoteStatus: (status) => set({ quoteStatus: status }),
      setTermsAccepted: (value) => set({ termsAccepted: value }),
      syncQuoteEmailRepliesToChat: () => {
        const state = get()
        const quoteReplies = emailReplies.filter(
          (reply) =>
            reply.subject.toLowerCase().includes(quote.number.toLowerCase()) &&
            !state.processedEmailReplyIds.includes(reply.id),
        )
        if (quoteReplies.length === 0) return 0

        set((current) => ({
          processedEmailReplyIds: [...current.processedEmailReplyIds, ...quoteReplies.map((r) => r.id)],
          chat: [
            ...current.chat,
            ...quoteReplies.map((reply) => ({
              id: `email-${reply.id}`,
              from: reply.from,
              role: 'system' as const,
              text: `Email reply captured from quote subject: ${reply.body}`,
              time: reply.receivedAt,
              readBy: [],
              attachment: 'email-thread.eml',
            })),
          ],
        }))

        return quoteReplies.length
      },
    }),
    {
      name: 'vi-workspace-store',
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        userType: state.userType,
        quoteStatus: state.quoteStatus,
        termsAccepted: state.termsAccepted,
        chat: state.chat,
        selectedKitIds: state.selectedKitIds,
        processedEmailReplyIds: state.processedEmailReplyIds,
      }),
    },
  ),
)

export const workspaceData = { kitItems, quote, terms, timeline, revisionLog }
