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

      {/* Mobile: overlay sidebar with blur backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="h-full w-[var(--sidebar-width)] shrink-0">
            <Sidebar />
          </div>
          <button
            type="button"
            className="flex-1 cursor-default bg-black/40 backdrop-blur-sm"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          />
        </div>
      )}

      <MainArea />
    </div>
  )
}
