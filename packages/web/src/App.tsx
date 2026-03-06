import { useEffect } from 'react'
import WelcomeScreen from './components/welcome/WelcomeScreen'
import { useSessionStore } from './stores/session'
import { useThemeStore } from './stores/theme'

export function App() {
  const hydrate = useThemeStore((state) => state.hydrate)
  const fetchSessions = useSessionStore((state) => state.fetchSessions)

  useEffect(() => {
    void hydrate()
    void fetchSessions()
  }, [hydrate, fetchSessions])

  return <WelcomeScreen />
}
