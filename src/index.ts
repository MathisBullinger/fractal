import 'regenerator-runtime/runtime'
import _render from './render'
import throttle from 'lodash/throttle'
import { handlers } from './interaction'
import debounce from 'lodash/debounce'

let scale = 2.3
let pan: Complex = [-0.5, 0.0]
let colorShift = 0.55
let iterations = 100

{
  const params = new URLSearchParams(location.search)
  const c: string = params.get('c')
  const s: string = params.get('s')
  if (c) {
    pan = decodeURIComponent(c)
      .split(/(?=[+\-])/)
      .map((v) => parseFloat(v.replace(/[^\d]$/, ''))) as Complex
  }
  if (s) {
    scale = parseFloat(s)
  }
}

const render = () => _render(scale, pan, colorShift, iterations)
render()

window.addEventListener(
  'resize',
  throttle(render, 500, { leading: true, trailing: true })
)

handlers.onResize = (dir) => {
  if (dir === 'in') scale *= 0.9
  else scale *= 1.1
  render()
}

handlers.onPan = (dir) => {
  const off = scale / 10
  if (dir === 'right') pan[0] += off
  else if (dir === 'left') pan[0] -= off
  else if (dir === 'up') pan[1] += off
  else if (dir === 'down') pan[1] -= off
  render()
  pushState()
}

handlers.onSelect = (ds, [x, y], stick = false) => {
  if (!stick) {
    pan[0] += (x - 0.5) * scale * (window.innerWidth / window.innerHeight)
    pan[1] -= (y - 0.5) * scale
  } else {
    // pan[0] += (x - 0.5) * scale * (window.innerWidth / window.innerHeight)
  }
  scale *= ds
  render()
  pushState()
}

handlers.onColorShift = (v) => {
  colorShift = v
  render()
}

handlers.onIterations = (v) => {
  iterations = v
  render()
}

type Complex = [real: number, imaginary: number]

const coords = document.getElementById('coords')
window.addEventListener('mousemove', ({ clientX: x, clientY: y }) => {
  const im =
    -((y - window.innerHeight / 2) / window.innerHeight) * scale + pan[1]
  const re =
    ((x - window.innerWidth / 2) / window.innerWidth) *
      (scale * (window.innerWidth / window.innerHeight)) +
    pan[0]
  coords.innerHTML = `${re.toPrecision(6)}\u2009+\u2009${im.toPrecision(
    6
  )}\u2009𝑖`
})

const pushState = debounce(
  () => {
    const params = new URLSearchParams(location.search)
    params.set('c', `${pan[0]}+${pan[1]}i`.replace(/\+\-/, '-'))
    params.set('s', scale.toExponential())
    history.pushState({}, '', `${location.pathname}?${params.toString()}`)
  },
  500,
  { leading: false, trailing: true }
)
