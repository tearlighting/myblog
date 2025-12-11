import type { AppRoute, IRouteGuarder } from "router"
import type { RouteLocationRaw, Router } from "vue-router"
import { getMeta } from ".."
/**
 *放行外部链接
 * 
 */
export const createExternalGuard = <T extends AppRoute, R extends RouteLocationRaw>(routes: T[], router: Router, redirect: R) => {
  const externalGuard: IRouteGuarder = async ([to, from], next) => {
    const meta = getMeta(routes, to.name as string)
    if (meta.externalLink) {
      window.open(meta.externalLink, "_blank")
      const hasFrom = !!from.name
      if (hasFrom) {
        // ⭐ 内部跳转：回原路由
        router.replace(from.fullPath)
      } else {
        // ⭐ 外部直达（URL 输入 / 刷新）
        // 重定向到一个安全页面（你的首页）
        router.replace(redirect)
      }

      return
    }
    next()

  }
  return externalGuard
}
