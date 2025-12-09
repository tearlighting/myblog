import { defineStore } from "pinia"
import { computed, ref } from "vue"
import pinia from "../store"
import Lenis from "lenis"

export const usePageHostStore = defineStore("pageHost", () => {
  const hostRef = ref<HTMLDivElement>()
  const hostLenisInstance = computed(() => {
    const host = hostRef.value
    if (!host) return
    const lenis = new Lenis({
      wrapper: host,
      content: document.querySelector(".content")!,
      eventsTarget: host,
      smoothWheel: true,
      lerp: 0.1,
    })
    return lenis
  })
  const scrollTop = () => {
    if (!hostLenisInstance.value) return
    hostLenisInstance.value.scrollTo(0, { duration: 1000 })
  }
  const scrollBottom = () => {
    if (!hostLenisInstance.value) return
    hostLenisInstance.value.scrollTo(hostLenisInstance.value.scroll, { duration: 1000 })
  }
  return {
    hostRef,
    hostLenisInstance,
    scrollTop,
    scrollBottom,
  }
})

export const usePageHostStoreHook = () => usePageHostStore(pinia)
