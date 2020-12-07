import 'regenerator-runtime/runtime'
import _render from './render'
import throttle from 'lodash/throttle'
import { onResize, onPan } from './interaction'

let scale = 2.3
const pan = [-0.5, 0.0]

const render = () => _render(scale, pan)
render()

window.addEventListener(
  'resize',
  throttle(render, 500, { leading: true, trailing: true })
)

onResize((dir) => {
  if (dir === 'in') scale *= 0.9
  else scale *= 1.1
  render()
  console.log(scale)
})

onPan((dir) => {
  const off = scale / 10
  if (dir === 'right') pan[0] += off
  else if (dir === 'left') pan[0] -= off
  else if (dir === 'up') pan[1] += off
  else if (dir === 'down') pan[1] -= off
  render()
})
