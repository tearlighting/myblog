import type { SubPub } from "@/utils"
import type { VirtualScrollData } from "lenis"
import { ELumiTopic } from "../../constant"
import type { XAxisAccumulator, XAxisApplyState } from "./XAxisAccumulator"

export class XAxisGlue {
    private _apply!: (s: XAxisApplyState) => void

    constructor(
        private accu: XAxisAccumulator,
        subPubIns: SubPub<ELumiTopic>
    ) {
        subPubIns.subscribe<VirtualScrollData>(ELumiTopic.scroll, (payload) => {
            this.accu.consume(payload)
        })
    }

    defineApply(apply: (s: XAxisApplyState) => void) {
        this._apply = apply
        return this
    }

    defineOnEdgeSwitchIntent(fn: (dir: 1 | -1) => void) {
        this.accu.defineOnEdgeSwitchIntent(fn)
        return this
    }

    start() {
        if (!this._apply) throw new Error("apply is not set")
        this.accu.start(this._apply)
    }

    stop() {
        this.accu.stop()
    }

    lock() {
        this.accu.lock()
    }

    unlock() {
        this.accu.unlock()
    }
}
