import { Module } from "vuex"
import router, { routes } from "@/router"
import { IRouteItem } from "@/components/Aside/menu/types"
import { RouteConfig, RouteMeta } from "vue-router"
import { EPemission, pemissionStore } from "../pemission"
import { TIcon } from "@/components/icon"
import store from ".."
import { createVuexStore } from "@/utils/vuex"

import { getCurrentRoutesByRoutes, RouteItem } from "./getDisplayRouteTree"
import { getCurrentNamedRoute, setRouteCurrent } from "./getCurrentNamedRoute"
import { nextTick } from "vue"

export const routeStore: Module<any, any> = createVuexStore({
  namespaced: true,
  state: {
    currentRoutes: [] as RouteItem[],
    currentRoute: null as RouteItem | null,
  },
  mutations: {
    setCrrentRoutes(store, payload: RouteItem[]) {
      store.currentRoutes = payload
    },
    setCurrentRoute(store, payload) {
      store.currentRoute = payload
    },
  },
  actions: {
    initRoutes({ commit, dispatch }) {
      commit("setCrrentRoutes", getCurrentRoutesByRoutes(routes))
      //   dispatch("changeRoute", { name: "homeIndex" })
    },
    changeRoute({ commit, state: { currentRoutes, currentRoute: oldCurrentRoute } }, { name }: { name: string }) {
      const newCurrentRoute = getCurrentNamedRoute(currentRoutes, { name })
      //   console.log(oldCurrentRoute)

      oldCurrentRoute && setRouteCurrent(oldCurrentRoute!, false)
      setRouteCurrent(newCurrentRoute!, true)
      commit("setCurrentRoute", newCurrentRoute)
    },
  },
  getters: {
    currentRoutes: ({ currentRoutes }) => currentRoutes,
    currentRoute: ({ currentRoute }) => currentRoute,
  },
})
