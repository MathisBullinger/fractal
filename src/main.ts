import Settings, { Complex } from './settings'

const settings = new Settings()

const canvas = document.querySelector('canvas')!

canvas.addEventListener('mousewheel', (event) => {
  const { deltaY, x, y } = event as WheelEvent

  const zoom = 1 + deltaY * 0.001
  const orgScale = settings.scale
  settings.scale *= zoom

  const offset = [
    (x / canvas.offsetWidth - 0.5) * (canvas.width / canvas.height),
    -(y / canvas.offsetHeight - 0.5),
  ]

  const ds = orgScale - settings.scale

  settings.move([offset[0] * ds, offset[1] * ds])
})

window.addEventListener('keydown', (e) => {
  if (!e.key.startsWith('Arrow')) return
  const dir = e.key.replace(/^Arrow/, '').toLocaleLowerCase()
  const step = settings.scale / 10
  const theta = (['right', 'up', 'left', 'down'].indexOf(dir) * Math.PI) / 2
  const offset = rotate([step, 0], theta)
  settings.move(offset)
})

canvas.addEventListener('pointerdown', (e) => {
  const onMove = ({ movementX, movementY }: PointerEvent) => {
    const offset: Complex = [
      (-movementX / canvas.offsetWidth) *
        (canvas.offsetWidth / canvas.offsetHeight) *
        settings.scale,
      (movementY / canvas.offsetHeight) * settings.scale,
    ]

    settings.move(offset)
  }

  canvas.addEventListener('pointermove', onMove)

  canvas.addEventListener(
    'pointerup',
    () => {
      canvas.removeEventListener('pointermove', onMove)
    },
    { once: true }
  )
})

const rotate = ([x, y]: Complex, a: number): Complex => [
  Math.cos(a) * x - Math.sin(a) * y,
  Math.sin(a) * x + Math.cos(a) * y,
]

const coords = document.querySelector('.coords')!
window.addEventListener('mousemove', ({ clientX: x, clientY: y }) => {
  const im =
    -((y - window.innerHeight / 2) / window.innerHeight) * settings.scale +
    settings.center[1]
  const re =
    ((x - window.innerWidth / 2) / window.innerWidth) *
      (settings.scale * (window.innerWidth / window.innerHeight)) +
    settings.center[0]
  coords.innerHTML = `${re.toPrecision(6)}\u2009+\u2009${im.toPrecision(
    6
  )}\u2009𝑖`
})
