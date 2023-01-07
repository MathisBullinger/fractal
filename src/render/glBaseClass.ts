import type { Fn } from 'froebel/types'
import * as debug from './debug'

export default abstract class GLClass {
  constructor(private readonly className: string) {
    this.bind(this)(this.prefixFn)
  }

  private prefixFn =
    <T extends (..._: any[]) => any>(fn: T) =>
    (method: string): ReturnType<T> =>
      ((...args: any[]) =>
        fn(`[${this.className}${method ? `.${method}` : ''}]`)(...args)) as any

  protected log = this.prefixFn(
    (prefix: string) =>
      (...args: unknown[]) =>
        console.log(prefix, ...args)
  )

  protected assert = this.prefixFn(
    (prefix: string) =>
      <T>(assertion: T, ...msgs: unknown[]) =>
        debug.assert(
          assertion,
          prefix,
          ...(msgs.length ? msgs : ['assertion failed'])
        )
  )

  protected bind =
    (context: unknown) =>
    (...methods: Fn[]) => {
      methods.forEach((method) => method.bind(context))
    }

  protected typeName = debug.glTypename

  protected formatList(values: unknown[], type: 'and' | 'or' = 'or') {
    return new Intl.ListFormat(undefined, {
      type: type === 'and' ? 'conjunction' : 'disjunction',
    }).format(values.map(String))
  }
}
