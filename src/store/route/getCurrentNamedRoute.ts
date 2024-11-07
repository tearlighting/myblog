import { RouteItem } from "./getDisplayRouteTree"
/**
 * 通过名字找命名路由
 * @param routes
 * @param param1
 * @returns
 */
export function getCurrentNamedRoute<T extends { name: string }>(routes: RouteItem[], { name }: T): RouteItem | null {
  let res: RouteItem | null = null
  for (let i of routes) {
    if (i.name === name) {
      res = i
      break
    }
    if (i.children?.length) {
      res = getCurrentNamedRoute(i.children, { name })
      if (res) {
        break
      }
    }
  }
  return res
}

/**
 * 设置路由,及其父亲为current
 * @param route
 * @param isCurrent
 * @returns
 */
export function setRouteCurrent(route: RouteItem, isCurrent: boolean) {
  if (!route) {
    return
  }
  route.isCurrent = isCurrent
  if (route.parent) {
    setRouteCurrent(route.parent, isCurrent)
  }
}
