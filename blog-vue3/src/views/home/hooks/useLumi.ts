import Lenis from "lenis"
import { shallowRef, type ShallowRef } from "vue"
import { LumiInputController } from "../core"
import { LumiCameraGlue } from "../core/LumiModules/LumiCamera/LumiCameraGlue"
import { type ILumiRenderer } from "../core/LumiModules/LumiCamera/LumiDomRenderer"
import { LumiThreeRenderer } from "../core/LumiModules/LumiCamera/LumiThreeRender"
import { LumiTextGroup } from "../core/LumiModules/LumiText/LumiTextGroup"

interface IInitialLumiEffectProps {
  target: HTMLElement;
  cardDoms: {
    card: HTMLElement
    img: HTMLImageElement
    media: HTMLElement
    glass: HTMLElement
    blur: HTMLElement
  }
  textDoms: {
    text: HTMLElement
    title: HTMLElement
    description: HTMLElement
  }
}

interface IUseLumi extends IDisposableStore<{}> {
  scene: ShallowRef<LumiInputController | null>
  camera: ShallowRef<LumiCameraGlue | null>
  initailLumiEffect: (target: IInitialLumiEffectProps) => void
  lumiRender: ILumiRenderer
  lumiText: ShallowRef<LumiTextGroup>
}

export const useLumi = (): IUseLumi => {
  let lenis: Lenis | null = null
  const scene = shallowRef<LumiInputController | null>(null) as ShallowRef<LumiInputController | null>
  const camera = shallowRef<LumiCameraGlue | null>(null) as ShallowRef<LumiCameraGlue | null>
  //   const lumiRender = new LumiDomRenderer()
  const lumiThreeRender = new LumiThreeRenderer()
  const lumiText = shallowRef<LumiTextGroup>() as ShallowRef<LumiTextGroup>
  let initialized = false
  const initailLumiEffect = ({ cardDoms: { card, img, media, glass, blur }, textDoms: { text, title, description }, target }: IInitialLumiEffectProps) => {
    if (initialized) return
    initialized = true

    lenis = createLenis(target)
    // lumiRender.bind({ card, img, media })
    lumiThreeRender.bind({ card, img, media, glass, blur })
    scene.value = new LumiInputController(lenis, card)
    camera.value = new LumiCameraGlue(lumiThreeRender, scene.value.subPubIns)

    lumiText.value = new LumiTextGroup({
      container: text,
      items: [
        {
          role: "title",
          el: title,
        },
        {
          role: "description",
          el: description,
        },
      ],
    })
    scene.value.registerModule(camera.value)
  }

  const init = () => { }
  const dispose = () => {
    lenis?.destroy()
    scene.value?.destroy()
  }
  return {
    init,
    dispose,
    initailLumiEffect,
    scene,
    camera,
    lumiRender: lumiThreeRender,
    lumiText,
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
