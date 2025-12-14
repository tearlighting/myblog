import type { LumiCameraState } from "./LumiCamera"

export class LumiSmoothCameraState {
  private _current: LumiCameraState | null = null

  constructor(private damping = 0.1) {}

  update(target: LumiCameraState): LumiCameraState {
    if (!this._current) {
      this._current = { ...target }
      return this._current
    }

    this._current.offset += (target.offset - this._current.offset) * this.damping
    // 1. 先算 raw pressure（瞬时）
    const rawPressure = target.pressure

    // 2. 方向或 boundary 变化 => 立刻释放
    if (this._current.direction !== target.direction || this._current.boundary !== target.boundary) {
      this._current.pressure = 0
    } else {
      // 3. 只允许“增加是快的，减少是更快的”
      if (rawPressure > this._current.pressure) {
        // 累积（慢）
        this._current.pressure += (rawPressure - this._current.pressure) * this.damping
      } else {
        // 释放（快）
        this._current.pressure += (rawPressure - this._current.pressure) * 0.35
      }
    }
    this._current.pressure = snap(this._current.pressure, target.pressure)
    this._current.tiltX += (target.tiltX - this._current.tiltX) * this.damping
    this._current.tiltY += (target.tiltY - this._current.tiltY) * this.damping

    // boundary / direction 不 smooth（离散）
    this._current.boundary = target.boundary
    this._current.direction = target.direction
    this._current.maxOffset = target.maxOffset

    return this._current
  }

  reset() {
    this._current = null
  }
  get current() {
    return this._current
  }
}

const snap = (current: number, target: number) => {
  const delt = Math.abs(target - current)
  if (delt < 0.03) {
    current = target
  }
  return current
}
