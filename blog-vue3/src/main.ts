import { createApp } from "vue"
import App from "./App.vue"
import { initApp } from "./init"
import { addPlugins } from "./plugins"
import "./style/index.less"
const app = createApp(App)
addPlugins(app)
app.mount("#app")
initApp()

