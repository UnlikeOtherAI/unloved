import { useState } from 'react'
import { useSessionStore } from '../../stores/session'
import { useLayoutStore } from '../../stores/layout'
import { Button, Input } from '../ui'

interface Props {
  onClose: () => void
}

export default function CreateSessionDialog({ onClose }: Props) {
  const [name, setName] = useState('')
  const createSession = useSessionStore((s) => s.createSession)
  const error = useSessionStore((s) => s.error)
  const closeSidebar = useLayoutStore((s) => s.closeSidebar)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    await createSession(trimmed)
    if (!useSessionStore.getState().error) {
      onClose()
      closeSidebar()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 rounded-sidebar bg-sidebar-active p-3 shadow-subtle dark:bg-bg-dark">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Session name"
        autoFocus
        className="h-8 text-sm"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" className="flex-1 h-8 text-xs">Create</Button>
        <Button variant="ghost" onClick={onClose} className="h-8 text-xs">Cancel</Button>
      </div>
    </form>
  )
}
