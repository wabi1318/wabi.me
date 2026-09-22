import type { PropsWithChildren } from 'react'

type WindowProps = PropsWithChildren<{
  title: string
}>

export function Window({ title, children }: WindowProps) {
  return (
    <section className="legacy-window">
      <header className="title-bar">
        <span>{title}</span>
        <span aria-hidden="true" className="window-control">×</span>
      </header>
      <div className="window-content">{children}</div>
    </section>
  )
}
