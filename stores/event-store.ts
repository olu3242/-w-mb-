import { create } from 'zustand'
import type { Event } from '@/types'

type EventStore = {
  events: Event[]
  activeEvent: Event | null
  setEvents: (events: Event[]) => void
  setActiveEvent: (event: Event | null) => void
  updateEvent: (id: string, patch: Partial<Event>) => void
}

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  activeEvent: null,
  setEvents: (events) => set({ events }),
  setActiveEvent: (activeEvent) => set({ activeEvent }),
  updateEvent: (id, patch) =>
    set((state) => ({
      events: state.events.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      activeEvent: state.activeEvent?.id === id ? { ...state.activeEvent, ...patch } : state.activeEvent,
    })),
}))
