import Loading from "@/components/loading/index.vue"
import { getVueComponentEl } from "@/utils"

interface ILoading {
  element?: HTMLElement
}

enum ELoadingComponent {
  loading = ".loading-container",
}

function haveLoading(element: ILoading["element"]) {
  return [...element.children].includes(element.querySelector(`.${ELoadingComponent.loading}`))
}
export default function () {
  let el: ILoading["element"] = null
  let loadingInstance: HTMLElement = null
  let isLoading = false

  function mount({ element = document.body }: ILoading = {}) {
    el = element
  }

  function showLoading({ placeholder = "waiting" } = {}) {
    if (isLoading) {
      return
    }
    if (!el) {
      throw new Error("请先执行mount")
    }
    if (!loadingInstance) {
      loadingInstance = getVueComponentEl(Loading, { placeholder })
      if (el.style.position === "static" || !getComputedStyle(el).position) {
        el.style.position = "relative"
      }
      el.append(loadingInstance)
    } else loadingInstance.style.visibility = "visible"

    isLoading = true
  }
  function hiddenLoading() {
    if (!isLoading) {
      return
    }
    loadingInstance && Reflect.set(loadingInstance.style, "visibility", "hidden")
    isLoading = false
  }
  function destory() {
    loadingInstance && loadingInstance.remove()
  }

  function isMounted() {
    return !!el
  }

  return {
    destory,
    hiddenLoading,
    showLoading,
    mount,
    isMounted,
  }
}
