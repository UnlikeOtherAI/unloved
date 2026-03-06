import { Button, Input } from '../ui'
import { useSessionStore } from '../../stores/session'

export default function TmuxNewSession() {
  const sessionName = useSessionStore((s) => s.sessionName)
  const setSessionName = useSessionStore((s) => s.setSessionName)

  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-medium text-text-secondary">New tmux session</label>
      <Input
        value={sessionName}
        onChange={(e) => setSessionName(e.target.value)}
        placeholder="Session name..."
      />
      <Button variant="primary" className="w-full" disabled={!sessionName.trim()}>
        Create session
      </Button>
    </div>
  )
}
