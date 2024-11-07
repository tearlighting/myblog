import { TIcon } from "@/components/icon"
import { RouteMeta } from "vue-router"

export interface IRouteItem {
  link?: string
  icon?: TIcon
  isCurrent?: boolean
  exact?: boolean
  name: string
  meta?: RouteMeta
  title?: string
}
