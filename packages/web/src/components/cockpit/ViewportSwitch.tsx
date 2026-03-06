import { Smartphone, Tablet, Monitor, Maximize } from 'lucide-react'
import { useLayoutStore, type PreviewViewport } from '../../stores/layout'
import Tooltip from '../ui/Tooltip'

const viewports: {
  value: PreviewViewport
  icon: typeof Monitor
  label: string
  rotate?: boolean
}[] = [
  { value: 'mobile-portrait', icon: Smartphone, label: 'Mobile portrait' },
  { value: 'mobile-landscape', icon: Smartphone, label: 'Mobile landscape', rotate: true },
  { value: 'tablet-portrait', icon: Tablet, label: 'Tablet portrait' },
  { value: 'tablet-landscape', icon: Tablet, label: 'Tablet landscape', rotate: true },
  { value: 'desktop', icon: Monitor, label: 'Desktop (1280px)' },
  { value: 'default', icon: Maximize, label: 'Full width' },
]

export default function ViewportSwitch() {
  const previewViewport = useLayoutStore((s) => s.previewViewport)
  const setPreviewViewport = useLayoutStore((s) => s.setPreviewViewport)

  return (
    <div className="flex h-8 items-center overflow-hidden rounded-lg border border-divider bg-sidebar dark:border-divider-dark dark:bg-bg-dark">
      {viewports.map(({ value, icon: Icon, label, rotate }) => (
        <button
          key={value}
          type="button"
          onClick={() => setPreviewViewport(value)}
          className={[
            'relative flex h-full cursor-pointer items-center gap-1.5 px-2 text-xs transition-colors',
            previewViewport === value
              ? 'bg-accent text-white'
              : 'text-text-secondary hover:bg-sidebar-hover dark:hover:bg-divider-dark',
          ].join(' ')}
          aria-label={label}
        >
          <Icon size={14} style={rotate ? { transform: 'rotate(90deg)' } : undefined} />
          <Tooltip label={label} />
        </button>
      ))}
    </div>
  )
}
