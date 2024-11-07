import Vue from "vue"
import { VueConstructor, Component } from "vue/types/umd"
/**
 * 获取vue组件渲染的真实dom
 * @param component
 * @returns
 */
export function getVueComponentEl<T extends VueConstructor>(component: T, props: any) {
  //   console.log(props)

  const vm = new Vue({
    render: (h) => h(component, { props }),
  })
  return vm.$mount().$el as HTMLElement
}
