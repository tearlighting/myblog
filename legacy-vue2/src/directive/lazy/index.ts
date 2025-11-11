import eventBus, { EMyBlogMainScrollEvent } from "@/eventBus"
import store from "@/store"
import { debonce } from "@/utils"
import type { ObjectDirective } from "vue"
import { computed, nextTick, reactive, ref } from "vue"

interface ILazyOptions {
  src: string
  isLoaded: boolean
  el: HTMLImageElement
}
const lazyImgMap = new Map<HTMLImageElement, ILazyOptions>()
const unLoadImg = computed(() => Array.from(lazyImgMap.values()).filter((x) => !x.isLoaded))

const view2Top = ref(store.getters["layoutStore/view2Top"] as number)

/**
 * 加载视口中的图片
 * @param el
 */

function loadViewPointImg(el: HTMLImageElement) {
  // console.log(unLoadImg.value);
  // console.log(el.getBoundingClientRect());
  // console.log(el);

  const clientHeight = document.documentElement.clientHeight
  const { height, top, bottom } = el.getBoundingClientRect()
  if (top - view2Top.value > 0) {
    if (bottom - height <= clientHeight) {
      //    console.log(el,"在视口",)
      renderImg(el)
    }
  } else {
    if (bottom - view2Top.value > 0) {
      //   console.log(el,"在视口")
      renderImg(el)
    }
  }
}
/**
 * 初始化的时候先设置占位gif
 * @param el
 *
 */
function setLoadingImg(el: HTMLImageElement) {
  el.src = require("@/assets/danmati_loading.gif")
  el.style.objectFit = "cover"
  el.style.objectPosition = "bottom"
  el.clientHeight
}

function renderImg(el: HTMLImageElement) {
  const options = lazyImgMap.get(el)
  if (options.isLoaded) {
    return
  }
  const tempImg = document.createElement("img")
  tempImg.onload = () => {
    setTimeout(() => {
      el.src = options.src
      el.onload = () => {
        el.style.objectFit = "contain"
        el.style.objectPosition = "initial"
      }
      options.isLoaded = true
    }, 10)
  }
  tempImg.src = options.src
}

function loadViewPointImgs() {
  for (let i of unLoadImg.value) {
    // console.log(i)
    loadViewPointImg(i.el)
  }
}

const debonceLoadViewPointImg = debonce(loadViewPointImgs)

eventBus.on(EMyBlogMainScrollEvent.mainScrollWheel, () => {
  //   console.log("move")

  debonceLoadViewPointImg()
})

export const lazy: ObjectDirective<HTMLImageElement, string> = {
  bind(el, binding) {
    lazyImgMap.set(
      el,
      reactive({
        src: binding.value,
        isLoaded: false,
        el,
      })
    )
    setLoadingImg(el)
  },
  inserted(el, bind) {
    nextTick().then(() => setTimeout(() => loadViewPointImg(el), 1000))
  },
  update() {},
  unbind(el) {},
}
