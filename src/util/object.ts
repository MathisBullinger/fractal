import type { Fn } from 'froebel/types'

export const reverseMap = <T extends MultiMap>(map: T): ReverseMap<T> =>
  Object.fromEntries(
    Object.entries(map).flatMap(([k, v]) =>
      (Array.isArray(v) ? v : [v]).map((e) => [e, k])
    )
  ) as any

export type MultiMap<K extends string = any, V extends string = any> = {
  [_ in K]?: V | readonly V[]
}

export type ReverseMap<T extends MultiMap> = Intersect<
  {
    [K in keyof T]: { [V in FlatKey<T[K]>]: K }
  }[keyof T]
>

type FlatKey<T extends string | readonly string[]> = T extends string
  ? T
  : T[number]

type Intersect<U> = (U extends any ? Fn<[U]> : never) extends Fn<[infer I]>
  ? I
  : never

export const hasKey = <M extends Record<string, any>, T extends string>(
  map: M,
  key: T
) => (key in map) as T extends keyof M ? true : false
