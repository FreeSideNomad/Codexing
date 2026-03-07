import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ChatMessage, UserRole } from '@/types'
import { demoMessages } from '@/data/demo'

interface ChatState {
  messages: ChatMessage[]
  sendMessage: (
    quoteId: string,
    text: string,
    sender: { userId: string; name: string; role: UserRole },
  ) => void
  getMessagesForQuote: (quoteId: string) => ChatMessage[]
  markAsRead: (messageId: string, userId: string) => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [...demoMessages],
      sendMessage: (quoteId, text, sender) => {
        const message: ChatMessage = {
          id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          quoteId,
          sender,
          text,
          timestamp: new Date().toISOString(),
          readBy: [sender.userId],
        }
        set((s) => ({ messages: [...s.messages, message] }))
      },
      getMessagesForQuote: (quoteId) => get().messages.filter((m) => m.quoteId === quoteId),
      markAsRead: (messageId, userId) =>
        set((s) => ({
          messages: s.messages.map((m) =>
            m.id === messageId && !m.readBy.includes(userId)
              ? { ...m, readBy: [...m.readBy, userId] }
              : m,
          ),
        })),
    }),
    { name: 'vi-chat' },
  ),
)
