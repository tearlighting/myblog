import { ref } from "vue"
import { Module } from "vuex"
// import store from ".."

enum ETheme {
  light = "light",
  dark = "dark",
}

export type TTheme = keyof typeof ETheme

export const themeStore: Module<any, any> = {
  namespaced: true,
  state: {
    currentTheme: ETheme.light,
  },
  mutations: {
    setTheme(state, payload: TTheme) {
      state.currentTheme = payload
    },
  },
  actions: {
    changeTheme({ commit }, theme: TTheme = "light") {
      document.documentElement.className = theme
      commit("setTheme", theme)
    },
  },
  getters: {
    theme(state) {
      return state.currentTheme
    },
    allTheme() {
      return ETheme
    },
  },
}
// store.registerModule("themeStore", themeStore)
