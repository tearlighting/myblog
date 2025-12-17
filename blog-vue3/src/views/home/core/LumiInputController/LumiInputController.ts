import { createSubPubIns, SubPub } from "@/utils"
import Lenis, { type VirtualScrollData } from "lenis"
import type { ELumiState } from "../../constant"
import type { ILumiModule } from "../LumiModules/type"
import { ELumiTopic } from "../constant"

class AutoPlay {
  private _playable = true
  private _timer: number | null = null
  constructor(private _subPubIns: SubPub<ELumiTopic>) { }
  play() {
    requestAnimationFrame(() => {
      this._subPubIns.publish<VirtualScrollData>(ELumiTopic.scroll, { deltaY: 0.09, deltaX: 0, event: null as any })
      this._playable && this.play()
    })
  }
  stop() {
    this._playable = false
  }
  scheduleAutoPlay() {
    this.stop()
    if (this._timer) {
      clearTimeout(this._timer)
    }
    this._timer = setTimeout(() => {
      this._playable = true
      this._subPubIns.publish(ELumiTopic.autoPlay)
      this.play()
    }, 5 * 1000)
  }
}

/**
 * 触发事件用于控制 LumiModules
 */
export class LumiInputController {
  private _modules: ILumiModule[] = []
  private _subPubIns = createSubPubIns<ELumiTopic | ELumiState>()
  private _autoPlay: AutoPlay
  constructor(private _scrollerController: Lenis, private _pointerTrigger: HTMLElement) {
    this._autoPlay = new AutoPlay(this._subPubIns)

    // Lenis 的 scroll 事件
    this._scrollerController.on("virtual-scroll", (e) => {
      this._autoPlay.scheduleAutoPlay()
      this._subPubIns.publish(ELumiTopic.scroll, e)
    })
    //todo 待添加x触发器
    this._pointerTrigger.addEventListener("mousemove", (e) => {
      this._autoPlay.scheduleAutoPlay()
      if (this._scrollerController.isScrolling) return
      this._subPubIns.publish(ELumiTopic.hover, e)
    })
    //todo 待添加autopaly触发器
    this._autoPlay.scheduleAutoPlay()
  }

  get subPubIns() {
    return this._subPubIns
  }
  get autoPlay() {
    return this._autoPlay
  }
  /** 注册 Module */
  registerModule(module: ILumiModule): this {
    this._modules.push(module)
    if (module.onScroll) {
      this._subPubIns.subscribe<VirtualScrollData>(ELumiTopic.scroll, (e) => {
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
