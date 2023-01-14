import * as renderer from './render'
import debounce from 'froebel/debounce'
import clamp from 'froebel/clamp'

export default class Settings {
  #iterations = Settings.readParam('i', 'float') ?? 100
  #hueShift = Settings.readParam('h', 'float') ?? 0.55
  #center = Settings.readParam('c', 'complex') ?? [-0.5, 0]
  #scale = Settings.readParam('s', 'float') ?? 2.3

  #iterationLabel = document.querySelector('.iterations > span')!
  #hueLabel = document.querySelector('.hue > span')!

  constructor() {
    renderer.setIterations(this.#iterations)
    renderer.setColorShift(this.#hueShift)
    renderer.setCenter(...this.#center)
    renderer.setScale(this.#scale)
    this.setLabels()

    const iterationSlider = document.querySelector<HTMLInputElement>(
      '.iterations > input'
    )!
    iterationSlider.value = Math.sqrt(1000 * this.iterations).toString()
    iterationSlider.addEventListener('input', ({ target }) => {
      const value = parseInt((target as HTMLInputElement).value)
      this.iterations = Math.max(Math.round(value ** 2 / 1000), 2)
    })

    const hueSlider = document.querySelector<HTMLInputElement>('.hue > input')!
    hueSlider.value = this.hueShift.toString()
    hueSlider.addEventListener('input', ({ target }) => {
      this.hueShift = parseFloat((target as HTMLInputElement).value)
    })
  }

  public get iterations() {
    return this.#iterations
  }

  public set iterations(n: number) {
    renderer.setIterations((this.#iterations = n))
    this.encodeState()
    this.setLabels()
  }

  public get hueShift() {
    return this.#hueShift
  }

  public set hueShift(n: number) {
    renderer.setColorShift((this.#hueShift = clamp(0, n, 1)))
    this.encodeState()
    this.setLabels()
  }

  public get scale() {
    return this.#scale
  }

  public set scale(n: number) {
    renderer.setScale((this.#scale = clamp(1e-5, n, 3)))
    this.encodeState()
  }

  public get center() {
    return this.#center
  }

  public set center(v: Complex) {
    renderer.setCenter(...(this.#center = [...v]))
    this.encodeState()
  }

  public move([r, i]: Complex) {
    this.center = [this.center[0] + r, this.center[1] + i]
  }

  private setLabels() {
    this.#iterationLabel.innerHTML = `iterations: ${this.#iterations}`
    this.#hueLabel.innerHTML = `hue shift: ${this.#hueShift}`
  }

  private encodeState = debounce(() => {
    const params = new URLSearchParams(location.search)
    params.set('i', Settings.urlTypes.float.encode(this.iterations))
    params.set('h', Settings.urlTypes.float.encode(this.#hueShift))
    params.set('c', Settings.urlTypes.complex.encode(this.#center))
    params.set('s', Settings.urlTypes.float.encode(this.#scale))
    history.replaceState({}, '', `${location.pathname}?${params.toString()}`)
  }, 200)

  private static readParam<T extends keyof typeof Settings['urlTypes']>(
    name: string,
    type: T
  ): ReturnType<typeof Settings['urlTypes'][T]['decode']> {
    const value = new URLSearchParams(location.search).get(name)
    return value !== null
      ? (Settings.urlTypes[type].decode(value) as any)
      : null
  }

  static urlTypes = {
    float: {
      encode: (v: number) => v.toString(),
      decode: (v) => (v ? parseFloat(v) : null),
    },
    complex: {
      encode: ([r, i]: Complex) => `${r}${`+${i}`.replace(/^\+-/, '-')}i`,
      decode: (v) =>
        v
          .replace(/i$/, '')
          .split(/(?=[+\-])/)
          .map((v) => parseFloat(v)) as Complex,
    },
  } satisfies Record<string, Serializable<any>>
}

type Serializable<T> = {
  encode: (value: T) => string
  decode: (encoded: string) => T | null
}

export type Complex = [real: number, imaginary: number]
