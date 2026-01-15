import type { VirtualScrollData } from "lenis"

export interface XAxisApplyState {
    x: number          // 0 ~ 1（你也可以换成 px）
    pressure: number   // 0 ~ 1
    dir: 1 | -1
    atEdge: boolean
}

export interface XAxisAccumulatorOptions {
    xSpeed?: number          // wheel -> x 的比例
    xDamping?: number        // xVelocity 衰减（如果你要）
    pressureGain?: number    // edge 时 pressure 累积速度
    pressureDamping?: number // pressure 衰减
    edgeThreshold?: number   // 触发“想要切换 section”的阈值
}

export class XAxisAccumulator {
    // 0~1
    private x = 0
    private pressure = 0
    private dir: 1 | -1 = 1

    private rafId: number | null = null
    private locked = false

    private readonly xSpeed: number
    private readonly pressureGain: number
    private readonly pressureDamping: number
    private readonly edgeThreshold: number

    private onEdgeSwitchIntent?: (dir: 1 | -1) => void

    constructor(opts: XAxisAccumulatorOptions = {}) {
        this.xSpeed = opts.xSpeed ?? 0.0008
        this.pressureGain = opts.pressureGain ?? 0.004
        this.pressureDamping = opts.pressureDamping ?? 0.86
        this.edgeThreshold = opts.edgeThreshold ?? 0.92
    }

    defineOnEdgeSwitchIntent(fn: (dir: 1 | -1) => void) {
        this.onEdgeSwitchIntent = fn
        return this
    }

    lock() {
        this.locked = true
    }

    unlock() {
        this.locked = false
        // 切完章回来，pressure 清掉更自然
        this.pressure = 0
    }

    /**
     * 只负责累积“输入”
     */
    consume(payload: VirtualScrollData) {
        if (this.locked) return
        const dy = payload.deltaY
        const delta = dy * this.xSpeed

        // dir 用“输入方向”更靠谱，不用看 x/pressure 的符号
        this.dir = delta >= 0 ? 1 : -1

        const nextX = this.x + delta

        // 非边界：推动 x，并衰减 pressure
        if (nextX > 0 && nextX < 1) {
            this.x = nextX
            return
        }

        // 到边界：x clamp，继续滚就累积 pressure
        this.x = Math.max(0, Math.min(1, nextX))

        // 只在“往边界外推”的方向才加压（避免边界抖）
        const pushingOut =
            (this.x <= 0 && this.dir === -1) || (this.x >= 1 && this.dir === 1)

        if (pushingOut) {
            this.pressure += Math.abs(dy) * this.pressureGain
            this.pressure = Math.max(0, Math.min(1, this.pressure))

            if (this.pressure >= this.edgeThreshold) {
                // 触发意图：让外层决定是否切 section
                this.onEdgeSwitchIntent?.(this.dir)
            }
        }
    }

    start(apply: (state: XAxisApplyState) => void) {
        const loop = () => {
            // pressure 自然回落（制造“松开”的感觉）
            this.pressure *= this.pressureDamping
            if (this.pressure < 0.001) this.pressure = 0

            const atEdge = this.x <= 0.0001 || this.x >= 0.9999

            apply({
                x: this.x,
                pressure: this.pressure,
                dir: this.dir,
                atEdge,
            })

            this.rafId = requestAnimationFrame(loop)
        }
        loop()
    }

    stop() {
        if (this.rafId) cancelAnimationFrame(this.rafId)
        this.rafId = null
    }
}
