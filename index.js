import * as math from 'mathjs'

const canvas = document.querySelector('canvas')

const HEIGHT = 400
const WIDTH = (window.innerWidth / window.innerHeight) * HEIGHT

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

const RE_START = -2
const RE_END = 1
const IM_START = -1
const IM_END = 1

for (let x = 0; x <= WIDTH; x++) {
  for (let y = 0; y <= HEIGHT; y++) {
    const c = math.complex(
      RE_START + (x / WIDTH) * (RE_END - RE_START),
      IM_START + (y / HEIGHT) * (IM_END - IM_START)
    )

    const m = mandelbrot(c)

    const color = (255 - (m * 255) / MAX_ITER) | 0
    // const color = (Math.random() * 255) | 0

    ctx.fillStyle = `rgb(${color}, ${color}, ${color})`
    ctx.fillRect(x, y, 1, 1)

    // console.log(color)
  }
}
