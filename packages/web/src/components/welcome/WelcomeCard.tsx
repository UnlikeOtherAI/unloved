import { Button } from '../ui'
import SessionSelector from './SessionSelector'
import TmuxOptions from './TmuxOptions'

export default function WelcomeCard() {
  return (
    <div className="w-full max-w-md rounded-card bg-card p-8 shadow-card dark:bg-card-dark">
      <div className="flex flex-col items-center gap-3">
        <div className="h-12 w-12 rounded-button bg-black" />
        <h1 className="text-[28px] font-semibold text-text-primary dark:text-text-dark">unloved</h1>
        <p className="text-sm text-text-secondary">Local AI coding cockpit</p>
      </div>

      <div className="h-6" />

      <div className="flex flex-col gap-4">
        <Button variant="primary" className="w-full">
          Start a new session
        </Button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-divider dark:bg-divider-dark" />
          <span className="text-sm text-text-secondary">or</span>
          <div className="h-px flex-1 bg-divider dark:bg-divider-dark" />
        </div>

        <TmuxOptions />
        <SessionSelector />
      </div>
    </div>
  )
}
