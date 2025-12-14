export class LumiSmoothValue {
  /** 当前用于渲染的值 */
  value = 0

  /** 目标值（由输入不断修改） */
  private target = 0

  /** 平滑系数（0~1，越小越“重”） */
  private ease: number

  /** 允许的最小变化阈值，避免抖动 */
  private epsilon: number

  constructor(options?: { ease?: number; epsilon?: number; initial?: number }) {
    this.ease = options?.ease ?? 0.12
    this.epsilon = options?.epsilon ?? 0.001
    this.value = options?.initial ?? 0
    this.target = this.value
  }

  /** 外部：永远可以加力 */
  add(delta: number) {
    this.target += delta
  }

  /** 外部：直接设定目标（autoplay / reset 用） */
  set(target: number) {
    this.target = target
  }

  /** RAF 中调用，产出“可消费”的平滑值 */
  tick(): number {
    const diff = this.target - this.value

    if (Math.abs(diff) < this.epsilon) {
      this.value = this.target
      return this.value
    }

    this.value += diff * this.ease
    return this.value
  }

  /** 可选：强制停止 */
  snap() {
    this.value = this.target
  }
}

export class SmoothValue {
  private current = 0
  private target = 0

  constructor(private lerp = 0.14) {}

  set(v: number) {
    this.current = v
    this.target = v
  }

  add(delta: number) {
    this.target += delta
  }

  update() {
    this.current += (this.target - this.current) * this.lerp
    // 很接近就吸附，避免无限抖
    if (Math.abs(this.target - this.current) < 0.001) this.current = this.target
    return this.current
  }

  getCurrent() {
    return this.current
  }

  getTarget() {
    return this.target
  }
}
