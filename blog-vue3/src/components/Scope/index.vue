<script setup lang="ts">
/**
 * 其实本来是想写成一个页面级组件的。但是实践下了有两个问题。
 * 一是我不想管这个逻辑,直接扔route配置里面去。这个想法非常好，但是你会发现，你作用域插槽直接死了，你又取不到。
 * 那要的话又又又要搞一个全局的东西存，或者学React的createContext搞一个特殊的key,然后useContext用开要开始了，而且你又把store给揉在一起，
 * 你要判断，应该加载哪个数据，放行哪个，这也写复杂度完全降不下来。
 *
 * 二是直接写在PageLoader外面，你组件级是没有任何问题啊。但是路由的卸载，你是逃不掉路由的生命周期，甚至说他们根本不是共用的。所以肯定达不到你要跨页面
 * 管理stores的效果。
 *
 * 那既然这样，还不如每一个store自己确定自己的clean up的时机，然后挂再layout里面，vue又不是会rerender执行函数体的，你直接执行也行，
 * 你写成一个<Logic :hook="cleanup" />也行，反正你随意吧。
 * */
import { onUnmounted } from "vue"

type Disposer = () => void

const disposers = new Set<Disposer>()

const registerDispose = (d: Disposer) => {
  disposers.add(d)
  return () => disposers.delete(d) // 支持取消注册（可选）
}

defineSlots<{
  default: (payload: { registerDispose: typeof registerDispose }) => any
}>()

onUnmounted(() => {
  for (const d of disposers) d()
  disposers.clear()
})
</script>

<template>
  <slot :registerDispose="registerDispose" />
</template>
