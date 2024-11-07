import { ComponentOptionsMixin } from "vue"
import { highlightAll } from "prismjs"
const mixins: ComponentOptionsMixin = {
  mounted() {
    highlightAll()
  },
}

export default mixins
