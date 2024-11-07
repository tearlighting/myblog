import { i18n } from "@/plugins/i18n"
import { watchEffect } from "vue"

export function useChangeLanguage() {
  function changeLanguage<T extends TLanguages>(lang: T) {
    i18n.locale = lang
  }
  return {
    changeLanguage,
  }
}

const { changeLanguage } = useChangeLanguage()
export { changeLanguage }
