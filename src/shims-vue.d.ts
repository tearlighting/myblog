declare module "*.vue" {
  import Vue from "vue"
  export default Vue
}

declare module "*.less" {
  type TLess = Record<string, string>
  declare const lessRes: TLess
  export default lessRes
}

