import { X } from 'lucide-react'
import { useLayoutStore } from '../../stores/layout'
import Sidebar from './Sidebar'
import MainArea from './MainArea'

export default function CockpitLayout() {
  const sidebarOpen = useLayoutStore((s) => s.sidebarOpen)
  const closeSidebar = useLayoutStore((s) => s.closeSidebar)

  return (
    <div className="flex h-dvh w-dvw overflow-hidden bg-bg dark:bg-bg-dark">
      {/* Desktop: animated inline sidebar */}
      <div
        className="hidden shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out md:block"
        style={{ width: sidebarOpen ? 'var(--sidebar-width)' : '0px' }}
      >
        <Sidebar />
      </div>

      {/* Mobile: full-screen backdrop (behind sidebar) */}
      <button
        type="button"
        className={[
          'fixed inset-0 z-40 cursor-default bg-black/20 backdrop-blur-[2px] transition-opacity duration-300 ease-in-out md:hidden',
          sidebarOpen
            ? 'visible opacity-100'
            : 'invisible opacity-0',
        ].join(' ')}
        onClick={closeSidebar}
        aria-label="Close sidebar"
      />

      {/* Mobile: sliding sidebar panel */}
      <div
        className={[
          'fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out md:hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
        style={{ width: 'var(--sidebar-width)' }}
      >
        <Sidebar />
        <button
          type="button"
          onClick={closeSidebar}
          className="absolute right-2 top-3.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-sidebar-hover dark:hover:bg-divider-dark"
          aria-label="Close sidebar"
        >
          <X size={15} />
        </button>
      </div>

      <MainArea />
    </div>
  )
}
