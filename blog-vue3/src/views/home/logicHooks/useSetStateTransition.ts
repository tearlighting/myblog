import { createFlowMiddleware, sleep, type FlowMiddleWareCallback } from "@/utils"
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

interface ISwichMiddleWareProps {
    switchSlide(payload: VirtualScrollData): void
    payload: VirtualScrollData
}
const showLeavingAnimation: FlowMiddleWareCallback<ISwichMiddleWareProps> = async (_, next) => {
    const { lumiStore: { scene, lumiRender, lumiText } } = useHomeStore()
    await lumiText.value.exit()
    await sleep(200)
    await lumiRender.beforeSwitch?.()
    scene.value?.autoPlay.scheduleAutoPlay()
    await next()
}

const switchSlide: FlowMiddleWareCallback<ISwichMiddleWareProps> = async ({ switchSlide, payload }, next) => {
    switchSlide(payload)
    await next()
}
const switchMiddleWare = createFlowMiddleware<ISwichMiddleWareProps>().use(showLeavingAnimation).use(switchSlide)

export const useSetStateTransition = ({ mediaRef, imgRef, switchSlide }: IUseSetStateTransitionProps) => {
    const { lumiStore: { scene, lumiRender, camera, lumiText } } = useHomeStore()
    const subPub = scene.value?.subPubIns
    if (!subPub) return
    /**
     * 加载资源阶段
     */
    subPub.subscribe(ELumiState.idle, async () => {
        mediaRef.value?.classList.remove("is-loaded")
        await nextTick()
        /**
         * 去掉之前的动画效果，准备开始loaded的动画效果
         */
        imgRef.value && lumiRender.switchImg(imgRef.value)
    })
    /**
     * 资源加载完成
     */
    subPub.subscribe(ELumiState.ready, async () => {
        console.log("ready");

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
        })

    })
    /**
     * 切换
     */
    subPub.subscribe(ELumiState.switching, async (payload: VirtualScrollData) => {
        await switchMiddleWare.run({
            switchSlide,
            payload
        })
    })

}
