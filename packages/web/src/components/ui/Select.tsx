import type { SelectHTMLAttributes } from 'react'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange' | 'children'> {
  options: SelectOption[]
  value: string | null
  onChange: (value: string) => void
  placeholder: string
}

const BASE_CLASSES =
  'h-10 w-full rounded-input border border-divider bg-white px-3.5 text-base transition-colors outline-none focus:border-accent focus:ring-3 focus:ring-accent-ring dark:border-divider-dark dark:bg-card-dark dark:text-text-dark'

export default function Select({ options, value, onChange, placeholder, className, ...props }: SelectProps) {
  return (
    <select
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value)}
      className={[BASE_CLASSES, className].filter(Boolean).join(' ')}
      {...props}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
