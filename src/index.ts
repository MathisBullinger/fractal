import 'regenerator-runtime/runtime'
import render from './render'
import throttle from 'lodash/throttle'

render()

window.addEventListener(
  'resize',
  throttle(render, 500, { leading: true, trailing: true })
)
