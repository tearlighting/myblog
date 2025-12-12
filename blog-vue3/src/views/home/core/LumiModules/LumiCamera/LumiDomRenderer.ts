import type { LumiCameraState } from "./LumiCamera";
import type { LumiSlideMetrics } from "./lumiMetrics";

export interface ILumiRenderer {
    /** 绑定 DOM 引用，避免每帧 querySelector */
    bind(dom: { card: HTMLElement; media: HTMLElement; img: HTMLImageElement }): void

    /** slide 切换 / img load 后更新量测 */
    updateMetrics(metrics: LumiSlideMetrics): void

    /** 每帧渲染：只做 style 写入 */
    apply(state: LumiCameraState): void

    /** 可选：切换时做一次性的 reset */
    resetVisual(): void
}

export class LumiDomRenderer {
    private card!: HTMLElement
    private media!: HTMLElement
    private img!: HTMLImageElement
    private metrics!: LumiSlideMetrics

    bind(dom: {
        card: HTMLElement
        media: HTMLElement
        img: HTMLImageElement
    }) {
        this.card = dom.card
        this.media = dom.media
        this.img = dom.img
    }

    updateMetrics(metrics: LumiSlideMetrics) {
        this.metrics = metrics
    }

    reset() {
        this.media.style.transform = ''
        this.card.style.transform = ''
        this.card.style.filter = ''
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
        this.card.style.filter = `
      blur(${state.pressure * 8}px)
      brightness(${1 - state.pressure * 0.12})
    `
    }
}

