import { EventEmitter } from "@/utils/eventmitter"

export enum EMyBlogMainScrollEvent {
  /**
   * 主滚动条滚动了
   */
  mainScrollWheel = "mainScrollWheel",
  /**
   * 主滚动条触底了
   */
  mainScrollWheelEnd = "mainScrollWheelEnd",
  /**
   * 主滚动条返回顶部
   */
  mainScroll2Top = "mainScroll2Top",
}

export enum E2TopEvent {
  show2Top = "showToTop",
  hide2Top = "hide2Top",
}

const eventBus = new EventEmitter<EMyBlogMainScrollEvent | E2TopEvent>()

export default eventBus
