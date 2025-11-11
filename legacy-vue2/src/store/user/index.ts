import { LoginApi } from "@/api"
import { createVuexStore } from "@/utils"
import { ILoginProps, IUser } from "login"
// import store from ".."
import router from "@/router"
import { EPemission } from "../pemission"
import { clearAuthorization } from "@/hooks/useAuthorization"
export enum ELoginStatus {
  logining = "logining",
  unlogin = "unlogin",
  logined = "logined",
}

export const userStore = createVuexStore({
  namespaced: true,
  state: {
    user: {
      name: "visitor",
      loginId: null,
      role: EPemission.visitor,
    } as IUser,
    loginStatus: ELoginStatus.unlogin,
  },
  //会记录操作,可以追踪复原,所以数据的操作都放在mutation里面,mutations不能有副作用
  mutations: {
    setUser(state, { name, loginId, role }: IUser) {
      state.user = {
        name,
        loginId,
        role,
      }
    },
    setLoginStatus(state, payload: ELoginStatus) {
      state.loginStatus = payload
    },
  },
  actions: {
    async login({ commit, state: { loginStatus } }, { username, password, captcha }: ILoginProps) {
      const store = await import("..").then((v) => v.default)
      if (loginStatus === ELoginStatus.logined || loginStatus === ELoginStatus.logining) {
        return
      }
      commit("setLoginStatus", ELoginStatus.logining)
      const res = await LoginApi.login({ username, password, captcha })
      if (res && res.data?.name) {
        commit("setUser", res.data)
        store.commit("pemissionStore/setRole", res.data.role)
        commit("setLoginStatus", ELoginStatus.logined)
        store.dispatch("routeStore/initRoutes")
        store.dispatch("tagView/initTags")
        // console.log(store.getters);
      } else {
        commit("setLoginStatus", ELoginStatus.unlogin)
        store.dispatch("tagView/initTags")
        throw new Error("login failed")
      }
    },
    async logout({ commit }) {
      clearAuthorization()
      commit("setUser", {
        name: "visitor",
        loginId: null,
        role: EPemission.visitor,
      })
      commit("setLoginStatus", ELoginStatus.unlogin)
      const store = await import("..").then((v) => v.default)

      store.commit("pemissionStore/setRole", EPemission.visitor)
      store.dispatch("routeStore/initRoutes")
      store.dispatch("tagView/initTags")

      console.log(store.getters)

      router.push({
        name: "login",
      })
    },
    async whoAmI({ commit }) {
      commit("setLoginStatus", ELoginStatus.logining)

      const store = await import("..").then((v) => v.default)

      LoginApi.whoAmI()
        .then(({ data: v }) => {
          // const {data:v} = res
          if (v?.name) {
            commit("setUser", v)
            commit("setLoginStatus", ELoginStatus.logined)
            store.commit("pemissionStore/setRole", v.role)
          } else {
            commit("setLoginStatus", ELoginStatus.unlogin)
          }
        })
        .catch((e) => {
          //   console.log(e)
          commit("setLoginStatus", ELoginStatus.unlogin)
        })
        .finally(() => {
          //   console.log(store.getters)

          store.dispatch("routeStore/initRoutes")
          store.dispatch("tagView/initTags")
        })
    },
  },
  getters: {
    user: (state) => state.user,
    loginStatus: (state) => state.loginStatus,
    isLogin: (state) => state.loginStatus === ELoginStatus.logining,
  },
})
