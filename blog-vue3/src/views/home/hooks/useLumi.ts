import Lenis from "lenis"
import { ref, type Ref } from "vue"
import { LumiSceneController } from "../core"
import { LumiCameraGlue } from "../core/LumiModules/LumiCamera/LumiCameraGlue"

interface IInitialLumiEffectProps {
    card: HTMLElement
    img: HTMLImageElement
    media: HTMLElement
}

interface IUseLumi extends IDisposableStore<{}> {
    scene: Ref<LumiSceneController | null>
    camera: Ref<LumiCameraGlue | null>
    initailLumiEffect: (target: IInitialLumiEffectProps) => void
}

export const useLumi = (): IUseLumi => {
    let lenis: Lenis | null = null
    const scene = ref<LumiSceneController | null>(null) as Ref<LumiSceneController | null>
    const camera = ref<LumiCameraGlue | null>(null) as Ref<LumiCameraGlue | null>
    let initialized = false
    const initailLumiEffect = ({ card, img, media }: IInitialLumiEffectProps) => {
        if (initialized) return
        initialized = true
        lenis = new Lenis({
            smoothWheel: true,
            lerp: 0.12,
        })

        scene.value = new LumiSceneController(lenis)


        camera.value = new LumiCameraGlue(
            card,
            img,
            scene.value.subPubIns
        )

        camera.value.changeTarget(card, img)

        scene.value.registerModule(camera.value)

        function raf(time: number) {
            lenis!.raf(time)
            requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)
    }

    const init = () => {

    }
    const dispose = () => {
        lenis?.destroy()
        scene.value?.destroy()

    }
    return {
        init,
        dispose,
        initailLumiEffect,
        scene,
        camera
    }
}