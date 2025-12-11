import { themeManager } from "@/core"
import { defineStore } from "pinia"
import { ref } from "vue"
import pinia from "../store"


export const useThemeStore = defineStore("theme", () => {
  const currentTheme = ref(themeManager.current)
  const themes = ref(themeManager.themes)
  const setTheme = (theme: Parameters<typeof themeManager.setTheme>[0]) => {
    themeManager.setTheme(theme)
    currentTheme.value = theme
  }
  return {
    currentTheme,
    themes,
    setTheme,
  }
})

export const useThemeStoreHook = () => useThemeStore(pinia)
