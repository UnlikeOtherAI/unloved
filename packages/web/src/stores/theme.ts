import { create } from 'zustand'
import type { AppConfig, ThemeMode } from '@unloved/shared'

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
    document.documentElement.classList.toggle('dark', mode === 'dark')
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
    const response = await fetch('/api/config')
    const config: AppConfig = await response.json()
    get().setMode(config.theme)
  },
}))
