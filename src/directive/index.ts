import type { Directive, VueConstructor } from "vue"
import { loading } from "./loading"
import { lazy } from "./lazy"

export const registerDirective = (vue: VueConstructor) => {
  vue.directive("loading", loading)
  vue.directive("lazyImg", lazy)
  //   console.log("loading")
}
