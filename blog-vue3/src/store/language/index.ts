import { languageManager } from "@/core"
import { defineStore } from "pinia"
import { ref } from "vue"
import pinia from "../store"



export const useLanguageStore = defineStore("language", () => {
  const currentLocale = ref(languageManager.currentLocale)
  const languages = ref(languageManager.languages)
  return {
    currentLocale,
    languages,
  }
})

export const useLanguageStoreHooks = () => useLanguageStore(pinia)
