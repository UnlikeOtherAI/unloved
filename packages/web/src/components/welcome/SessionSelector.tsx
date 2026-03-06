import { Button, Select } from '../ui'
import { useSessionStore } from '../../stores/session'

export default function SessionSelector() {
  const existingSessions = useSessionStore((s) => s.existingSessions)
  const selectedSession = useSessionStore((s) => s.selectedSession)
  const setSelectedSession = useSessionStore((s) => s.setSelectedSession)

  if (existingSessions.length === 0) {
    return <p className="text-center text-sm text-text-secondary">No tmux sessions running</p>
  }

  return (
    <div className="flex flex-col gap-3">
      <Select
        options={existingSessions.map((s) => ({ value: s.name, label: s.name }))}
        value={selectedSession}
        onChange={setSelectedSession}
        placeholder="Select a session..."
      />
      <Button variant="secondary" className="w-full" disabled={!selectedSession}>
        Attach to session
      </Button>
    </div>
  )
}
