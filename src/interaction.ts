const canvas = document.querySelector('canvas')
const selectRect = document.getElementById('selection')
const colorShift = document.getElementById('color-shift') as HTMLInputElement

type ResizeCB = (dir: 'in' | 'out') => void
const resize: ResizeCB[] = []
export function onResize(cb: ResizeCB) {
  resize.push(cb)
}
type PanCB = (dir: 'left' | 'right' | 'up' | 'down') => void
const pan: PanCB[] = []
export function onPan(cb: PanCB) {
  pan.push(cb)
}
type SelectCB = (
  scale: number,
  center: [x: number, y: number],
  stick?: boolean
) => void
const select: SelectCB[] = []
export function onSelect(cb: SelectCB) {
  select.push(cb)
}
type ShiftCB = (v: number) => void
const clShiftHandles: ShiftCB[] = []
export function onColorShift(cb: ShiftCB) {
  clShiftHandles.push(cb)
}

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
  select.forEach((cb) => {
    const { left, top, width, height } = selectRect.getBoundingClientRect()
    cb(height / window.innerHeight, [
      (left + width / 2) / window.innerWidth,
      (top + height / 2) / window.innerHeight,
    ])
  })
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
  resize.forEach((cb) => cb('in'))
}
document.getElementById('zoom-out').onclick = () => {
  resize.forEach((cb) => cb('out'))
}
;['left', 'right', 'up', 'down'].forEach((dir) => {
  document.getElementById(`pan-${dir}`).onclick = () => {
    pan.forEach((cb) => cb(dir as any))
  }
})

canvas.addEventListener('mousewheel', ({ deltaY, x, y }: any) => {
  select.forEach((cb) => {
    cb(
      1 + 0.005 * deltaY,
      [x / window.innerWidth, y / window.innerHeight],
      true
    )
  })
})

colorShift.oninput = ({ target }) => {
  clShiftHandles.forEach((cb) =>
    cb(parseFloat((target as HTMLInputElement).value))
  )
}
