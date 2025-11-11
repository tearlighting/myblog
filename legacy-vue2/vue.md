1. front end history

后端渲染(所有页面信息都是后端拼出来的,前端只有静态页面)=>前后端分离(js 控制渲染,后端提供 API)=>单页应用(像客户端应用一样,不会刷新跳转)=>框架(vue,rect)=>SSR

# 原理：

好好看看 MVVM 原理，生命周期
现在个感觉是
beforeCreate
Proxy data,可以知道哪些数据改变
created
el?
解析 template/render => generate vnode 建立 data 与 vnode 的联系(我学习的使用 Map,当然 diff 算法是个啥,之后再说)
beforemout
替换 el
mounted

# 组件

1. 为什么要用
   data(){
   return {}
   }
   确保组件数据的独立性
2. style scoped
   .avatar-img[data-v-1185aaa8]
   每个组件都会生成一个 unique 属性,通过属性选择器&,实现 css 模块化
   此外父组件可以设置到子组件的根元素

```html
<div data-v-a83bd3b0 class="app-container">
  <!-- 子组件的根元素上会有一个和父组件一模一样的属性 data-v-a83bd3b0-->
  <i data-v-69a58868 data-v-a83bd3b0 class="iconfont iconzhengque"></i>
</div>
```

3. 不能使用 template 属性
   You are using the runtime-only build of Vue where the template compiler is not available
   打包时 webpack 会将 SFC(single file component .vue)文件中的<template></template>编译成 render(){},
   为了减少编译后的体积，vue 的模板编译系统也没有被打包

# computed

1. computed and method
   coputed 是一个数据,可以通过 get,set 来获取/修改
   method 是方法,是一个操作
   调用 getter 的时候，vue 会收集计算属性的依赖(响应式数据/inject 的数据),并缓存结果。只有当依赖变化才会重新计算。

# v-if & v-show

v-if 没有虚拟节点=>没有 dom
v-show display：none
render 的效率取决于 vnode 的数量与稳定性,这两者是正好互斥。所以没有好不好之分。
所以，频繁变化的用 v-show
不频繁变化的用 v-if

# route

## 模式

1. hash 所谓的锚链接 也就是 location.hash 的值,本身就可以实现无刷新跳转。
   **优点:兼容性强。缺点:这种 url 太不人性化 ,前面是什么它完全不在意 http://localhost:8080/aaaaaaaaaaaaaa#/blog**

   ```ts
   //直接在控制台试试
   location.hash = "#/blog"
   ```

2. history 使用 html5 的 history API。要求浏览器支持 history API

```ts
history.pushState(null, "", "/blog")
```

3. abstract 非浏览器环境。从内存中获取路径

## route-link

会根据不同的模式生成不同的路径，里面本质就是 a 元素，但是会阻止页面的跳转刷新

rout-link 本身会根据当前路径去匹配是否是当前路由
router-link-active
router-link-exact-active
会为匹配成功的加上类

## 命名路由

有时候路径会变，但含义逻辑都没有变，这时候使用命名路由，可以解除路径与组件间的耦合

```ts
:to="{name:'home'}"
```

# 虚拟 DOM

## 虚拟 dom 只是一种思想,将数据与 dom 操作解耦,他们依赖一个抽象的虚拟 dom。js 中的虚拟 dom 对象只是一种实现方式而已。

## 快在哪

其实直接操作 dom 的样式之类的效率挺高的，但是太烦了，所以一般都会用 innerHTML，这时候就会产生极大地浪费。
一开始初始化渲染，虚拟 dom 和普通方式没有什么区别，但虚拟 dom 树更新 dom 的效率高

## 响应式的本质

设计模式中的观察者模式模式。本质就是依赖收集和派发更新。
依赖收集需要响应式数据和特定的函数,当然，内部都是运行 Effect 函数来收集依赖，依赖对应的那些函数
当执行 set,delete,add 之后,就会找之前的 Effect 里面的函数,重新执行（当然不一定是执行那个函数，可以指定新的函数，重要的是派发更新）

```ts
effect(
  //执行收集依赖,运行前会清掉此函数的所有依赖重来
  () => {
    state.a
    state.b
    console.log("收集依赖")
  },
  {
    //指定新的函数,当然,不执行默认的函数，肯定是不会更新依赖的
    callback() {
      console.log("变化了")
    },
  }
)
state.a = 2
state.b = 1
```

## diff

首先 render 里面用了 effect，所以数据变了会派发更新，生成新的新的虚拟 dom,这也就是 vue 的更新是组件级别。如果原来就有虚拟 dom 树,就会用到 patch 函数比较。
使用深度优先遍历，每一层都会用头指针和尾指针互相比较是不是同一个 el(tafg,key),是的话直接当新的 vnode 节点关联真实 dom，修改样式内容，移动位置。找不到才会创建节点（最小量更新），多余的删除

## slot

插槽的本质就是返回虚拟 dom 的函数,毕竟页面本来就是通过 render 函数生成的虚拟 dom 渲染出来的

```ts
const slot = {
  default() {
    return vnode
  },
  //其他具名插槽

  //作用域slot
  xxx: function (scope) {},
}
```
