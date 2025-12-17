import type { LumiCameraState } from "./LumiCamera"
import type { ILumiRenderer } from "./LumiDomRenderer"
import { computeLumiMetrics, type LumiSlideMetrics } from "./lumiMetrics"
import { LumiGlassCrackFxV2 as LumiGlassOverlayFx } from "./LumiShatterFx"

export class LumiThreeRenderer implements ILumiRenderer {
  private card!: HTMLElement
  private media!: HTMLElement
  private img!: HTMLImageElement
  private glass!: HTMLElement
  private blur!: HTMLElement
  private shatterFx!: LumiGlassOverlayFx

  metrics!: LumiSlideMetrics

  bind(dom: { card: HTMLElement; media: HTMLElement; img: HTMLImageElement; glass: HTMLElement; blur: HTMLElement }) {
    this.card = dom.card
    this.media = dom.media
    this.img = dom.img
    this.glass = dom.glass
    this.blur = dom.blur
    this.shatterFx = new LumiGlassOverlayFx({
      container: this.glass,
    })
    this.switchImg(this.img)
  }

  updateMetrics() {
    this.metrics = computeLumiMetrics(this.img, this.card)
  }

  resetVisual() {
    this.media.style.transform = ""
    this.card.style.transform = ""
    this.card.style.filter = ""
  }
  switchImg(img: HTMLImageElement) {
    this.img = img
    this.resetVisual()
  }
  beforeSwitch(): void | Promise<void> {
    return this.shatterFx.shatter()
  }

  apply(state: LumiCameraState) {
    // Y：真实扫视
    const y = state.offset
    this.media.style.transform = `translate3d(0, ${-y}px, 0)`

    // X：高级感（不是拖）
    const xShift = state.tiltX * 16
    this.img.style.objectPosition = `calc(50% + ${xShift}px) 50%`

    // 卡片反馈
    this.card.style.transform = `
      perspective(1200px)
      rotateY(${state.tiltX}deg)
      rotateX(${state.tiltY}deg)
      scale(${1 + state.pressure * 0.04})
    `
    // console.log(state.pressure)

    this.blur.style.filter = `
      blur(${state.pressure * 4}px)
      brightness(${1 - state.pressure * 0.12})
    `
    this.card.style.setProperty("--lumi-pressure", String(state.pressure))

    // 位移这种“物理量”你可以继续直接写
    // this.media.style.transform = `translate3d(0, ${-state.offset}px, 0)`
    // this.card.style.transform = `
    //   perspective(1200px)
    //   translateZ(${state.pressure * 40}px)
    //   scale(${1 + state.pressure * 0.03})

    // `

    this.shatterFx.apply(state)
  }
}
