type LumiTextItemState = "idle" | "entering" | "visible" | "exiting"

export class LumiTextItem {
  private el: HTMLElement
  private state: LumiTextItemState = "idle"
  private anim?: Animation

  constructor(el: HTMLElement) {
    this.el = el
    this.prepare()
  }

  private prepare() {
    const el = this.el
    el.style.willChange = "opacity, transform, filter"
    el.style.opacity = "0"
    el.style.filter = "blur(6px)"
  }

  async enter(from: "top" | "bottom" = "bottom", delay = 0) {
    if (this.state === "visible" || this.state === "entering") return
    this.cancel()
    this.state = "entering"

    const y = from === "top" ? -10 : 10

    this.anim = this.el.animate(
      [
        { opacity: 0, transform: `translateY(${y}px)`, filter: "blur(6px)" },
        { opacity: 1, transform: "translateY(0px)", filter: "blur(0px)" },
      ],
      {
        duration: 340,
        delay,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "forwards",
      }
    )

    await this.anim.finished
    this.state = "visible"
  }

  async exit(to: "top" | "bottom" = "top", delay = 0) {
    if (this.state === "idle" || this.state === "exiting") return
    this.cancel()
    this.state = "exiting"

    const y = to === "top" ? -8 : 8

    this.anim = this.el.animate(
      [
        { opacity: 1, transform: "translateY(0px)", filter: "blur(0px)" },
        { opacity: 0, transform: `translateY(${y}px)`, filter: "blur(4px)" },
      ],
      {
        duration: 160,
        delay,
        easing: "ease-in",
        fill: "forwards",
      }
    )

    await this.anim.finished
    this.state = "idle"
  }

  private cancel() {
    if (this.anim) {
      this.anim.cancel()
      this.anim = undefined
    }
  }
}
