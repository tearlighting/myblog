import { createFlowMiddleware, sleep, type FlowMiddleWareCallback } from "@/utils"
import { ECarouselPhase } from "../constant"
import { useProjectStore } from "../store"

interface IUseInitStateTransitionProps {
    changeActiveIndex: (dir: -1 | 1) => void
    track: HTMLElement,

}

export interface ISwichActiveIndexMiddleWareCtx {
    dir: -1 | 1
    source?: "click",
    changeActiveIndex: (dir: -1 | 1) => void
    track: HTMLElement
}
const isFromClick: FlowMiddleWareCallback<ISwichActiveIndexMiddleWareCtx> = async ({ source }, next) => {
    if (source === "click") {
        //点击的话，要快点触发，要不然感觉卡了一样
        await sleep(200)
    } else {
        //滚动的话要阻尼等动画结束
        await sleep(500)
    }
    await next()
}

const switchIndex: FlowMiddleWareCallback<ISwichActiveIndexMiddleWareCtx> = async ({ dir, changeActiveIndex, track }, next) => {
    track.style.setProperty('--p', String(0))
    track.style.setProperty('--dir', String(dir))
    changeActiveIndex(dir)
    await next()
}
const switchActiveIndexMiddleWare = createFlowMiddleware<ISwichActiveIndexMiddleWareCtx>().use(isFromClick).use(switchIndex)

export const useInitStateTransition = ({ changeActiveIndex, track }: IUseInitStateTransitionProps) => {
    const { projectCardECarouselPhaseStateMachineRef, projectSubPub: { subPubIns } } = useProjectStore()
    const stateMachine = projectCardECarouselPhaseStateMachineRef.current
    if (!stateMachine) return
    subPubIns.subscribe<Pick<ISwichActiveIndexMiddleWareCtx, "source" | "dir">>(ECarouselPhase.switching, async (payload) => {
        switchActiveIndexMiddleWare.run({
            ...payload,
            changeActiveIndex,
            track
        })

    })
}