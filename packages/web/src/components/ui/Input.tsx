import type { InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const BASE_CLASSES =
  'h-10 w-full rounded-input border border-divider bg-white px-3.5 text-base transition-colors outline-none focus:border-accent focus:ring-3 focus:ring-accent-ring dark:border-divider-dark dark:bg-card-dark dark:text-text-dark'

export default function Input({ className, ...props }: InputProps) {
  return <input className={[BASE_CLASSES, className].filter(Boolean).join(' ')} {...props} />
}
