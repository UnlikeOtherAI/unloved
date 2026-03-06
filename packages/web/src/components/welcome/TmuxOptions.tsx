import { Checkbox, Input } from '../ui'
import { useSessionStore } from '../../stores/session'

export default function TmuxOptions() {
  const useTmux = useSessionStore((state) => state.useTmux)
  const sessionName = useSessionStore((state) => state.sessionName)
  const setUseTmux = useSessionStore((state) => state.setUseTmux)
  const setSessionName = useSessionStore((state) => state.setSessionName)

  return (
    <div className="flex items-center gap-3">
      <Checkbox label="Use tmux" checked={useTmux} onChange={setUseTmux} />
      <Input
        value={sessionName}
        onChange={(event) => setSessionName(event.target.value)}
        placeholder="Session name..."
        disabled={!useTmux}
        className={useTmux ? 'flex-1' : 'flex-1 opacity-50'}
      />
    </div>
  )
}
