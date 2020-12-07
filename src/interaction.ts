const canvas = document.querySelector('canvas')
const select = document.getElementById('selection')
const controls = document.getElementById('controls')

canvas.addEventListener('pointerdown', ({ clientX, clientY }) => {
  select.removeAttribute('hidden')
  select.style.left = `${clientX}px`
  select.style.top = `${clientY}px`
  select.style.width = '0'
  select.style.height = '0'
  select.style.transform = ''
  window.addEventListener('pointermove', handleMove)
})

canvas.addEventListener('pointerup', () => {
  select.setAttribute('hidden', '')
  window.removeEventListener('pointermove', handleMove)
})

function handleMove(e: PointerEvent) {
  const ratio = canvas.height / canvas.width
  const box = select.getBoundingClientRect()

  const pt = [e.clientX, e.clientY]
  const ptRatio = (pt[1] - box.top) / (pt[0] - box.left)

  if (ptRatio < ratio) {
    pt[1] = (pt[0] - box.left) * ratio + box.top
  } else {
    pt[0] = (pt[1] - box.top) * (1 / ratio) + box.left
  }

  const width = pt[0] - box.left
  const height = pt[1] - box.top

  select.style.width = `${width}px`
  select.style.height = `${height}px`
  select.style.transform = `translateX(-${width / 2}px) translateY(-${
    height / 2
  }px)`
}

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
