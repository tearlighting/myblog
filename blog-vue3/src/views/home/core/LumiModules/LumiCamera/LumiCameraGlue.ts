import type { SubPub } from "@/utils"
import type { VirtualScrollData } from "lenis"
import { ELumiTopic } from "../../constant"
import type { ILumiModule } from "../type"
import { LumiCamera } from "./LumiCamera"
import { type ILumiRenderer } from "./LumiDomRenderer"
import { LumiSmoothCameraState } from "./LumiSmoothCameraState"

export class LumiCameraGlue implements ILumiModule {
  private cam = new LumiCamera()
  private locked = false
  private smoothState = new LumiSmoothCameraState(0.12)
  constructor(private render: ILumiRenderer, private pub: SubPub<ELumiTopic>) {
    pub.subscribe(ELumiTopic.autoPlay, () => {
      this.cam.reset(this.smoothState.current!)
      this.smoothState.reset()
    })
  }

  /** 在图片 load 完后调用 */
  resetCamera() {
    this.cam.reset({ maxOffset: this.render.metrics.maxOffset })
    this.locked = false
  }

  onScroll(payload: VirtualScrollData) {
    if (this.locked) return
    //todo smooth value,不应该直接消费
    const state = this.cam.consume(payload.deltaY)
    const smooth = this.smoothState.update(state)
    this.render.apply(smooth)

    // ✅ 顶到边界并压满：触发切页（一次）
    if (smooth.pressure >= 1 && smooth.boundary) {
      console.log("切页", payload);

      this.locked = true
      this.pub.publish(ELumiTopic.switch, payload)
      this.smoothState.reset()
    }
  }
  onHover(p: { nx: number; ny: number }): void { }
}
