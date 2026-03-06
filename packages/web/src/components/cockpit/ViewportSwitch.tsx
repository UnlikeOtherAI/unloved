import { Smartphone, Tablet, Monitor, Maximize, RotateCcw } from 'lucide-react'
import { useLayoutStore, type PreviewViewport } from '../../stores/layout'

type ViewportGroup = {
  portrait: PreviewViewport
  landscape: PreviewViewport
  icon: typeof Monitor
  label: string
}

const groups: ViewportGroup[] = [
  { portrait: 'mobile-portrait', landscape: 'mobile-landscape', icon: Smartphone, label: 'Mobile' },
  { portrait: 'tablet-portrait', landscape: 'tablet-landscape', icon: Tablet, label: 'Tablet' },
]

export default function ViewportSwitch() {
  const previewViewport = useLayoutStore((s) => s.previewViewport)
  const setPreviewViewport = useLayoutStore((s) => s.setPreviewViewport)

  const isActive = (vp: PreviewViewport) => previewViewport === vp
  const isGroupActive = (g: ViewportGroup) => isActive(g.portrait) || isActive(g.landscape)

  const btnClass = (active: boolean) => [
    'flex h-full cursor-pointer items-center gap-1 px-2 text-xs transition-colors',
    active
      ? 'bg-accent text-white'
      : 'text-text-secondary hover:bg-sidebar-hover dark:hover:bg-divider-dark',
  ].join(' ')

  return (
    <div className="flex h-8 items-center rounded-lg border border-divider bg-sidebar dark:border-divider-dark dark:bg-bg-dark">
      {groups.map((g) => {
        const groupActive = isGroupActive(g)
        const isLandscape = isActive(g.landscape)
        return (
          <div key={g.portrait} className="flex h-full items-center">
            <button
              type="button"
              onClick={() => setPreviewViewport(groupActive ? 'default' : g.portrait)}
              className={btnClass(groupActive)}
              aria-label={g.label}
              title={g.label}
            >
              <g.icon size={14} />
            </button>
            {groupActive && (
              <button
                type="button"
                onClick={() => setPreviewViewport(isLandscape ? g.portrait : g.landscape)}
                className="flex h-full cursor-pointer items-center px-1.5 text-text-secondary transition-colors hover:bg-sidebar-hover dark:hover:bg-divider-dark"
                aria-label="Toggle orientation"
                title={isLandscape ? 'Portrait' : 'Landscape'}
              >
                <RotateCcw size={11} />
              </button>
            )}
          </div>
        )
      })}
      <button
        type="button"
        onClick={() => setPreviewViewport(isActive('desktop') ? 'default' : 'desktop')}
        className={[btnClass(isActive('desktop')), 'rounded-none'].join(' ')}
        aria-label="Desktop (1280px)"
        title="Desktop (1280px)"
      >
        <Monitor size={14} />
      </button>
      <button
        type="button"
        onClick={() => setPreviewViewport('default')}
        className={[
          btnClass(isActive('default')),
          'rounded-r-lg',
        ].join(' ')}
        aria-label="Full width"
        title="Full width"
      >
        <Maximize size={14} />
      </button>
    </div>
  )
}
