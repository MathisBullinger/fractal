import GLClass from './glBaseClass'
import type ShaderProgram from './program'
import type { GL } from './types'

export default class Uniform<
  T extends GL.TypeName = GL.TypeName
> extends GLClass {
  private readonly handle: WebGLUniformLocation

  constructor(
    private readonly program: ShaderProgram,
    private readonly name: string,
    type?: T
  ) {
    super(`Uniform{${name}}`)
    const assert = this.assert('constructor')

    this.handle = assert(
      program.getUniformLocation(name),
      `couldn't get location for uniform "${name}"`
    )

    if (type) this.assertType(this.typeId(type))
  }

  public assertType(type: GLenum | GL.TypeName) {
    const typeId = this.isTypeName(type) ? this.typeId(type) : type
    this.assert('assertType')(
      this.info.type === typeId,
      `expected type ${this.typeName(typeId)} but got ${this.type}`
    )
  }

  private _type?: GL.TypeName
  public get type() {
    return (this._type ??= this.typeName(this.info.type))
  }

  private get info() {
    return this.assert('get info')(
      [...Array(this.program.activeUniformCount)]
        .map((_, i) => this.program.getActiveUniform(i))
        .find((info) => info?.name === this.name)
    )
  }
}
