import Vue from "vue"
import Vuex from "vuex"
import { themeStore } from "./theme"
import { menuStore } from "./menu"
import { routeStore } from "./route"
import { pemissionStore } from "./pemission"
import tagView from "./tagView"
import { layoutStore } from "./layout"
import { userStore } from "./user"

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    pemissionStore,
    routeStore,
    themeStore,
    menuStore,
    tagView,
    layoutStore,
    userStore,
  },
  //   strict: true,
})
