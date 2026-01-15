import { createLenis } from "@/utils"
import { LumiInputController, XAxisAccumulator, XAxisGlue } from "../core"
import { useAboutMeStore } from "../store"
interface IUseInitLumiEffect {
    scrollerWrapper: HTMLElement
    scrollerContent: HTMLElement
}
export const useInitLumiEffect = ({ scrollerContent, scrollerWrapper }: IUseInitLumiEffect) => {
    const { aboutMeSubPub: { subPubIns }, yAxisGlueIns, xAxisPhaseStateMachineRef, yAxisPhaseStateMachineRef } = useAboutMeStore()
    const lenisIns = createLenis({
        wrapper: scrollerWrapper,
        content: scrollerContent,
    })
    new LumiInputController(lenisIns, subPubIns)
    initXAxisEffect({ scrollerWrapper, scrollerContent })
}

const initXAxisEffect = ({ scrollerWrapper }: IUseInitLumiEffect) => {
    const { aboutMeSubPub: { subPubIns }, xAxisGlueIns, xAxisPhaseStateMachineRef, yAxisPhaseStateMachineRef } = useAboutMeStore()
    const gluer = new XAxisGlue(new XAxisAccumulator(), subPubIns).defineOnEdgeSwitchIntent((dir) => {
        console.log("switch", dir);

    }).defineApply(({ x, pressure, dir }) => {
        scrollerWrapper.style.setProperty("--x", String(x))
        scrollerWrapper.style.setProperty("--pressure", String(pressure))
        scrollerWrapper.style.setProperty("--xdir", String(dir))
    })
    gluer.start()
    xAxisGlueIns.current = gluer
}

// const initYAxisEffect = ({ scrollerWrapper }: IUseInitLumiEffect) => {
//     const { aboutMeSubPub: { subPubIns }, yAxisGlueIns, xAxisPhaseStateMachineRef, yAxisPhaseStateMachineRef } = useAboutMeStore()
//     const gluer = new XAxisGlue(new XAxisAccumulator(), subPubIns).defineOnEdgeSwitchIntent((dir) => {
//         console.log("switch", dir);

//     }).defineApply(({ x, pressure, dir }) => {
//         scrollerWrapper.style.setProperty("--x", String(x))
//         scrollerWrapper.style.setProperty("--pressure", String(pressure))
//         scrollerWrapper.style.setProperty("--xdir", String(dir))
//     })
//     gluer.start()
//     yAxisGlueIns.current = gluer
// }

