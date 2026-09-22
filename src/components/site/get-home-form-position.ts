type HomeBounds = {
  left: number
  top: number
  right: number
  bottom: number
}

type Size = {
  width: number
  height: number
}

export type FormPosition = {
  left: number
  top: number
}

const VIEWPORT_MARGIN = 12
const HOME_HORIZONTAL_OFFSET = 48
const HOME_VERTICAL_OFFSET = 56
const CASCADE_OFFSET = 24
const FORM_CORNERS = [
  { horizontal: 'right', vertical: 'top' },
  { horizontal: 'left', vertical: 'bottom' },
  { horizontal: 'right', vertical: 'bottom' },
  { horizontal: 'left', vertical: 'top' },
] as const

export function getHomeFormPosition(home: HomeBounds, form: Size, viewport: Size, placementIndex: number) {
  const corner = FORM_CORNERS[placementIndex % FORM_CORNERS.length]
  const cascadeOffset = Math.floor(placementIndex / FORM_CORNERS.length) * CASCADE_OFFSET
  const horizontalOffset = HOME_HORIZONTAL_OFFSET + cascadeOffset
  const verticalOffset = HOME_VERTICAL_OFFSET + cascadeOffset
  const left = corner.horizontal === 'right'
    ? home.right - form.width + horizontalOffset
    : home.left - horizontalOffset
  const top = corner.vertical === 'top'
    ? home.top + verticalOffset
    : home.bottom - form.height + verticalOffset

  return keepHomeFormInViewport({ left, top }, form, viewport)
}

// 閉じるボタンを含むフォーム全体が画面内に収まる位置にする。
export function keepHomeFormInViewport(position: FormPosition, form: Size, viewport: Size): FormPosition {
  return {
    left: Math.max(VIEWPORT_MARGIN, Math.min(position.left, viewport.width - form.width - VIEWPORT_MARGIN)),
    top: Math.max(VIEWPORT_MARGIN, Math.min(position.top, viewport.height - form.height - VIEWPORT_MARGIN)),
  }
}
