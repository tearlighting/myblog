import { ref } from "vue"
import screenfull from "screenfull"

export default function () {
  let isFullScreen = false
  let currentDom: HTMLElement

  function change() {
    //@ts-ignore
    isFullScreen = screenfull.isFullscreen
    if (!isFullScreen && currentDom) {
      currentDom.classList.remove("isFullScreen")
      currentDom = null as any
    }
  }
  //@ts-ignore
  screenfull.on("change", change)
  function setFullScreen(dom: HTMLElement) {
    if (isFullScreen) {
      return
    }
    //@ts-ignore
    screenfull.toggle(dom as any)
    currentDom = dom
    dom.classList.add("isFullScreen")
  }

  function offFullScreen() {
    //@ts-ignore
    screenfull.off("change", change)
    if (currentDom) {
      currentDom = null as any
    }
  }
  return { setFullScreen, offFullScreen }
}
