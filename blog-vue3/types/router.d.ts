import type { EIcons } from "@/constants/icons"
import type { en } from "@/locale"
import { EPemission } from "@/store/pemission"
import { NestedKeys } from "language"
import { NavigationGuardWithThis, RouteRecordRaw } from "vue-router"

type BaseMeta = {
  keepAlive?: boolean
  roles: EPemission[]
  icon?: EIcons
  externalLink?: string
}

type TI18nSetting = { title: string; titleKey?: never } | { title?: never; titleKey: NestedKeys<typeof en> }

type TRouteHidden = { hidden: true }

export type TRouteShow = { hidden?: false } & TI18nSetting

export type StrictMeta = BaseMeta & (TRouteHidden | TRouteShow)

export type AppRoute = Omit<RouteRecordRaw, "meta" | "children"> & {
  /**
   * 路由元信息
   */
  meta: StrictMeta
  children?: AppRoute[]
}

export interface IRouteGuarder {
  (routerPayload: Parameters<NavigationGuardWithThis<any>>, next: () => Promise<void>): void | Promise<void>
}
