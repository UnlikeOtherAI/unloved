import type { ButtonHTMLAttributes, ReactNode } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  children: ReactNode
}

const VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-accent text-white hover:bg-accent-hover',
  secondary:
    'bg-[#E5E7EB] text-text-primary hover:bg-[#D1D5DB] dark:bg-divider-dark dark:text-text-dark dark:hover:bg-divider-dark',
  ghost: 'bg-transparent text-text-secondary hover:bg-sidebar-hover dark:text-text-dark dark:hover:bg-divider-dark',
}

const BASE_CLASSES =
  'h-9 cursor-pointer rounded-button px-3.5 text-sm font-medium transition-colors duration-150'

export default function Button({
  variant = 'primary',
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[BASE_CLASSES, VARIANT_CLASSES[variant], className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
