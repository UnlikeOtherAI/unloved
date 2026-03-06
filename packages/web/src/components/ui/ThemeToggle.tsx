import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '../../stores/theme'

interface ThemeToggleProps {
  className?: string
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const mode = useThemeStore((state) => state.mode)
  const toggle = useThemeStore((state) => state.toggle)

  return (
    <button
      type="button"
      onClick={toggle}
      className={[
        'fixed top-4 right-4 z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-card text-text-primary shadow-subtle transition-colors duration-150 dark:bg-card-dark dark:text-text-dark',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Toggle theme"
    >
      {mode === 'dark' ? <Moon size={20} strokeWidth={1.8} /> : <Sun size={20} strokeWidth={1.8} />}
    </button>
  )
}
