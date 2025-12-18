export class AutoPlay {
    private _gen = 0
    private _timer: number | null = null
    private _rafId: number | null = null
    private _scheduleAutoPlayCb: (() => void) | null = null
    constructor(private _fallback: () => void) { }
    defineOnScheduleAutoPlay(cb: () => void) {
        this._scheduleAutoPlayCb = cb
        return this
    }
    start() {
        const gen = ++this._gen
        const tick = () => {
            this._rafId = requestAnimationFrame(() => {
                if (gen !== this._gen) return
                this._fallback()
                tick()
            })
        }

        tick()
    }

    stop() {
        this._gen++
        if (this._rafId) {
            cancelAnimationFrame(this._rafId)
            this._rafId = null
        }
    }

    scheduleAutoPlay(time = 5) {
        this.stop()
        if (this._timer) {
            clearTimeout(this._timer)
            this._timer = null
        }
        this._timer = setTimeout(() => {
            this.start()
            this._scheduleAutoPlayCb?.()
        }, time * 1000)
    }
}