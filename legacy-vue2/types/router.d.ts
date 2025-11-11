import "vue-router"
import { EPemission } from "@/store/pemission"
import { TIcon } from "@/components/icon"
declare module "vue-router" {
  interface RouteMeta {
    title?: ComputedRef<string> | string
    keepAlive?: boolean
    roles?: EPemission[]
    icon?: TIcon
    hidden?: boolean
    /**
     * 当前路由是否精确匹配
     * 但是我要是不用route-link,确实意义不大
     */
    exact?: boolean
  }
}
