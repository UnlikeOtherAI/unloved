interface CheckboxProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
}

export default function Checkbox({ label, checked, onChange, className }: CheckboxProps) {
  return (
    <label
      className={[
        'inline-flex cursor-pointer items-center gap-2 text-sm text-text-primary dark:text-text-dark',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 cursor-pointer accent-accent"
      />
      <span>{label}</span>
    </label>
  )
}
