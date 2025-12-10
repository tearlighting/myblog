import { auroraPalette, cyberPalette, monoPalette, sakuraPalette, sunsetPalette } from "@/constants"
import { createThemeManager } from "@/utils"
import { defineStore } from "pinia"
import { ref } from "vue"
import pinia from "../store"

export const themeManager = createThemeManager()
  .register({
    value: "aurora",
    palette: auroraPalette,
    labelKey: "theme.aurora",
  })
  .register({
    value: "sakura",
    palette: sakuraPalette,
    labelKey: "theme.sakura",
  }).register({
    value: "cyber",
    palette: cyberPalette,
    labelKey: "theme.cyber",
  }).register({
    value: "sunset",
    palette: sunsetPalette,
    labelKey: "theme.sunset",
  })
  .register({
    value: "mono",
    palette: monoPalette,
    labelKey: "theme.mono",
  })


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
