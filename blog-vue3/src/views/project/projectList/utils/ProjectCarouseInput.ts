import { EDeviceType } from "@/constants";
import { useAppStoreHook } from "@/store";
import { AutoPlay, createLenis, SubPub } from "@/utils";
import { DragGesture } from "@use-gesture/vanilla";
import Lenis, { type VirtualScrollData } from "lenis";
import { storeToRefs } from "pinia";
import { ECarouselPhase, ECarouselScroll } from "../constant";
import type { ProjectCardECarouselPhaseStateMachine } from "./ProjectCardECarouselPhaseStateMachine";


const { deviceType } = storeToRefs(useAppStoreHook())



export class ProjectCarouseInput {
    private _autoPlay: AutoPlay
    private _gesture: DragGesture

    constructor(private _lenis: Lenis, private _subPubIns: SubPub<ECarouselScroll>, private _target: HTMLElement | Window, private _projectCardStateMachine: ProjectCardECarouselPhaseStateMachine) {
        this._autoPlay = new AutoPlay(() => {
            this._subPubIns.publish<VirtualScrollData>(ECarouselScroll.update, { deltaY: 0.09, deltaX: 0, event: null as any })
        })
        this._lenis?.on('virtual-scroll', p => {
            // this._autoPlay.scheduleAutoPlay()
            _subPubIns.publish(ECarouselScroll.update, p)
        })
        this._gesture = new DragGesture(
            this._target,
            ({ delta: [dx], cancel, target }) => {
                //往上找父元素或者他自己
                if (!(target as HTMLElement)?.closest('[data-draggable]')) {
                    cancel()
                    return
                }

                if (_projectCardStateMachine.getState() !== ECarouselPhase.ready) {
                    cancel()
                    return
                }
                const scale = deviceType.value === EDeviceType.MOBILE ? 70 : 20
                const dy = dx * scale
                this._subPubIns.publish<VirtualScrollData>(ECarouselScroll.update, {
                    deltaX: dx,
                    deltaY: dy,
                    // velocityX: vx,
                    event: "Drag" as any,

                })
            },
            {
                axis: 'x',
                filterTaps: true,
                threshold: 4,
            }
        )

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
    private _projectCardStateMachine!: ProjectCardECarouselPhaseStateMachine

    defineTarget(target: HTMLElement | Window) {
        this._target = target
        this._lenis = createLenis({
            eventsTarget: target
        })

        return this
    }
    defineSubPub(subPubIns: SubPub<ECarouselScroll>) {
        this._subPubIns = subPubIns
        return this
    }
    defineProjectCardStateMachine(projectCardStateMachine: ProjectCardECarouselPhaseStateMachine) {
        this._projectCardStateMachine = projectCardStateMachine
        return this
    }
    build() {
        if (!this._target) throw new Error('target is required')
        if (!this._subPubIns) throw new Error('subPubIns is required')
        if (!this._projectCardStateMachine) throw new Error('projectCardStateMachine is required')
        return new ProjectCarouseInput(this._lenis!, this._subPubIns, this._target!, this._projectCardStateMachine)
    }
}



