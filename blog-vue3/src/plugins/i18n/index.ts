
import { languageManager } from "@/core"
import type { IAddPlugin } from "plugin"

export const add18n: IAddPlugin = (app) => {
  languageManager.managerIns.install(app)
}
