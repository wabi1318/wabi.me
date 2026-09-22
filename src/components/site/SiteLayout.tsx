import type { PropsWithChildren, Ref } from 'react'
import { NavLink } from 'react-router-dom'
import { Window } from '../legacy/Window'

const navigationItems = [
  { to: '/', label: 'HOME', end: true },
  { to: '/blog', label: 'BLOG', end: false },
  { to: '/works', label: 'WORKS', end: false },
  { to: '/talks', label: 'TALKS', end: false },
  { to: '/about', label: 'ABOUT', end: false },
] as const

export function SiteLayout({ title, children, onOpenPage, windowRef }: PropsWithChildren<{ title: string; onOpenPage?: (path: string) => void; windowRef?: Ref<HTMLElement> }>) {
  return (
    <main className="site-shell">
      <Window title={title} windowRef={windowRef}>
        <nav aria-label="メインメニュー" className="menu-bar">
          {navigationItems.map(({ to, label, end }) => onOpenPage ? (
            <button className="legacy-button" type="button" key={to} disabled={to === '/'} onClick={() => onOpenPage(to)}>
              {label}
            </button>
          ) : (
            <NavLink className={({ isActive }) => isActive ? 'menu-link is-active' : 'menu-link'} end={end} key={to} to={to}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="page-content">{children}</div>
        <footer className="status-bar">wabi.me — Personal site</footer>
      </Window>
    </main>
  )
}
