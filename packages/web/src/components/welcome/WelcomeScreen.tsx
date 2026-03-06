import { ThemeToggle } from '../ui'
import GradientBackground from './GradientBackground'
import WelcomeCard from './WelcomeCard'

export default function WelcomeScreen() {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-text-primary dark:bg-bg-dark dark:text-text-dark">
      <GradientBackground />
      <ThemeToggle />
      <main className="flex flex-1 items-center justify-center p-4">
        <WelcomeCard />
      </main>
      <footer className="pb-4 text-center text-xs text-text-secondary">
        Made with love in Scotland &middot; &copy; 2026{' '}
        <a
          href="https://unlikeotherai.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent"
        >
          UnlikeOtherAI
        </a>
      </footer>
    </div>
  )
}
