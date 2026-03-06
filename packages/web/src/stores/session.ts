import { create } from 'zustand'
import type { TmuxSession } from '@unloved/shared'

export interface SessionStore {
  useTmux: boolean
  sessionName: string
  existingSessions: TmuxSession[]
  selectedSession: string | null
  setUseTmux: (v: boolean) => void
  setSessionName: (v: string) => void
  setSelectedSession: (v: string | null) => void
  fetchSessions: () => Promise<void>
}

export const useSessionStore = create<SessionStore>((set) => ({
  useTmux: true,
  sessionName: '',
  existingSessions: [],
  selectedSession: null,
  setUseTmux: (useTmux) => set({ useTmux }),
  setSessionName: (sessionName) => set({ sessionName }),
  setSelectedSession: (selectedSession) => set({ selectedSession }),
  fetchSessions: async () => {
    const response = await fetch('/api/tmux/sessions')
    const sessions: TmuxSession[] = await response.json()
    set({ existingSessions: sessions })
  },
}))
