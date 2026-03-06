import { Button } from '../ui'

export default function QuickSession() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-text-secondary">
        Start a disposable session without tmux. The session ends when you close the browser or stop
        the server.
      </p>
      <Button variant="primary" className="w-full">
        Start quick session
      </Button>
    </div>
  )
}
