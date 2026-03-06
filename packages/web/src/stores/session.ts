import { create } from 'zustand'
import type { TmuxSession } from '@unloved/shared'

export type SessionMode = 'tmux' | 'quick'

export interface SessionStore {
  mode: SessionMode
  sessionName: string
  existingSessions: TmuxSession[]
  selectedSession: string | null
  setMode: (mode: SessionMode) => void
  setSessionName: (v: string) => void
  setSelectedSession: (v: string | null) => void
  fetchSessions: () => Promise<void>
}

export const useSessionStore = create<SessionStore>((set) => ({
  mode: 'tmux',
  sessionName: '',
  existingSessions: [],
  selectedSession: null,
  setMode: (mode) => set({ mode, selectedSession: null }),
  setSessionName: (sessionName) => set({ sessionName }),
  setSelectedSession: (selectedSession) => set({ selectedSession }),
  fetchSessions: async () => {
    try {
      const response = await fetch('/api/tmux/sessions')
      if (!response.ok) return
      const sessions: TmuxSession[] = await response.json()
      set({ existingSessions: sessions })
    } catch {
      // Server unreachable, keep empty sessions
    }
  },
}))
