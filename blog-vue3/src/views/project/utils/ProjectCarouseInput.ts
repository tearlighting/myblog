import { AutoPlay, SubPub } from "@/utils";
import Lenis, { type VirtualScrollData } from "lenis";
import { ECarouselScroll } from "../constant";




export class ProjectCarouseInput {
    private _autoPlay: AutoPlay
    constructor(private _lenis: Lenis, private _subPubIns: SubPub<ECarouselScroll>, private _target: HTMLElement | Window) {
        this._autoPlay = new AutoPlay(() => {
            this._subPubIns.publish<VirtualScrollData>(ECarouselScroll.update, { deltaY: 0.09, deltaX: 0, event: null as any })
        })
        this._lenis?.on('virtual-scroll', p => {
            // this._autoPlay.scheduleAutoPlay()
            _subPubIns.publish(ECarouselScroll.update, p)
        })
        this._target.addEventListener('mousemove', () => {
            // this._autoPlay.scheduleAutoPlay()
        })
        // this._autoPlay.scheduleAutoPlay()
    }
}

export class ProjectCarouseInputBuilder {
    private _lenis: Lenis | null = null
    private _target: HTMLElement | Window | null = null
    private _subPubIns!: SubPub<ECarouselScroll>
    defineTarget(target: HTMLElement | Window) {
        this._target = target
        this._lenis = createLenis(target)
        return this
    }
    defineSubPub(subPubIns: SubPub<ECarouselScroll>) {
        this._subPubIns = subPubIns
        return this
    }
    build() {
        if (!this._target) throw new Error('target is required')
        if (!this._subPubIns) throw new Error('subPubIns is required')
        return new ProjectCarouseInput(this._lenis!, this._subPubIns, this._target!)
    }
}


const createLenis = (target: HTMLElement | Window = window) => {
    const lenis = new Lenis({
        smoothWheel: true,
        lerp: 0.12,
        eventsTarget: target,
    })
    function raf(time: number) {
        lenis!.raf(time)
        requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    return lenis
}
