import VueI18n from "vue-i18n"
import Vue from "vue"
Vue.use(VueI18n)
export enum ELanguageType {
  zh = "中文",
  en = "English",
  jp = "日本語",
}

export type TLanguage = keyof typeof ELanguageType

interface IMenuSetting {
  home: string
  blog: string
  about: string
  project: string
  message: string
  hobby: string
}

interface ISettings {
  menu: IMenuSetting
}

const message: Record<TLanguage, ISettings> = {
  zh: {
    menu: {
      home: "首页",
      blog: "文章",
      about: "关于我",
      project: "项目&效果",
      message: "信息",
      hobby: "兴趣",
    },
  },
  en: {
    menu: {
      home: "home",
      blog: "blog",
      about: "about",
      project: "project&effect",
      message: "message",
      hobby: "hobby",
    },
  },
  jp: {
    menu: {
      home: "ホーム",
      blog: "文章",
      about: "私にて",
      project: "プロジェクト&効果",
      message: "メッセージ",
      hobby: "趣味",
    },
  },
}

export const i18n = new VueI18n({
  locale: "jp",
  messages: message as any,
})
