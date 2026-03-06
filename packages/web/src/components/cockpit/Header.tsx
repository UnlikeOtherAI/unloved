import { useState, useEffect, useRef } from 'react'
import { Menu, Hammer, ChevronLeft, ChevronRight } from 'lucide-react'
import { useSessionStore } from '../../stores/session'
import { useLayoutStore } from '../../stores/layout'
import ViewModeSwitch from './ViewModeSwitch'
import ViewportSwitch from './ViewportSwitch'
import SessionMenu from './SessionMenu'
import UrlBar from './UrlBar'

export default function Header() {
  const activeSessionName = useSessionStore((s) => s.activeSessionName)
  const sessionMetas = useSessionStore((s) => s.sessionMetas)
  const triggerRestart = useSessionStore((s) => s.triggerRestart)
  const toggleSidebar = useLayoutStore((s) => s.toggleSidebar)
  const viewMode = useLayoutStore((s) => s.viewMode)

  const meta = activeSessionName ? sessionMetas[activeSessionName] : null
  const previewUrl = meta?.previewUrl ?? ''
  const showPreview = viewMode !== 'terminal'

  // iframe navigation history tracking
  const [navPos, setNavPos] = useState(0)
  const [navLen, setNavLen] = useState(1)
  const navActionRef = useRef(false)
  const initialLoadRef = useRef(true)

  useEffect(() => {
    setNavPos(0)
    setNavLen(1)
    initialLoadRef.current = true
  }, [previewUrl])

  useEffect(() => {
    if (!previewUrl || !showPreview) return

    let iframe: HTMLIFrameElement | null = null
    let mounted = true

    const onLoad = () => {
      if (!mounted) return
      if (initialLoadRef.current) {
        initialLoadRef.current = false
        return
      }
      if (navActionRef.current) {
        navActionRef.current = false
        return
      }
      setNavPos((prev) => {
        const next = prev + 1
        setNavLen(next + 1)
        return next
      })
    }

    const timer = setTimeout(() => {
      iframe = document.querySelector('iframe[title="Preview"]')
      if (iframe) iframe.addEventListener('load', onLoad)
    }, 50)

    return () => {
      mounted = false
      clearTimeout(timer)
      if (iframe) iframe.removeEventListener('load', onLoad)
    }
  }, [previewUrl, showPreview])

  const canGoBack = navPos > 0
  const canGoForward = navPos < navLen - 1

  const goBack = () => {
    const iframe = document.querySelector('iframe[title="Preview"]') as HTMLIFrameElement | null
    if (!iframe?.contentWindow || !canGoBack) return
    navActionRef.current = true
    setNavPos((p) => p - 1)
    iframe.contentWindow.history.back()
    setTimeout(() => { navActionRef.current = false }, 500)
  }

  const goForward = () => {
    const iframe = document.querySelector('iframe[title="Preview"]') as HTMLIFrameElement | null
    if (!iframe?.contentWindow || !canGoForward) return
    navActionRef.current = true
    setNavPos((p) => p + 1)
    iframe.contentWindow.history.forward()
    setTimeout(() => { navActionRef.current = false }, 500)
  }

  return (
    <header className="flex h-[var(--header-height)] shrink-0 items-center gap-3 border-b border-divider px-4 dark:border-divider-dark">
      <button
        type="button"
        onClick={toggleSidebar}
        className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-sidebar text-text-secondary transition-colors hover:bg-sidebar-hover dark:hover:bg-divider-dark"
        aria-label="Toggle sidebar"
      >
        <Menu size={18} />
      </button>

      {activeSessionName ? (
        <>
          <span className="shrink-0 font-mono text-sm font-medium text-text-primary dark:text-text-dark">
            {activeSessionName}
          </span>

          <div className="flex-1" />

          <ViewModeSwitch />

          {showPreview && (
            <div className="hidden items-center gap-1 md:flex">
              <button
                type="button"
                onClick={goBack}
                disabled={!canGoBack}
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-sidebar-hover disabled:cursor-default disabled:opacity-30 dark:hover:bg-divider-dark"
                aria-label="Go back"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={goForward}
                disabled={!canGoForward}
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-sidebar-hover disabled:cursor-default disabled:opacity-30 dark:hover:bg-divider-dark"
                aria-label="Go forward"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {showPreview && activeSessionName && (
            <UrlBar previewUrl={previewUrl} activeSessionName={activeSessionName} />
          )}

          {showPreview && (
            <div className="hidden md:block">
              <ViewportSwitch />
            </div>
          )}

          {meta?.restartCommand && (
            <button
              type="button"
              onClick={() => triggerRestart(activeSessionName)}
              className="hidden h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-button bg-accent px-3 text-xs font-medium text-white transition-colors hover:bg-accent-hover md:flex"
              aria-label="Rebuild"
            >
              <Hammer size={14} />
              Rebuild
            </button>
          )}

          <SessionMenu />
        </>
      ) : (
        <span className="text-sm text-text-secondary">Select a session</span>
      )}
    </header>
  )
}
