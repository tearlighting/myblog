import { TTheme } from "@/store/theme"

declare global {
  namespace MySite {
    export { TTheme }
  }
  interface IResponse<T> {
    data: T
    code: number
    msg: string
  }
}


