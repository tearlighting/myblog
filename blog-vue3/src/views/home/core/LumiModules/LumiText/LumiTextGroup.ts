import { LumiTextItem } from "./LumiTextItem"

type LumiTextGroupItem = {
  el: HTMLElement
  role: "title" | "description"
}

export class LumiTextGroup {
  private items: LumiTextItem[]

  constructor(opts: { container: HTMLElement; items: LumiTextGroupItem[] }) {
    this.items = opts.items.map((i) => new LumiTextItem(i.el))
  }

  /** 顺序入场：title → description */
  async enter() {
    await this.items[0]?.enter("bottom", 0)
    await this.items[1]?.enter("bottom", 100)
  }

  /** 反向退场：description → title */
  async exit() {
    await this.items[1]?.exit("top", 0)
    await this.items[0]?.exit("top", 70)
  }
}
