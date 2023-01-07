import type { Fn } from 'froebel/types'

export namespace GL {
  export type Context = WebGLRenderingContext
  export type Call = PickKeys<Context, Fn>
  export type ProgramCall = CallAccepting<WebGLProgram>
  export type CallDef<T extends Call> = Context[T]
  export type Args<T extends Call> = Parameters<Context[T]>

  type CallAccepting<T> = PickKeys<Context, Fn<[T, ...any[]]>>
}

export type PickKeys<T, P> = {
  [K in keyof T]: T[K] extends P ? K : never
}[keyof T]

export type FnWrapper<F extends Fn, R = any> = Fn<
  ReturnType<F> extends void ? [] : [value: ReturnType<F>],
  R
>
