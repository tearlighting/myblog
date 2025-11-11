import router from "@/router"
import { createVuexStore } from "@/utils/vuex"
import type { Route } from "vue-router"
import store from ".."

export default createVuexStore({
  namespaced: true,
  state: {
    cacheTagViews: [] as Route[],
    currentView: {} as Route,
  },
  mutations: {
    setCurrentTag(state, payload: Route) {
      state.currentView = payload
      //   console.log(state.currentView)
    },
    addTag(state, payload: Route) {
      //   console.log(payload)

      state.cacheTagViews.push(payload)
    },
    deleteTag(state, payload: Route) {
      state.cacheTagViews.splice(
        state.cacheTagViews.findIndex((x) => x.name === payload.name),
        1
      )
    },
    initTags({ cacheTagViews }) {
      cacheTagViews.length && cacheTagViews.splice(0, cacheTagViews.length)
      cacheTagViews.push(...(store.getters["routeStore/currentRoutes"] as any[]).filter((x) => x.name === "homeIndex"))
    },
  },
  actions: {
    changeCurrent({ commit, state: { currentView, cacheTagViews } }, route: Route) {
      if (currentView?.name === route.name) {
        return
      }
      commit("setCurrentTag", route)
      if (cacheTagViews.some((x) => x.name === route.name)) {
        return
      }
      commit("addTag", route)
    },
    delete({ commit, state: { cacheTagViews, currentView } }, payload: Route) {
      if (currentView.name === payload.name) {
        commit("deleteTag", payload)
        const lastRoute = cacheTagViews[cacheTagViews.length - 1]
        commit("setCurrentTag", lastRoute)
        router.push(lastRoute)
      } else {
        commit("deleteTag", payload)
      }
    },
    initTags({ commit }) {
      commit("initTags")
    },
  },
  getters: {
    currentTag: ({ currentView }) => currentView,
    allTags: ({ cacheTagViews }) => cacheTagViews,
    keepAliveTags: ({ cacheTagViews }) => cacheTagViews.filter((x) => x?.meta?.keepAlive),
  },
})
