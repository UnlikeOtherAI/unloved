import { create } from 'zustand'
import type { AppConfig, ThemeMode } from '@unloved/shared'

const applyThemeClass = (mode: ThemeMode) => {
  document.documentElement.classList.toggle('dark', mode === 'dark')
}

export interface ThemeStore {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  toggle: () => void
  hydrate: () => Promise<void>
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  mode: 'light',
  setMode: (mode) => {
    set({ mode })
    applyThemeClass(mode)
    void fetch('/api/config', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ theme: mode }),
    })
  },
  toggle: () => {
    const nextMode: ThemeMode = get().mode === 'dark' ? 'light' : 'dark'
    get().setMode(nextMode)
  },
  hydrate: async () => {
    try {
      const response = await fetch('/api/config')
      if (!response.ok) return
      const config: AppConfig = await response.json()
      set({ mode: config.theme })
      applyThemeClass(config.theme)
    } catch {
      // Server unreachable, keep default theme
    }
  },
}))
