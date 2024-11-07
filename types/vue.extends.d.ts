import "vue/types/vue"
import { EventEmitter } from "@/utils/eventmitter"
import eventBus, { E2TopEvent, EMyBlogMainScrollEvent } from "@/eventBus"

declare module "vue/types/vue" {
  interface Vue {
    $eventBus: typeof eventBus
  }
}
