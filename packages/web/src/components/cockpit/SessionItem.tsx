interface Props {
  name: string
  attached: boolean
  active: boolean
  onClick: () => void
}

export default function SessionItem({ name, attached, active, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex w-full cursor-pointer items-center gap-2.5 rounded-sidebar px-3 py-2 text-left text-sm transition-colors',
        active
          ? 'bg-sidebar-active font-medium text-text-primary shadow-subtle dark:bg-divider-dark dark:text-text-dark'
          : 'text-text-secondary hover:bg-sidebar-hover dark:hover:bg-divider-dark',
      ].join(' ')}
    >
      {attached && (
        <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-green-500" />
      )}
      <span className="truncate font-mono text-[13px]">{name}</span>
    </button>
  )
}
