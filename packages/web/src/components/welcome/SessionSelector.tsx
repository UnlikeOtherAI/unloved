import { useEffect } from 'react'
import { Select } from '../ui'
import { useSessionStore } from '../../stores/session'

export default function SessionSelector() {
  const existingSessions = useSessionStore((state) => state.existingSessions)
  const selectedSession = useSessionStore((state) => state.selectedSession)
  const setSelectedSession = useSessionStore((state) => state.setSelectedSession)
  const fetchSessions = useSessionStore((state) => state.fetchSessions)

  useEffect(() => {
    void fetchSessions()
  }, [fetchSessions])

  if (existingSessions.length === 0) {
    return <p className="text-sm text-text-secondary">No tmux sessions found</p>
  }

  return (
    <Select
      options={existingSessions.map((session) => ({ value: session.name, label: session.name }))}
      value={selectedSession}
      onChange={setSelectedSession}
      placeholder="Select existing session"
    />
  )
}
