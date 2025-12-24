import type { VirtualScrollData } from "lenis"

export interface CarouselApplyState {
  progress: number // 0 ~ 1
  dir: 1 | -1
}

export interface CarouselAccumulatorOptions {
  threshold?: number
  damping?: number
}

// export class CarouselAccumulator {
//     private raw = 0       // 真正累积（一定能到 1）
//     private smooth = 0    // 视觉平滑
//     private rafId: number | null = null
//     /**
//      * 阈值
//      */
//     private threshold: number
//     /**
//      * 放缓
//      */
//     private damping: number
//     /**
//      * 每次获取的增量
//      */

//     private onSwitch?: (dir: 1 | -1) => void

//     constructor(opts: CarouselAccumulatorOptions = {}) {
//         this.threshold = opts.threshold ?? 0.9
//         this.damping = opts.damping ?? 0.12

//     }
//     defineOnSwitch(fn: (dir: 1 | -1) => void) {
//         this.onSwitch = fn
//         return this
//     }
//     /** Lenis / Wheel 输入 */
//     consume(payload: VirtualScrollData) {
//         const { deltaY } = payload
//         const dir = (Math.sign(deltaY) || 1) as 1 | -1
//         this.raw += Math.abs(deltaY) * 0.002

//         if (this.raw >= this.threshold) {
//             this.raw = 0
//             this.smooth = 0
//             this.onSwitch?.(dir)
//         }
//     }
//     reset() {
//         this.raw = 0
//         this.smooth = 0
//     }

//     start(apply: (state: CarouselApplyState) => void) {
//         const loop = () => {
//             // smooth 只负责视觉，不参与判断
//             this.smooth += (this.raw - this.smooth) * this.damping
//             apply({
//                 progress: Math.min(1, this.smooth),
//             })
//             this.rafId = requestAnimationFrame(loop)
//         }
//         loop()
//     }

//     stop() {
//         if (this.rafId) cancelAnimationFrame(this.rafId)
//         this.rafId = null
//     }
// }

export class CarouselAccumulator {
  private value = 0 // 当前势能（-1 ~ 1）
  private rafId: number | null = null
  private dir: 1 | -1 = 1

  private readonly threshold = 0.92
  private readonly damping = 0.88
  private locked = false
  private onSwitch?: (dir: 1 | -1) => void

  defineOnSwitch(fn: (dir: 1 | -1) => void) {
    this.onSwitch = fn
    return this
  }

  consume(payload: VirtualScrollData) {
    if (this.locked) return
    const { deltaY } = payload
    const delta = deltaY * 0.004

    // 累积（允许正负）
    this.value += delta

    // 限制范围
    this.value = Math.max(-1, Math.min(1, this.value))
    this.dir = this.value > 0 ? 1 : -1

    // 判断翻页（用视觉值！）
    if (Math.abs(this.value) >= this.threshold) {
      this.locked = true
      requestAnimationFrame(() => {
        this.onSwitch?.(this.dir)
        // 翻页后保留一点残余，避免“断感”
        this.value = 0
      })

    }
  }

  start(apply: (state: CarouselApplyState) => void) {
    const loop = () => {
      // 自然衰减（回到 0）
      this.value *= this.damping
      // 小于极小值直接归零，防抖
      if (Math.abs(this.value) < 0.001) {
        this.value = 0
      }
      apply({
        progress: this.value,
        dir: this.dir,
      })
      this.rafId = requestAnimationFrame(loop)
    }
    loop()
  }

  stop() {
    if (this.rafId) cancelAnimationFrame(this.rafId)
    this.rafId = null
  }
  unlock() {
    this.locked = false
  }
}
