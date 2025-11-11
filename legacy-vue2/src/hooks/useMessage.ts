import svgIcon from "@/components/svgIcon/index.vue"
import { getVueComponentEl } from "@/utils/getVueComponentEl"
//@ts-ignore
import messageStyle from "@/style/core/message.module.less"
import { faInfo } from "@fortawesome/free-solid-svg-icons"

// console.log(messageStyle)
export enum EMessageType {
  info = "info",
  success = "success",
  error = "error",
  warning = "warning",
}

interface IShowMessage {
  dom?: HTMLElement
  type?: EMessageType
  duration?: number
  callback?: () => void
  message?: string
}
export default function () {
  function showMessage({ dom = document.body, type = EMessageType.info, duration = 2000, callback, message = "message" }: IShowMessage = {}) {
    const realDom = getVueComponentEl(svgIcon, {
      icon: faInfo,
    })
    realDom.style.display = "inline-block"

    const container = document.createElement("div")
    container.classList.add(messageStyle[`message-${type}`], messageStyle[`message`])
    container.appendChild(realDom)
    if (getComputedStyle(dom).position === "static") {
      dom.style.position = "relative"
    }
    container.innerHTML = `${realDom.outerHTML} ${message}`
    dom.append(container)
    //reflow
    container.style.width
    console.log(getComputedStyle(container).width, 123)

    container.style.transform = "translate(-50%, -50%)"
    container.style.opacity = "1"
    setTimeout(() => {
      container.style.opacity = "0"
      container.style.transform = "translate(-50%, -50%) translateY(-2em)"
      //   container.ontransitionend = ()=>{
      // 		container.remove()
      //   }
      container.addEventListener(
        "transitionend",
        () => {
          container.remove()
          callback && callback()
        },
        { once: true }
      )
    }, duration)
  }
  return { showMessage }
}
