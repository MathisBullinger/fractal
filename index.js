import 'regenerator-runtime/runtime'
import * as math from 'mathjs'

const canvas = document.querySelector('canvas')

const HEIGHT = window.innerHeight / 10
const WIDTH = Math.ceil((window.innerWidth / window.innerHeight) * HEIGHT)

canvas.width = WIDTH
canvas.height = HEIGHT

const ctx = canvas.getContext('2d')

// ctx.fillRect(width / 4, height / 4, width / 2, height / 2)

const MAX_ITER = 80

function mandelbrot(c) {
  let z = math.complex(0)
  let n = 0

  while (math.abs(z) <= 2 && n < MAX_ITER) {
    // z = z ** 2 + c
    z = math.add(math.multiply(z, z), c)
    n += 1
  }

  return n
}

const IM_START = -1
const IM_END = 1

const RE_START = -0.5 - ((WIDTH / HEIGHT) * (IM_END - IM_START)) / 2
const RE_END = -0.5 + ((WIDTH / HEIGHT) * (IM_END - IM_START)) / 2

const render = (x, y) => {
  const c = math.complex(
    RE_START + (x / WIDTH) * (RE_END - RE_START),
    IM_START + (y / HEIGHT) * (IM_END - IM_START)
  )

  const m = mandelbrot(c)

  const color = (255 - (m * 255) / MAX_ITER) | 0
  // const color = (Math.random() * 255) | 0
  const hue = ((255 * m) / MAX_ITER) | 0
  const sat = 255
  const l = m < MAX_ITER ? 50 : 0

  ctx.fillStyle = `hsl(${hue}, ${sat}%, ${l}%)`
  ctx.fillRect(x, y, 1, 1)
}

const step = (x = 0, y = 0) => {
  if (x === WIDTH && y === HEIGHT) return
  render(x, y)
  x++
  if (x >= WIDTH) {
    x = 0
    y++
  }
  requestAnimationFrame(() => step(x, y))
}
step()
