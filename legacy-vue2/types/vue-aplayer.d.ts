interface IVueAplayerMusic {
  /**
   * 音频文件的 URL
   */
  src: string
  /**
   * 歌曲名称
   */
  title?: string
  /**
   * 演唱者
   */
  artist?: string
  /**
   * 封面图片 URL
   */
  pic?: string
  /**
   * LRC 歌词或者歌词文件的 URL
   */
  lrc?: string
  /**
   * 歌曲的主题色，会覆盖播放器的主题色
   */
  theme?: string
}
declare module "vue-aplayer" {
  import { ExtendedVue } from "vue/types/vue"

  declare const Aplayer: ExtendedVue<Vue, unknown, any, any, IVueAplayerMusic>
  export default Aplayer
}
