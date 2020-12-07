import 'regenerator-runtime/runtime'
import type { Complex } from './utils/complex'
import { add, multiply, abs } from './utils/complex'
import './render'

/////////////////////////////

// const ctx = canvas.getContext('2d')

// const MAX_ITER = 80

// function mandelbrot(c: Complex) {
//   let z: Complex = [0, 0]
//   let n = 0

//   while (abs(z) <= 2 && n < MAX_ITER) {
//     z = add(multiply(z, z), c)
//     n += 1
//   }

//   return n
// }

// const IM_START = -1
// const IM_END = 1

// const RE_START = -0.5 - ((WIDTH / HEIGHT) * (IM_END - IM_START)) / 2
// const RE_END = -0.5 + ((WIDTH / HEIGHT) * (IM_END - IM_START)) / 2

// for (let x = 0; x < WIDTH; x++) for (let y = 0; y < HEIGHT; y++) render(x, y)

// function render(x: number, y: number) {
//   const c: Complex = [
//     RE_START + (x / WIDTH) * (RE_END - RE_START),
//     IM_START + (y / HEIGHT) * (IM_END - IM_START),
//   ]
//   const m = mandelbrot(c)

//   const hue = ((255 * m) / MAX_ITER) | 0
//   const sat = 255
//   const l = m < MAX_ITER ? 50 : 0

//   ctx.fillStyle = `hsl(${hue}, ${sat}%, ${l}%)`
//   ctx.fillRect(x, y, 1, 1)
// }
