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
        'flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-text-primary transition-colors duration-150 hover:bg-sidebar-hover dark:text-text-dark dark:hover:bg-divider-dark',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Toggle theme"
    >
      {mode === 'dark' ? <Moon size={18} strokeWidth={1.8} /> : <Sun size={18} strokeWidth={1.8} />}
    </button>
  )
}
