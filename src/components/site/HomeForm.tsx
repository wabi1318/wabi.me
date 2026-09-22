import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { PointerEvent, PropsWithChildren, RefObject } from 'react'
import { flushSync } from 'react-dom'
import { Window } from '../legacy/Window'
import { getHomeFormPosition, keepHomeFormInViewport } from './get-home-form-position'
import type { FormPosition } from './get-home-form-position'

type FormDrag = {
  pointerId: number
  offsetX: number
  offsetY: number
}

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
  const manualPositionRef = useRef<FormPosition | null>(null)
  const dragRef = useRef<FormDrag | null>(null)
  const [position, setPosition] = useState({ left: 0, top: 0 })

  useLayoutEffect(() => {
    const homeElement = homeRef.current
    const formElement = formRef.current
    if (!homeElement || !formElement) return

    function updatePosition() {
      if (!homeElement || !formElement) return
      const formBounds = formElement.getBoundingClientRect()
      const viewport = { width: document.documentElement.clientWidth, height: window.innerHeight }
      const nextPosition = manualPositionRef.current
        ? keepHomeFormInViewport(manualPositionRef.current, formBounds, viewport)
        : getHomeFormPosition(homeElement.getBoundingClientRect(), formBounds, viewport, placementIndex)
      if (manualPositionRef.current) manualPositionRef.current = nextPosition
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

  function startFormDrag(event: PointerEvent<HTMLElement>) {
    if (!event.isPrimary || event.button !== 0 || dragRef.current) return
    if (event.target instanceof Element && event.target.closest('button')) return
    const formElement = formRef.current
    if (!formElement) return

    event.preventDefault()
    // 前面化で要素の並びが変わるため、その反映後に移動操作を開始する。
    flushSync(onActivate)
    formElement.focus({ preventScroll: true })
    const bounds = formElement.getBoundingClientRect()
    dragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - bounds.left,
      offsetY: event.clientY - bounds.top,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function moveForm(event: PointerEvent<HTMLElement>) {
    const drag = dragRef.current
    const formElement = formRef.current
    if (!drag || drag.pointerId !== event.pointerId || !formElement) return
    const nextPosition = keepHomeFormInViewport(
      { left: event.clientX - drag.offsetX, top: event.clientY - drag.offsetY },
      formElement.getBoundingClientRect(),
      { width: document.documentElement.clientWidth, height: window.innerHeight },
    )
    manualPositionRef.current = nextPosition
    setPosition(nextPosition)
  }

  function finishFormDrag(event: PointerEvent<HTMLElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return
    dragRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

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
      <Window
        title={title}
        onClose={onClose}
        titleBarProps={{
          onPointerDown: startFormDrag,
          onPointerMove: moveForm,
          onPointerUp: finishFormDrag,
          onPointerCancel: finishFormDrag,
          onLostPointerCapture: finishFormDrag,
        }}
      >
        <div className="home-form-content">{children}</div>
      </Window>
    </div>
  )
}
