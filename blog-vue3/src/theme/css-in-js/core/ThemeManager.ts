import { generateTheme } from "@/utils"
import type { IThemeManager, Palette, ThemeVars } from "theme"

export class ThemeManager<ThemeName extends string = string> implements IThemeManager<ThemeName> {
  private _themes: Record<ThemeName, ThemeVars> = {} as any
  private _current: ThemeName | null = null
  constructor(private _rootEl: HTMLElement = document.documentElement) {}

  getTheme(): ThemeVars {
    return this._themes[this._current!]
  }
  get current(): ThemeName {
    return this._current!
  }
  private applyTheme(vars: Record<string, string>) {
    Object.entries(vars).forEach(([k, v]) => {
      this._rootEl.style.setProperty(k, v)
    })
  }
  setTheme(name: ThemeName): void {
    if (!this._themes[name]) throw new Error(`Unknown theme: ${name}`)
    this._current = name
    this.applyTheme(this._themes[name])
  }
  register<T extends string>(name: T, palette: Palette) {
    const theme = generateTheme(palette)
    const that = this as ThemeManager<ThemeName | T>
    that._themes[name] = theme
    if (!this._current) {
      that._current = name
      that.applyTheme(theme)
    }
    return that
  }
  createLocal(overrides: Partial<ThemeVars>): ThemeVars {
    return { ...this.getTheme(), ...overrides } as ThemeVars
  }

  exportTheme(): string {
    return JSON.stringify(this.getTheme(), null, 2)
  }

  importTheme(vars: ThemeVars): void {
    this._themes[this._current!] = vars
  }
}

export const createThemeManager = (rootEl: HTMLElement = document.documentElement) => new ThemeManager(rootEl)
