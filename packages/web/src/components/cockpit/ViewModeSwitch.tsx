import { TerminalSquare, AppWindow, Rows2, Columns2 } from 'lucide-react'
import { useLayoutStore, type ViewMode } from '../../stores/layout'
import Tooltip from '../ui/Tooltip'

const modes: { value: ViewMode; icon: typeof Columns2; label: string; splitOnly?: boolean }[] = [
  { value: 'both', icon: Rows2, label: 'Stacked', splitOnly: true },
  { value: 'side-by-side', icon: Columns2, label: 'Side by side', splitOnly: true },
  { value: 'terminal', icon: TerminalSquare, label: 'Chat only' },
  { value: 'preview', icon: AppWindow, label: 'Workspace only' },
]

export default function ViewModeSwitch() {
  const viewMode = useLayoutStore((s) => s.viewMode)
  const setViewMode = useLayoutStore((s) => s.setViewMode)

  return (
    <div className="flex h-8 items-center overflow-hidden rounded-lg border border-divider bg-sidebar dark:border-divider-dark dark:bg-bg-dark">
      {modes.map(({ value, icon: Icon, label, splitOnly }) => (
        <button
          key={value}
          type="button"
          onClick={() => setViewMode(value)}
          className={[
            'relative flex h-full cursor-pointer items-center gap-1.5 px-2.5 text-xs transition-colors',
            splitOnly ? 'hidden md:flex' : '',
            viewMode === value
              ? 'bg-accent text-white'
              : 'text-text-secondary hover:bg-sidebar-hover dark:hover:bg-divider-dark',
          ].join(' ')}
          aria-label={label}
        >
          <Icon size={14} />
          <Tooltip label={label} />
        </button>
      ))}
    </div>
  )
}
