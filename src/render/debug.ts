const glContextLookup: Record<GLenum, string> = Object.fromEntries(
  Object.entries(WebGLRenderingContext).map(([k, v]) => [v, k])
)

export const glTypename = (type: GLenum) =>
  glContextLookup[type] ?? `unknown (${type})`

export const indent = (text: string, spaces = 2) =>
  text
    .split('\n')
    .map((line) => ' '.repeat(spaces) + line)
    .join('\n')

export const assert = <T>(test: T, ...messages: unknown[]): Truthy<T> => {
  const msg = messages.map(String).join(' ') || 'assertion failed'
  if (!test) throw Error(msg)
  return test as Truthy<T>
}

export type Truthy<T> = Exclude<T, false | undefined | null | 0 | ''>
