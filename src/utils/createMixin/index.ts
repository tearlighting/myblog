import { ComponentOptionsMixin } from "vue"

export function createMixin<T extends ComponentOptionsMixin>(data: T): T {
  return data
}
