interface IStartParams {
  dom?: HTMLElement
  duration?: number
  wait?: number
  callback?: Function
}

function useDomWidthTransitionHook() {
  let dom: HTMLElement = null
  /**
   * start 传进来的dom会覆盖原来的dom
   * @param param
   */
  function start({ dom: startDom, duration = 1000, wait = 0, callback }: IStartParams = {}) {
    if (!startDom && !dom) {
      throw new Error("请先挂载dom")
    }
    startDom && mount(startDom)
    dom.style.opacity = "0"
    dom.style.visibility = "hidden"
    const width = dom.clientWidth
    // console.log(width)

    dom.style.opacity = "1"
    dom.style.visibility = "visible"
    dom.style.overflow = "hidden"
    dom.style.width = "0"
    dom.style.transition = ` ${duration}ms ${wait}ms `
    //reflow
    getComputedStyle(dom).height

    dom.style.width = width + "px"
    // console.log(dom.clientWidth, dom)

    dom.addEventListener(
      "transitionend",
      () => {
        callback && callback()
        dom.style.transition = "initial"
        getComputedStyle(dom).height
        dom.style.transition = "1s 100ms"
      },
      { once: true }
    )
  }

  function mount(element: HTMLElement) {
    if (element) {
      dom = element
    } else {
      throw new Error(`dom不存在`)
    }
  }

  return { mount, start }
}

export default useDomWidthTransitionHook
