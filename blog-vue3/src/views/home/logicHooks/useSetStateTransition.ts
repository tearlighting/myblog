import { sleep } from "@/utils"
import type { VirtualScrollData } from "lenis"
import { nextTick, type Ref } from "vue"
import { ELumiState } from "../constant"
import { ELumiTopic } from "../core/constant"
import { useHomeStore } from "../store"

interface IUseSetStateTransitionProps {
    mediaRef: Ref<HTMLElement | null>
    imgRef: Ref<HTMLImageElement | null>
    switchSlide(payload: VirtualScrollData): void
}
export const useSetStateTransition = ({ mediaRef, imgRef, switchSlide }: IUseSetStateTransitionProps) => {
    const { lumiStore: { scene, lumiRender, camera, lumiText }, lumiStateMachine } = useHomeStore()
    const subPub = scene.value?.subPubIns
    if (!subPub) return

    subPub.subscribe(ELumiState.loading, async () => {
        mediaRef.value?.classList.remove("is-loaded")
        await nextTick()
        /**
         * 去掉之前的动画效果，准备开始loaded的动画效果
         */
        imgRef.value && lumiRender.switchImg(imgRef.value)
    })
    subPub.subscribe(ELumiState.loaded, async () => {
        mediaRef.value?.classList.add("is-loaded")
        requestAnimationFrame(async () => {
            // ✅ 新图加载完成，更新 metrics
            lumiRender.updateMetrics()
            // ✅ 重置相机 逻辑开始位置(中间)
            camera.value?.resetCamera?.()
            //强制更新图片实际位置
            scene.value!.subPubIns.publish<VirtualScrollData>(ELumiTopic.scroll, {
                deltaY: 0,
                deltaX: 0,
                event: null as any,
            })
            lumiRender.onImgLoaded?.()
            await nextTick()
            await sleep(500)
            lumiText.value.enter()
            lumiStateMachine.send({
                type: ELumiState.showing,
            })
        })

    })

    //todo 其实这种连续的东西，他本身应该不是应该状态的转移，而应该是一个MiddleWare
    subPub.subscribe(ELumiState.leaving, async (payload: VirtualScrollData) => {
        await lumiText.value.exit()
        await sleep(200)
        await lumiRender.beforeSwitch?.()
        scene.value?.autoPlay.scheduleAutoPlay()
        console.log(payload);

        lumiStateMachine.send({
            type: ELumiState.leaved,
            payload
        })
    })

    subPub.subscribe(ELumiState.leaved, async (payload: VirtualScrollData) => {
        switchSlide(payload)
        lumiStateMachine.send({
            type: ELumiState.idle
        })
    })

}
