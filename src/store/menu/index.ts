import { Module } from "vuex"

interface IMenuControl {
  /**
   * 是否显示 已经打开的tags
   */
  showTags: boolean
  /**
   * 页面菜单是否展开
   */
  showMenu: boolean
  /**
   * 在没在全屏
   */
  fullScreen: boolean
}

export const menuStore: Module<any, any> = {
  namespaced: true,
  state: {
    menuControl: {
      showTags: true,
      showMenu: true,
      fullScreen: false,
    } as IMenuControl,
  },
  mutations: {
    setShowTags({ menuControl }, payload: IMenuControl["showTags"]) {
      menuControl.showTags = payload
    },
    setShowMenu({ menuControl }, payload: IMenuControl["showMenu"]) {
      menuControl.showMenu = payload
    },
    setFullScreen({ menuControl }, payload: IMenuControl["fullScreen"]) {
      menuControl.fullScreen = payload
    },
  },
  actions: {
    openMenu({ commit, getters: { showMenu } }) {
      !showMenu && commit("setShowMenu", true)
    },
    closeMenu({ commit, getters: { showMenu } }) {
      showMenu && commit("setShowMenu", false)
    },
  },
  getters: {
    showtags: ({ menuControl: { showTags } }) => showTags,
    showMenu: ({ menuControl: { showMenu } }) => showMenu,
    fullScreen: ({ menuControl: { fullScreen } }) => fullScreen,
  },
}
