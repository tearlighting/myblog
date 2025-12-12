import type { SubPub } from "@/utils"
import type { VirtualScrollData } from "lenis"
import { ELumiTopic } from "../../constant"
import type { ILumiModule } from "../type"
import { LumiCamera } from "./LumiCamera"
import { computeLumiMetrics, type LumiSlideMetrics } from "./lumiMetrics"
import { LumiSmoothAxis } from "./LumiSmooth"

export class LumiCameraGlue implements ILumiModule {
    private cam = new LumiCamera()
    private locked = false
    private metrics!: LumiSlideMetrics

    private yAxis = new LumiSmoothAxis({ ease: 0.08 })
    private xAxis = new LumiSmoothAxis({ ease: 0.15 })
    private pressureAxis = new LumiSmoothAxis({ ease: 0.1 })
    constructor(
        private card: HTMLElement,
        private img: HTMLImageElement,
        private pub: SubPub<ELumiTopic>
    ) { }

    /** 在图片 load 完后调用 */
    resetForCurrentSlide() {
        this.metrics = computeLumiMetrics(this.img, this.card)
        this.cam.reset({ maxOffset: this.metrics.maxOffset })
        this.locked = false
    }

    onScroll(payload: VirtualScrollData) {
        if (this.locked) return

        const state = this.cam.consume(payload.deltaY)

        // ✅ Y: 真实扫视（这里必须 clamp 后的 offset）
        this.img.style.transform = `translateY(${-state.offset}px)`

        // ✅ 边界反馈
        this.card.style.filter = `blur(${state.pressure * 8}px) brightness(${1 - state.pressure * 0.12})`
        this.card.style.transform = `perspective(1200px) rotateY(${state.tiltX}deg) rotateX(${state.tiltY}deg) scale(${1 + state.pressure * 0.04})`

        // ✅ 顶到边界并压满：触发切页（一次）
        if (state.pressure >= 1 && state.boundary) {
            this.locked = true
            this.pub.publish(ELumiTopic.switch, payload)
        }
    }

    /** 切页后由外面更新 img.src，再把新 img 传进来 */
    changeTarget(card: HTMLElement, img: HTMLImageElement) {
        this.card = card
        this.img = img
        // 注意：不要在这里立刻算 metrics，等 img load 完再 resetForCurrentSlide()
        this.locked = false
    }

    unlock() {
        this.locked = false
    }
}
