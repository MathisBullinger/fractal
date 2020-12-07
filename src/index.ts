import 'regenerator-runtime/runtime'
import render from './render'
import throttle from 'lodash/throttle'
import { onResize } from './interaction'

let scale = 2.3
render(scale)

window.addEventListener(
  'resize',
  throttle(() => render(scale), 500, { leading: true, trailing: true })
)

onResize((dir) => {
  if (dir === 'in') scale *= 0.9
  else scale *= 1.1
  render(scale)
})
