import type { MouseEvent } from 'react'

const sitePages = [
  { href: '/', label: 'HOME' },
  { href: '/blog', label: 'BLOG' },
  { href: '/works', label: 'WORKS' },
  { href: '/talks', label: 'TALKS' },
  { href: '/about', label: 'ABOUT' },
] as const

export type SitePath = typeof sitePages[number]['href']

export function openWindowFromLink(event: MouseEvent<HTMLAnchorElement>, open: () => void) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  open()
}

export function SiteNavigation({ currentPath, onOpenPage }: {
  currentPath: string
  onOpenPage?: (path: SitePath) => void
}) {
  const normalizedPath = currentPath.replace(/\/$/, '') || '/'
  return (
    <nav className="site-menu" aria-label="メインメニュー">
      {sitePages.map(({ href, label }) => (
        <a key={href} href={href} className="vb-button" aria-current={normalizedPath === href ? 'page' : undefined}
          onClick={onOpenPage ? (event) => openWindowFromLink(event, () => onOpenPage(href)) : undefined}>
          {label}
        </a>
      ))}
    </nav>
  )
}
