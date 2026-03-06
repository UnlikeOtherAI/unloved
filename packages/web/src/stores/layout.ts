import { create } from 'zustand'

export interface LayoutStore {
  sidebarOpen: boolean
  previewVisible: boolean
  toggleSidebar: () => void
  setPreviewVisible: (v: boolean) => void
}

export const useLayoutStore = create<LayoutStore>((set) => ({
  sidebarOpen: true,
  previewVisible: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setPreviewVisible: (previewVisible) => set({ previewVisible }),
}))
