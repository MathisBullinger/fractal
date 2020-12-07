import 'regenerator-runtime/runtime'
import _render from './render'
import throttle from 'lodash/throttle'
import { handlers } from './interaction'

let scale = 2.3
const pan = [-0.5, 0.0]
let colorShift = 0.0
let iterations = 100

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
}

handlers.onColorShift = (v) => {
  colorShift = v
  render()
}

handlers.onIterations = (v) => {
  iterations = v
  render()
}
