const canvas = document.querySelector('canvas')
const selectRect = document.getElementById('selection')
const colorShift = document.getElementById('color-shift') as HTMLInputElement
const iterations = document.getElementById('iterations') as HTMLInputElement

export const handlers: {
  onResize?(dir: 'in' | 'out'): void
  onPan?(dir: 'left' | 'right' | 'up' | 'down'): void
  onSelect?(
    scale: number,
    center: [x: number, y: number],
    stick?: boolean
  ): void
  onColorShift?(v: number): void
  onIterations?(v: number): void
} = {}

canvas.addEventListener('pointerdown', ({ clientX, clientY }) => {
  selectRect.removeAttribute('hidden')
  selectRect.style.left = `${clientX}px`
  selectRect.style.top = `${clientY}px`
  selectRect.style.width = '0'
  selectRect.style.height = '0'
  selectRect.style.transform = ''
  window.addEventListener('pointermove', handleMove)
})

canvas.addEventListener('pointerup', () => {
  const { left, top, width, height } = selectRect.getBoundingClientRect()
  handlers.onSelect?.(height / window.innerHeight, [
    (left + width / 2) / window.innerWidth,
    (top + height / 2) / window.innerHeight,
  ])
  selectRect.setAttribute('hidden', '')
  window.removeEventListener('pointermove', handleMove)
})

function handleMove(e: PointerEvent) {
  const ratio = canvas.height / canvas.width
  const box = selectRect.getBoundingClientRect()

  const pt = [e.clientX, e.clientY]
  const ptRatio = (pt[1] - box.top) / (pt[0] - box.left)

  if (ptRatio < ratio) {
    pt[1] = (pt[0] - box.left) * ratio + box.top
  } else {
    pt[0] = (pt[1] - box.top) * (1 / ratio) + box.left
  }

  const width = pt[0] - box.left
  const height = pt[1] - box.top

  selectRect.style.width = `${width}px`
  selectRect.style.height = `${height}px`
  selectRect.style.transform = `translateX(-${width / 2}px) translateY(-${
    height / 2
  }px)`
}

document.getElementById('zoom-in').onclick = () => {
  handlers.onResize?.('in')
}
document.getElementById('zoom-out').onclick = () => {
  handlers.onResize?.('out')
}
;['left', 'right', 'up', 'down'].forEach((dir) => {
  document.getElementById(`pan-${dir}`).onclick = () => {
    handlers.onPan?.(dir as any)
  }
})

canvas.addEventListener('mousewheel', ({ deltaY, x, y }: any) => {
  handlers.onSelect?.(
    1 + 0.005 * deltaY,
    [x / window.innerWidth, y / window.innerHeight],
    true
  )
})

colorShift.oninput = ({ target }) => {
  handlers.onColorShift?.(parseFloat((target as HTMLInputElement).value))
}

iterations.oninput = ({ target }) => {
  const value = parseFloat((target as HTMLInputElement).value)
  const exp = Math.max(Math.round(value ** 2 / 1000), 2)
  handlers.onIterations?.(exp)
}
