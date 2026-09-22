import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { PropsWithChildren, RefObject } from 'react'
import { Window } from '../legacy/Window'
import { getHomeFormPosition } from './get-home-form-position'

type HomeFormProps = PropsWithChildren<{
  title: string
  homeRef: RefObject<HTMLElement | null>
  placementIndex: number
  layer: number
  onClose: () => void
  onActivate: () => void
}>

export function HomeForm({ title, homeRef, placementIndex, layer, onClose, onActivate, children }: HomeFormProps) {
  const formRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ left: 0, top: 0 })

  useLayoutEffect(() => {
    const homeElement = homeRef.current
    const formElement = formRef.current
    if (!homeElement || !formElement) return

    function updatePosition() {
      if (!homeElement || !formElement) return
      const nextPosition = getHomeFormPosition(
        homeElement.getBoundingClientRect(),
        formElement.getBoundingClientRect(),
        { width: document.documentElement.clientWidth, height: window.innerHeight },
        placementIndex,
      )
      setPosition((current) => current.left === nextPosition.left && current.top === nextPosition.top ? current : nextPosition)
    }

    updatePosition()
    const observer = new ResizeObserver(updatePosition)
    observer.observe(homeElement)
    observer.observe(formElement)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition)
    }
  }, [homeRef, placementIndex])

  useEffect(() => {
    formRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <div
      className="home-form"
      style={{ ...position, zIndex: layer }}
      ref={formRef}
      tabIndex={-1}
      role="dialog"
      aria-label={title}
      onPointerDown={onActivate}
      onFocusCapture={onActivate}
    >
      <Window title={title} onClose={onClose}>
        <div className="home-form-content">{children}</div>
      </Window>
    </div>
  )
}
