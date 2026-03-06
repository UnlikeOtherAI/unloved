import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ThemeToggle } from '../ui'
import SessionList from './SessionList'
import CreateSessionDialog from './CreateSessionDialog'

export default function Sidebar() {
  const [creating, setCreating] = useState(false)

  return (
    <aside className="flex h-full min-w-[var(--sidebar-width)] flex-col border-r border-divider bg-sidebar dark:border-divider-dark dark:bg-card-dark">
      <div className="flex items-center gap-2.5 px-5 py-4">
        <img src="/logo.png" alt="unloved" className="h-7 w-7" />
        <span className="text-sm font-semibold text-text-primary dark:text-text-dark">unloved</span>
      </div>

      <div className="h-px bg-divider dark:bg-divider-dark" />

      <div className="flex-1 overflow-y-auto px-3 py-2">
        <SessionList />
      </div>

      <div className="px-3 pb-2">
        {creating ? (
          <CreateSessionDialog onClose={() => setCreating(false)} />
        ) : (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="flex w-full cursor-pointer items-center gap-2 rounded-sidebar px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-sidebar-hover dark:hover:bg-divider-dark"
          >
            <Plus size={16} />
            New session
          </button>
        )}
      </div>

      <div className="border-t border-divider px-3 py-3 dark:border-divider-dark">
        <ThemeToggle className="static h-8 w-8" />
      </div>
    </aside>
  )
}
