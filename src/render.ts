import vertShader from './shaders/shader.vert'
import fragShader from './shaders/shader.frag'

const canvas: HTMLCanvasElement = document.querySelector('canvas')

const gl = canvas.getContext('webgl')

const buffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([
    -1.0,
    -1.0,
    1.0,
    -1.0,
    -1.0,
    1.0,
    -1.0,
    1.0,
    1.0,
    -1.0,
    1.0,
    1.0,
  ]),
  gl.STATIC_DRAW
)

const vertexShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(vertexShader, vertShader)
gl.compileShader(vertexShader)

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(fragmentShader, fragShader)
gl.compileShader(fragmentShader)

const program = gl.createProgram()
gl.attachShader(program, vertexShader)
gl.attachShader(program, fragmentShader)
gl.linkProgram(program)
gl.useProgram(program)

const iterHandle = gl.getUniformLocation(program, 'iterations')
const scaleHandle = gl.getUniformLocation(program, 'scale')
const centerHandle = gl.getUniformLocation(program, 'center')
const shiftHandle = gl.getUniformLocation(program, 'colorShift')

gl.uniform1i(iterHandle, 100)

function resize() {
  canvas.width = window.innerWidth * devicePixelRatio
  canvas.height = window.innerHeight * devicePixelRatio
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
  const widthHandle = gl.getUniformLocation(program, 'width')
  gl.uniform1f(widthHandle, canvas.width)
  const heightHandle = gl.getUniformLocation(program, 'height')
  gl.uniform1f(heightHandle, canvas.height)
}

function clear() {
  gl.clearColor(1, 1, 1, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)
}

export default function render(
  scale = 2.3,
  center = [-0.5, 0.0],
  colorShift = 0.0
) {
  resize()
  clear()

  gl.uniform1f(scaleHandle, scale)
  gl.uniform2fv(centerHandle, center)
  gl.uniform1f(shiftHandle, colorShift)

  const positionLocation = gl.getAttribLocation(program, 'a_position')
  gl.enableVertexAttribArray(positionLocation)
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
  gl.drawArrays(gl.TRIANGLES, 0, 6)
}
