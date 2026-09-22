import type { PropsWithChildren, Ref } from 'react'

type WindowProps = PropsWithChildren<{
  title: string
  onClose?: () => void
  windowRef?: Ref<HTMLElement>
}>

export function Window({ title, children, onClose, windowRef }: WindowProps) {
  return (
    <section className="legacy-window" aria-label={title} ref={windowRef}>
      <header className="title-bar">
        <span>{title}</span>
        <button type="button" className="window-control" aria-label={`${title}を閉じる`} disabled={!onClose} onClick={onClose}>
          <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" focusable="false">
            <path d="M2 2L8 8M8 2L2 8" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </header>
      <div className="window-content">{children}</div>
    </section>
  )
}
