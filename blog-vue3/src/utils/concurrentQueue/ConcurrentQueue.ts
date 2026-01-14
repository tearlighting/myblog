type Task = () => Promise<void>

export class ConcurrentQueue {
    private readonly _queue: Task[] = []
    private _running = 0

    private _finishResolver?: () => void
    private _finishRejecter?: (reason?: any) => void
    private _isRunning = false
    private _isStopped = false
    private _stopReson: any

    constructor(private _concurrency: number = 100) {
        if (_concurrency <= 0) throw new Error("concurrency must be > 0")
    }

    push(task: Task) {
        this._queue.push(task)
    }

    async run() {
        if (this._isRunning) return
        this._isRunning = true

        const { promise, resolve, reject } = Promise.withResolvers<void>()
        this._finishResolver = resolve
        this._finishRejecter = reject

        //if don't have task, resolve immediately
        if (this._queue.length === 0) {
            this._finishResolver()
            this._isRunning = false
            return
        }

        this.runNext()

        try {
            return await promise
        } finally {
            // clean up
            this._isRunning = false
            this._isStopped = false
            this._finishResolver = undefined
            this._finishRejecter = undefined
        }
    }

    stop(reason: any = new Error("ConcurrentQueue stopped")) {
        if (!this._isRunning || this._isStopped) return
        this._isStopped = true
        this._queue.length = 0
        this._stopReson = reason
        this.tryFinish()
    }
    private tryFinish() {
        if (this._running === 0 && this._queue.length === 0) {
            if (!this._isStopped) {
                this._finishResolver?.()
            } else {
                this._finishRejecter?.(this._stopReson)
            }
        }
    }

    private runNext() {
        while (
            this._running < this._concurrency &&
            this._queue.length > 0 &&
            !this._isStopped
        ) {
            const task = this._queue.shift()!
            this._running++

            task()
                .catch(() => {
                    // don't care about the error
                })
                .finally(() => {
                    this._running--
                    this.runNext()
                    this.tryFinish()
                })
        }
    }
}

