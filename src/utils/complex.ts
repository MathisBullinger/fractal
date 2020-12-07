export type Complex = [real: number, imaginary: number]

export const add = (a: Complex, b: Complex): Complex => [
  a[0] + b[0],
  a[1] + b[1],
]

export const multiply = (a: Complex, b: Complex): Complex => [
  a[0] * b[0] - a[1] * b[1],
  a[0] * b[1] + a[1] * b[0],
]

export const abs = ([r, i]: Complex): number => Math.sqrt(r ** 2 + i ** 2)
