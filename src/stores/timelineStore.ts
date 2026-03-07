import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TimelineEvent } from '@/types'
import { demoTimeline } from '@/data/demo'

interface TimelineState {
  events: TimelineEvent[]
  addEvent: (quoteId: string, label: string, actor: string, description: string) => void
  getEventsForQuote: (quoteId: string) => TimelineEvent[]
}

export const useTimelineStore = create<TimelineState>()(
  persist(
    (set, get) => ({
      events: [...demoTimeline],
      addEvent: (quoteId, label, actor, description) => {
        const event: TimelineEvent = {
          id: `evt-${Date.now()}`,
          quoteId,
          timestamp: new Date().toISOString(),
          label,
          actor,
          description,
        }
        set((s) => ({ events: [...s.events, event] }))
      },
      getEventsForQuote: (quoteId) =>
        get().events.filter((e) => e.quoteId === quoteId),
    }),
    { name: 'vi-timeline' },
  ),
)
