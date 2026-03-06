import { ThemeToggle } from '../ui'
import GradientBackground from './GradientBackground'
import WelcomeCard from './WelcomeCard'

export default function WelcomeScreen() {
  return (
    <div className="min-h-screen bg-bg text-text-primary dark:bg-bg-dark dark:text-text-dark">
      <GradientBackground />
      <ThemeToggle />
      <main className="flex min-h-screen items-center justify-center p-4">
        <WelcomeCard />
      </main>
    </div>
  )
}
