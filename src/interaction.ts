const canvas = document.querySelector('canvas')
const select = document.getElementById('selection')

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
