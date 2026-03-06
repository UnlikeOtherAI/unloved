import { useEffect } from 'react'
import CockpitLayout from './components/cockpit/CockpitLayout'
import { useSessionStore } from './stores/session'
import { useThemeStore } from './stores/theme'

export function App() {
  const hydrate = useThemeStore((s) => s.hydrate)
  const startPolling = useSessionStore((s) => s.startPolling)

  useEffect(() => {
    void hydrate()
    const stopPolling = startPolling()
    return stopPolling
  }, [hydrate, startPolling])

  return <CockpitLayout />
}
