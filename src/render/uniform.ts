import GLClass from './glBaseClass'
import type ShaderProgram from './program'

export default class Uniform<T extends GLenum> extends GLClass {
  private readonly handle: WebGLUniformLocation

  constructor(
    private readonly program: ShaderProgram,
    private readonly name: string,
    private readonly type: T
  ) {
    super('Uniform')
    const assert = this.assert('constructor')

    this.handle = assert(
      program.getUniformLocation(name),
      `couldn't get location for uniform "${name}"`
    )

    const info = assert(
      [...Array(program.getProgramParameter(program.gl.ACTIVE_UNIFORMS))]
        .map((_, i) => program.getActiveUniform(i))
        .find((info) => info?.name === name),
      `unable to query info for uniform "${name}"`
    )

    assert(
      info.type === type,
      `expected uniform "${name}" to be of type ${this.typeName(
        type
      )} but it is ${this.typeName(type)}`
    )
  }
}
