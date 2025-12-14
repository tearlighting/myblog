import type { LumiCameraState } from "./LumiCamera"
import { computeLumiMetrics, type LumiSlideMetrics } from "./lumiMetrics"

export interface ILumiRenderer {
  /** 绑定 DOM 引用，避免每帧 querySelector */
  bind(dom: { card: HTMLElement; media: HTMLElement; img: HTMLImageElement }): void

  /** slide 切换 / img load 后更新量测 */
  updateMetrics(): void

  /** 每帧渲染：只做 style 写入 */
  apply(state: LumiCameraState): void
  metrics: LumiSlideMetrics
  switchImg(img: HTMLImageElement): void
  beforeSwitch?(): void | Promise<void>
  onImgLoaded?(): void
}

export class LumiDomRenderer implements ILumiRenderer {
  private card!: HTMLElement
  private media!: HTMLElement
  private img!: HTMLImageElement

  metrics!: LumiSlideMetrics

  bind(dom: { card: HTMLElement; media: HTMLElement; img: HTMLImageElement }) {
    this.card = dom.card
    this.media = dom.media
    this.img = dom.img
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
  apply(state: LumiCameraState) {
    // Y：真实扫视
    //     const y = state.offset
    //     this.media.style.transform = `translate3d(0, ${-y}px, 0)`

    //     // X：高级感（不是拖）
    //     const xShift = state.tiltX * 16
    //     this.img.style.objectPosition = `calc(50% + ${xShift}px) 50%`

    //     // 卡片反馈
    //     this.card.style.transform = `
    //       perspective(1200px)
    //       rotateY(${state.tiltX}deg)
    //       rotateX(${state.tiltY}deg)
    //       scale(${1 + state.pressure * 0.04})
    //     `
    //     const p = state.pressure

    //     this.card.style.filter = `
    //   brightness(${1 - p * 0.12})
    //   contrast(${1 - p * 0.08})
    //   saturate(${1 - p * 0.15})
    // `
    this.card.style.setProperty("--lumi-pressure", String(state.pressure))

    // 位移这种“物理量”你可以继续直接写
    this.media.style.transform = `translate3d(0, ${-state.offset}px, 0)`
    this.card.style.transform = `
  perspective(1200px)
  translateZ(${state.pressure * 40}px)
  scale(${1 + state.pressure * 0.03})
`
  }
}
