import { create } from 'zustand'
import type { TmuxSession, SessionMeta } from '@unloved/shared'

export interface SessionStore {
  sessions: TmuxSession[]
  activeSessionName: string | null
  sessionMetas: Record<string, SessionMeta>
  error: string | null

  fetchSessions: () => Promise<void>
  setActiveSession: (name: string) => void
  clearActiveSession: () => void
  createSession: (name: string) => Promise<void>
  fetchMeta: (name: string) => Promise<void>
  triggerRestart: (name: string) => Promise<void>
  startPolling: () => () => void
}

let pollTimer: ReturnType<typeof setInterval> | null = null

export const useSessionStore = create<SessionStore>((set, get) => ({
  sessions: [],
  activeSessionName: null,
  sessionMetas: {},
  error: null,

  fetchSessions: async () => {
    try {
      const res = await fetch('/api/tmux/sessions')
      if (!res.ok) return
      const sessions: TmuxSession[] = await res.json()
      set({ sessions })
    } catch {
      // Server unreachable
    }
  },

  setActiveSession: (name) => {
    set({ activeSessionName: name, error: null })
    void get().fetchMeta(name)
  },

  clearActiveSession: () => {
    set({ activeSessionName: null })
  },

  createSession: async (name) => {
    set({ error: null })
    try {
      const res = await fetch('/api/tmux/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) {
        const data = await res.json()
        set({ error: data.error ?? 'Failed to create session' })
        return
      }
      await get().fetchSessions()
      get().setActiveSession(name)
    } catch {
      set({ error: 'Server unreachable' })
    }
  },

  fetchMeta: async (name) => {
    try {
      const res = await fetch(`/api/sessions/${encodeURIComponent(name)}/meta`)
      if (!res.ok) return
      const meta: SessionMeta = await res.json()
      set((s) => ({ sessionMetas: { ...s.sessionMetas, [name]: meta } }))
    } catch {
      // Ignore
    }
  },

  triggerRestart: async (name) => {
    try {
      await fetch(`/api/sessions/${encodeURIComponent(name)}/restart`, { method: 'POST' })
    } catch {
      // Best effort
    }
  },

  startPolling: () => {
    if (pollTimer) clearInterval(pollTimer)

    const tick = () => {
      void get().fetchSessions()
      const active = get().activeSessionName
      if (active) void get().fetchMeta(active)
    }

    tick()
    pollTimer = setInterval(tick, 3000)

    return () => {
      if (pollTimer) {
        clearInterval(pollTimer)
        pollTimer = null
      }
    }
  },
}))
