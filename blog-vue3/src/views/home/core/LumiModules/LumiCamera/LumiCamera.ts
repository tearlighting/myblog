export interface LumiCameraState {
    offset: number              // 当前扫视偏移(px)
    maxOffset: number           // 这张图可扫视最大偏移(px)
    boundary: "top" | "bottom" | null
    pressure: number            // 0~1
    direction: 1 | -1
    tiltX: number
    tiltY: number
}

export class LumiCamera {
    private offset = 0
    private maxOffset = 0
    private pressure = 0

    // 这两个你后面可以调手感
    private readonly OFFSET_SPEED = 0.5          // deltaY 乘以这个 = offset 增量
    private readonly PRESSURE_SPEED = 0.0022     // 压力累积速度（越大越容易切页）
    private readonly PRESSURE_RELEASE = 0.0030   // 反向释放速度

    reset(config: { maxOffset: number }) {
        this.maxOffset = Math.max(0, config.maxOffset)
        this.offset = this.maxOffset / 2
        this.pressure = 0
    }

    consume(deltaY: number): LumiCameraState {
        const dir = (Math.sign(deltaY) || 1) as 1 | -1
        const abs = Math.abs(deltaY)

        const prev = this.offset
        const next = prev + deltaY * this.OFFSET_SPEED

        // ✅ clamp
        this.offset = Math.min(this.maxOffset, Math.max(0, next))

        let boundary: "top" | "bottom" | null = null
        if (this.offset <= 0) boundary = "top"
        if (this.offset >= this.maxOffset) boundary = "bottom"

        const atBoundarySameDir =
            boundary === "bottom" ? dir > 0 :
                boundary === "top" ? dir < 0 :
                    false

        if (boundary && atBoundarySameDir) {
            // ✅ 继续顶着同方向滚：累积 pressure
            this.pressure = Math.min(1, this.pressure + abs * this.PRESSURE_SPEED)
        } else {
            // ✅ 不在边界 或 反向：释放 pressure
            this.pressure = Math.max(0, this.pressure - abs * this.PRESSURE_RELEASE)
        }

        return {
            offset: this.offset,
            maxOffset: this.maxOffset,
            boundary,
            pressure: this.pressure,
            direction: dir,
            tiltX: 0,
            tiltY: 0,
        }
    }
}
