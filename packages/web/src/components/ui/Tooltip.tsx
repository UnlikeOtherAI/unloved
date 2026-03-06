export default function Tooltip({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute top-full left-1/2 z-50 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-text-primary px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-subtle transition-opacity group-hover:opacity-100 dark:bg-card-dark dark:text-text-dark">
      {label}
    </span>
  )
}
