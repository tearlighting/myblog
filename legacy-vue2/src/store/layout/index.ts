import { createVuexStore } from "@/utils"

export const layoutStore = createVuexStore({
  namespaced: true,
  state: {
    /**
     * route-view距离client的距离
     */
    view2Top: 0,
    showTags: true,
    showNavBar: true,
  },
  mutations: {
    setView2Top(state, payload: number) {
      state.view2Top = payload
    },
  },
  getters: {
    view2Top: ({ view2Top }) => view2Top,
  },
})
