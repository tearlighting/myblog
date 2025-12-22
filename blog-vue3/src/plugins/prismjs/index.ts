import type { IAddPlugin } from "plugin"

import "prismjs"
import "prismjs/components/prism-clike"
import "prismjs/components/prism-javascript"

// 你现在缺的
import "prismjs/components/prism-typescript"

// 可选（以后一定会用到）
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"

import "prismjs/themes/prism-tomorrow.css"
// 或 prism-okaidia.css

export const addPrism: IAddPlugin = () => {
  //   import("prismjs/themes/prism-tomorrow.css")
}
