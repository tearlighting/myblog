import { SubPub } from "@/utils"
import type Lenis from "lenis"
import type { VirtualScrollData } from "lenis"
import { ELumiTopic } from "../constant"
import type { ILumiModule } from "../LumiModels/types"

export class LumiInputController {
    private _modules: ILumiModule[] = []
    constructor(private _scrollerController: Lenis, private _subPubIns: SubPub<ELumiTopic>) {
        // Lenis 的 scroll 事件
        this._scrollerController.on("virtual-scroll", (e) => {
            this._subPubIns.publish(ELumiTopic.scroll, e)
        })
    }
    /** 注册 Module */
    registerModule(module: ILumiModule): this {
        this._modules.push(module)
        if (module.onScroll) {
            this._subPubIns.subscribe<VirtualScrollData>(ELumiTopic.scroll, (e) => {
                module.onScroll!(e)
            })
        }
        return this
    }

    destroy() {
        this._scrollerController.destroy()
        this._modules.length = 0
    }
}