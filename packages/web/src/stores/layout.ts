import { create } from 'zustand'

export type ViewMode = 'both' | 'side-by-side' | 'terminal' | 'preview'
export type PreviewViewport =
  | 'default'
  | 'mobile-portrait'
  | 'mobile-landscape'
  | 'tablet-portrait'
  | 'tablet-landscape'
  | 'desktop'

export const VIEWPORT_SIZES: Record<Exclude<PreviewViewport, 'default'>, { w: number; h: number }> = {
  'mobile-portrait': { w: 375, h: 812 },
  'mobile-landscape': { w: 812, h: 375 },
  'tablet-portrait': { w: 768, h: 1024 },
  'tablet-landscape': { w: 1024, h: 768 },
  desktop: { w: 1280, h: 800 },
}

const COOKIE_VIEW = 'unloved_view_mode'
const COOKIE_VIEWPORT = 'unloved_preview_viewport'
const VALID_MODES: ViewMode[] = ['both', 'side-by-side', 'terminal', 'preview']
const VALID_VIEWPORTS: PreviewViewport[] = [
  'default', 'mobile-portrait', 'mobile-landscape',
  'tablet-portrait', 'tablet-landscape', 'desktop',
]

function readCookie<T extends string>(key: string, valid: T[], fallback: T): T {
  const match = document.cookie.match(new RegExp(`(?:^|; )${key}=([^;]*)`))
  const val = match?.[1] as T | undefined
  return val && valid.includes(val) ? val : fallback
}

function writeCookie(key: string, val: string) {
  document.cookie = `${key}=${val};path=/;max-age=31536000;SameSite=Lax`
}

export interface LayoutStore {
  sidebarOpen: boolean
  viewMode: ViewMode
  previewViewport: PreviewViewport
  toggleSidebar: () => void
  closeSidebar: () => void
  setViewMode: (mode: ViewMode) => void
  setPreviewViewport: (vp: PreviewViewport) => void
}

export const useLayoutStore = create<LayoutStore>((set) => ({
  sidebarOpen: true,
  viewMode: readCookie(COOKIE_VIEW, VALID_MODES, 'both'),
  previewViewport: readCookie(COOKIE_VIEWPORT, VALID_VIEWPORTS, 'default'),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),
  setViewMode: (viewMode) => {
    writeCookie(COOKIE_VIEW, viewMode)
    set({ viewMode })
  },
  setPreviewViewport: (previewViewport) => {
    writeCookie(COOKIE_VIEWPORT, previewViewport)
    set({ previewViewport })
  },
}))
