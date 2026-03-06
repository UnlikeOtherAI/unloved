import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function Tooltip({ label }: { label: string }) {
  const [show, setShow] = useState(false)
  const spanRef = useRef<HTMLSpanElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  const handleEnter = () => {
    if (spanRef.current) {
      const rect = spanRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 6, left: rect.left + rect.width / 2 })
    }
    setShow(true)
  }

  return (
    <>
      <span
        ref={spanRef}
        className="absolute inset-0"
        onMouseEnter={handleEnter}
        onMouseLeave={() => setShow(false)}
      />
      {show &&
        createPortal(
          <span
            style={{ position: 'fixed', top: pos.top, left: pos.left, transform: 'translateX(-50%)' }}
            className="pointer-events-none z-50 whitespace-nowrap rounded-md bg-text-primary px-2 py-1 text-[11px] font-medium text-white shadow-subtle dark:bg-card-dark dark:text-text-dark"
          >
            {label}
          </span>,
          document.body,
        )}
    </>
  )
}
