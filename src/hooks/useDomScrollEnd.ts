import { EventEmitter } from "@/utils/eventmitter"

function useDomScrollEnd() {
  let element: HTMLElement = null
  let range: number = 50
  let monitor: EventEmitter = null
  function mount({ dom, range = 50 }: { dom: HTMLElement; range?: number }) {
    if (dom) {
      element = dom
      addEventListener()
      monitor = new EventEmitter()
    }
  }

  function addEventListener() {
    element.addEventListener("wheel", wheelHandler)
  }

  function onToEnd(fun: (arg: any) => any) {
    monitor.on("scrollToEnd", fun)
  }

  function onScroll(fun: (arg: any) => any){
	monitor.on("scroll", fun)
  }

  function wheelHandler(event: WheelEvent) {
	monitor.emit("scroll")
    // console.log(element.scrollTop, element.scrollHeight, element.clientHeight)
    const { scrollTop, scrollHeight, clientHeight } = element
    if (Math.abs(scrollHeight - scrollTop - clientHeight) < range) {
      monitor.emit("scrollToEnd")
    }
  }
  function destory() {
    monitor.offAll()
    monitor = null
    range = null
    element = null
  }
  return {
    mount,
    onToEnd,
    destory,
	onScroll
  }
}

export { useDomScrollEnd }
