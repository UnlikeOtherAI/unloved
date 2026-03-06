import { useSessionStore } from '../../stores/session'
import WelcomeCard from '../welcome/WelcomeCard'
import GradientBackground from '../welcome/GradientBackground'
import ResizableWorkspace from './ResizableWorkspace'

export default function WorkspaceArea() {
  const activeSessionName = useSessionStore((s) => s.activeSessionName)

  if (!activeSessionName) {
    return (
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
        <GradientBackground />
        <WelcomeCard />
      </div>
    )
  }

  return <ResizableWorkspace sessionName={activeSessionName} />
}
