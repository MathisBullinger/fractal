import vertShader from './shaders/shader.vert'
import fragShader from './shaders/shader.frag'

const canvas: HTMLCanvasElement = document.querySelector('canvas')
canvas.width = 640
canvas.height = 480

const gl = canvas.getContext('webgl')

gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

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

//

// const positionLocation = gl.getAttribLocation(program, 'a_position')
// gl.enableVertexAttribArray(positionLocation)
// gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

gl.clearColor(1, 1, 1, 1)
gl.clear(gl.COLOR_BUFFER_BIT)

const positionLocation = gl.getAttribLocation(program, 'a_position')
gl.enableVertexAttribArray(positionLocation)
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
gl.drawArrays(gl.TRIANGLES, 0, 6)