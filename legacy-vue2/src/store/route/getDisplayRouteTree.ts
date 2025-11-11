import { IRouteItem } from "@/components/Aside/menu/types"
import { RouteConfig, RouteMeta } from "vue-router"
import store from ".."
import { EPemission } from "../pemission"

export class RouteItem implements IRouteItem {
  parent: RouteItem | null
  children?: RouteItem[]
  isCurrent = false
  name: string
  meta?: RouteMeta | undefined
  constructor({ name, meta, parent }: Partial<Pick<IRouteItem, "name" | "meta">> & { parent: RouteItem | null }) {
    this.name = name!
    this.meta = meta
    this.parent = parent
  }
}

/**
 * 分析路由,可能是第二层只有一个路由，直接显示在菜单
 * 可能第一层就是一个手风琴(通过meta.title来判断)
 */
function getDisplayRoutes(routes: RouteItem[], parent: RouteItem["parent"] = null): RouteItem[] {
  if (!Array.isArray(routes) || !routes.length) {
    return []
  }
  const res: RouteItem[] = []
  for (let route of routes) {
    //如果最上层是要在菜单显示就上树
    //再看子元素
    if (route.meta?.title) {
      const { name, meta } = route
      const displayRoute = new RouteItem({
        name,
        meta,
        parent,
      })
      res.push(displayRoute)
      if (route.children?.length) route.children = getDisplayRoutes(route.children!, displayRoute)
      //如果最上层不在菜单显示
      //寻找在菜单显示的子节点
    } else {
      res.push(...getDisplayRoutes(route.children!))
    }
  }
  return res
}
/**
 * 过滤掉非当前权限的路由
 * 不会改变父子关系,这边就不new了
 */
const filterRoutesByRole = (routes: RouteItem[]): RouteItem[] => {
  const res: RouteItem[] = []
  //   console.log(store.getters["pemissionStore/role"])

  routes.forEach((item) => {
    if (item?.meta?.roles?.length) {
      const role = store.getters["pemissionStore/role"] as unknown as EPemission

      if (item.meta.roles.includes(role)) {
        res.push(item)
        if (item.children?.length) item.children = filterRoutesByRole(item.children)
      }
    }
  })
  return res
}
/**
 * 过滤hidden的路由
 */
function filterHiddenRoutes(routes: RouteConfig[], parent: RouteItem["parent"] = null): RouteItem[] {
  const res: RouteItem[] = []
  for (let { meta, name, children } of routes) {
    if (meta?.hidden) {
      continue
    }
    const item = new RouteItem({
      name,
      meta,
      parent,
    })
    res.push(item)
    if (children?.length) {
      item.children = filterHiddenRoutes(children, item)
    }
  }

  return res
}

/**
 * 根据route里面配置的路由获取menu需要格式的路由
 */
export function getCurrentRoutesByRoutes(routes: RouteConfig[]): RouteItem[] {
  return getDisplayRoutes(filterRoutesByRole(filterHiddenRoutes(routes)))
}
