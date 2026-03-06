import { useLayoutStore } from '../../stores/layout'
import Sidebar from './Sidebar'
import MainArea from './MainArea'

export default function CockpitLayout() {
  const sidebarOpen = useLayoutStore((s) => s.sidebarOpen)

  return (
    <div className="flex h-dvh w-dvw overflow-hidden bg-bg dark:bg-bg-dark">
      {sidebarOpen && <Sidebar />}
      <MainArea />
    </div>
  )
}
