import { createSubPubIns } from '@/utils'
import Lenis, { type VirtualScrollData } from 'lenis'
import type { ILumiModule } from '../LumiModules/type'
import { ELumiTopic } from '../constant'


export class LumiSceneController {
    private _modules: ILumiModule[] = []
    private _subPubIns = createSubPubIns<ELumiTopic>()
    constructor(private _scrollerController: Lenis,) {
        // Lenis 的 scroll 事件
        this._scrollerController.on("virtual-scroll", (e) => this._subPubIns.publish(ELumiTopic.scroll, e)
        )
    }

    get subPubIns() {
        return this._subPubIns
    }
    /** 注册 Module */
    registerModule(module: ILumiModule): this {
        this._modules.push(module)
        if (module.onScroll) {
            this._subPubIns.subscribe<VirtualScrollData>(ELumiTopic.scroll, e => {
                module.onScroll!(e)
            })
        }
        return this
    }



    destroy() {
        this._subPubIns.destroy()
        this._scrollerController.destroy()
        this._modules.length = 0
    }
}
