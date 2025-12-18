import type { SubPub } from "@/utils";
import type { VirtualScrollData } from "lenis";
import { ECarouselScroll } from "../constant";
import type { CarouselAccumulator, CarouselApplyState } from "./CarouselAccumulator";

export class CarouselGlue {
    private _apply!: (state: CarouselApplyState) => void;
    constructor(private _carouselAccuulatorIns: CarouselAccumulator, subPubIns: SubPub<ECarouselScroll>) {
        subPubIns.subscribe<VirtualScrollData>(ECarouselScroll.update, (payload) => {
            this._carouselAccuulatorIns.consume(payload)
        })
    }
    start() {
        if (!this._apply) throw new Error("apply is not set")
        this._carouselAccuulatorIns.start(this._apply)
    }
    stop() {
        this._carouselAccuulatorIns.stop()
    }
    /**
     * 定义到映射到真实dom的函数
     * @param apply 
     */
    defineApply(apply: (state: CarouselApplyState) => void) {
        this._apply = apply
        return this
    }
    /**
     * 定义翻页的回调
     * @param fn 
     */
    defineOnSwitch(fn: (dir: 1 | -1) => void) {
        this._carouselAccuulatorIns.defineOnSwitch(fn)
        return this
    }
}
