import { RecordPropsDefinition } from "vue/types/options"

export interface IImgLoaderProps {
  /**
   * url地址,本地的话需要require一下,需要webpack打包的时候用loader处理一下
   */
  placeholder: string
  /**
   * 目标图片Url
   * ,本地的话需要require一下,需要webpack打包的时候用loader处理一下
   */
  url: string
  /**
   * transition时间 ms
   */
  duration: number
}

// const createProps = <T>(data: RecordPropsDefinition<T>): RecordPropsDefinition<T> => {
//   return data
// }
// const props = createProps({
//   placeholder: {
//     type: String,
//     default: require(`@/assets/danmati_loading.gif`),
//   },
//   url: {
//     type: String,
//     default: "https://img1.baidu.com/it/u=878394287,117902226&fm=253&fmt=auto&app=138&f=GIF?w=600&h=337",
//   },
//   duration: {
//     type: Number,
//     default: 1500,
//   },
// })

// export default props
