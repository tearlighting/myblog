import { createVuexStore } from "@/utils/vuex"
import { Module } from "vuex"

export enum EPemission {
  user = "user",
  admin = "admin",
  visitor = "visitor",
}

export const pemissionStore = createVuexStore({
  namespaced: true,
  state: {
    role: EPemission.visitor,
  },
  mutations: {
    setRole(state, payload: EPemission) {
      state.role = payload
    },
  },
  getters: {
    role: ({ role }) => role,
  },
})
// : Module<typeof pemissionStore.state,null> = {
//   namespaced: true,
//   state: {
//     role: EPemission.user,
//   },
//   mutations:{
// 	setRole(state,payload:EPemission){
// 		state
// 	}
//   }
// }
