import { useSessionStore } from '../../stores/session'
import type { SessionMode } from '../../stores/session'
import SessionSelector from './SessionSelector'
import TmuxNewSession from './TmuxNewSession'
import QuickSession from './QuickSession'

const TABS: { key: SessionMode; label: string }[] = [
  { key: 'tmux', label: 'Tmux Session' },
  { key: 'quick', label: 'Quick Session' },
]

function ModeTab({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex-1 rounded-button py-2 text-sm font-medium transition-colors duration-150 cursor-pointer',
        active
          ? 'bg-accent text-white'
          : 'text-text-secondary hover:text-text-primary dark:hover:text-text-dark',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

export default function WelcomeCard() {
  const mode = useSessionStore((s) => s.mode)
  const setMode = useSessionStore((s) => s.setMode)

  return (
    <div className="w-full max-w-md rounded-card bg-card p-8 shadow-card dark:bg-card-dark">
      <div className="flex flex-col items-center gap-3">
        <img src="/logo.png" alt="unloved" className="h-12 w-12" />
        <h1 className="text-[28px] font-semibold text-text-primary dark:text-text-dark">unloved</h1>
        <p className="text-sm text-text-secondary">Local AI coding cockpit</p>
      </div>

      <div className="h-6" />

      <div className="flex gap-1 rounded-button bg-sidebar p-1 dark:bg-bg-dark">
        {TABS.map((tab) => (
          <ModeTab
            key={tab.key}
            active={mode === tab.key}
            label={tab.label}
            onClick={() => setMode(tab.key)}
          />
        ))}
      </div>

      <div className="h-5" />

      {mode === 'tmux' ? (
        <div className="flex flex-col gap-4">
          <TmuxNewSession />
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-divider dark:bg-divider-dark" />
            <span className="text-xs text-text-secondary">or attach to existing</span>
            <div className="h-px flex-1 bg-divider dark:bg-divider-dark" />
          </div>
          <SessionSelector />
        </div>
      ) : (
        <QuickSession />
      )}
    </div>
  )
}
