import { useSessionStore } from '../../stores/session'
import { useLayoutStore } from '../../stores/layout'
import SessionItem from './SessionItem'

export default function SessionList() {
  const sessions = useSessionStore((s) => s.sessions)
  const activeSessionName = useSessionStore((s) => s.activeSessionName)
  const setActiveSession = useSessionStore((s) => s.setActiveSession)
  const closeSidebar = useLayoutStore((s) => s.closeSidebar)

  if (sessions.length === 0) {
    return (
      <p className="px-3 py-4 text-xs text-text-secondary">
        No tmux sessions running.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-0.5">
      {sessions.map((s) => (
        <SessionItem
          key={s.name}
          name={s.name}
          attached={s.attached}
          active={s.name === activeSessionName}
          onClick={() => { setActiveSession(s.name); closeSidebar() }}
        />
      ))}
    </div>
  )
}
