type LumiTextOptions = {
  el: HTMLElement
}

type LumiTextState = "idle" | "entering" | "visible" | "exiting"

export class LumiText {
  private el: HTMLElement
  private state: LumiTextState = "idle"
  private anim?: Animation

  constructor(opts: LumiTextOptions) {
    this.el = opts.el
    this.prepare()
  }

  /** 初始样式，只做一次 */
  private prepare() {
    const el = this.el

    el.style.willChange = "opacity, transform, filter"
    el.style.opacity = "0"
    el.style.transform = "translateY(12px)"
    el.style.filter = "blur(6px)"
    el.style.pointerEvents = "none"
  }

  /** 图片加载完成后调用 */
  enter() {
    if (this.state === "entering" || this.state === "visible") return

    this.cancel()
    this.state = "entering"

    this.anim = this.el.animate(
      [
        {
          opacity: 0,
          transform: "translateY(12px)",
          filter: "blur(6px)",
        },
        {
          opacity: 1,
          transform: "translateY(0px)",
          filter: "blur(0px)",
        },
      ],
      {
        duration: 220,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "forwards",
      }
    )

    this.anim.onfinish = () => {
      this.state = "visible"
    }
  }

  /** 切图前 / pressure 到阈值 / 你决定的时候 */
  exit() {
    if (this.state === "exiting" || this.state === "idle") return

    this.cancel()
    this.state = "exiting"

    this.anim = this.el.animate(
      [
        {
          opacity: 1,
          transform: "translateY(0px)",
          filter: "blur(0px)",
        },
        {
          opacity: 0,
          transform: "translateY(-8px)",
          filter: "blur(4px)",
        },
      ],
      {
        duration: 160,
        easing: "ease-in",
        fill: "forwards",
      }
    )

    this.anim.onfinish = () => {
      this.state = "idle"
    }
  }

  private cancel() {
    if (this.anim) {
      this.anim.cancel()
      this.anim = undefined
    }
  }

  destroy() {
    this.cancel()
  }
}
