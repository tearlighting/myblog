import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import "./style/index.less"
import "./plugins"
import { EPemission } from "./store/pemission"
import { registerDirective } from "@/directive"
import eventBus from "./eventBus"
import { i18n } from "./plugins/i18n"

store.dispatch("userStore/whoAmI")

store.dispatch("themeStore/changeTheme")

// store.commit("pemissionStore/setRole", EPemission.user)

registerDirective(Vue)

Vue.config.productionTip = false
Vue.prototype.$eventBus = eventBus

new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app")
