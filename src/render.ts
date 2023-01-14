import throttle from 'froebel/throttle'
import type { Fn } from 'froebel/types'
import * as gl from 'typegl'

import vertexShaderSource from './shaders/shader.vert'
import fragmentShaderSource from './shaders/shader.frag'

const { program, canvas } = init()

function init() {
  const canvas = document.querySelector<HTMLCanvasElement>('canvas')!

  const program = gl.Program.from(canvas, {
    iterations: 'INT',
    scale: 'FLOAT',
    center: 'FLOAT_VEC2',
    colorShift: 'FLOAT',
    binary: 'BOOL',
    width: 'FLOAT',
    height: 'FLOAT',
  })

  program.attachShader(program.gl.VERTEX_SHADER, vertexShaderSource)
  program.attachShader(program.gl.FRAGMENT_SHADER, fragmentShaderSource)
  program.link()
  program.use()

  const buffer = program.gl.createBuffer()
  program.gl.bindBuffer(program.gl.ARRAY_BUFFER, buffer)
  program.gl.bufferData(
    program.gl.ARRAY_BUFFER,
    new Float32Array([
      -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
    ]),
    program.gl.STATIC_DRAW
  )

  const positionLocation = program.gl.getAttribLocation(
    program.glProgram,
    'a_position'
  )
  program.gl.enableVertexAttribArray(positionLocation)
  program.gl.vertexAttribPointer(
    positionLocation,
    2,
    program.gl.FLOAT,
    false,
    0,
    0
  )

  return { program, canvas }
}

const renderDependency = <T extends Fn>(fn: T): T =>
  ((...args: Parameters<T>) => {
    const result = fn(...args)
    render()
    return result
  }) as T

export const setIterations = renderDependency((iterations: number) => {
  program.getUniform('iterations').set(iterations)
})

export const setScale = renderDependency((scale: number) => {
  program.getUniform('scale').set(scale)
})

export const setColorShift = renderDependency((shift: number) => {
  program.getUniform('colorShift').set(shift)
})

export const setCenter = renderDependency((x: number, y: number) => {
  program.getUniform('center').set(x, y)
})

const resize = renderDependency(() => {
  canvas.width = window.innerWidth * devicePixelRatio
  canvas.height = window.innerHeight * devicePixelRatio
  program.gl.viewport(
    0,
    0,
    program.gl.drawingBufferWidth,
    program.gl.drawingBufferHeight
  )
  program.getUniform('width').set(canvas.width)
  program.getUniform('height').set(canvas.height)
})

const oncePerFrame = (fn: () => void) => {
  let requested = false
  let rfId: number | null = null

  const wrapped = () => {
    rfId = null
    if (!requested) return
    requested = false
    fn()
    scheduleFrame()
  }

  const scheduleFrame = () => {
    rfId ??= requestAnimationFrame(wrapped)
  }

  const request = () => {
    requested = true
    scheduleFrame()
  }

  return request
}

const render = oncePerFrame(() => {
  program.gl.drawArrays(program.gl.TRIANGLES, 0, 6)
})

resize()
window.addEventListener(
  'resize',
  throttle(resize, 100, { leading: true, trailing: true })
)
