import useLoading from "@/hooks/useLoading"
import type { ObjectDirective, Directive, FunctionDirective } from "vue"

// function createloadingElement(){
//     document.createElement('')
// }

const loadingMap = new WeakMap<HTMLElement, ReturnType<typeof useLoading>>()
const { mount, showLoading, hiddenLoading, destory, isMounted } = useLoading()
export const loading: ObjectDirective<HTMLElement> = {
  //绑定到元素时执行,只执行一次
  bind(el, binding) {
    //创建一个加载的元素放到el里面

    if (!loadingMap.has(el)) {
      const hooks = useLoading()
      loadingMap.set(el, hooks)
      hooks.mount({ element: el })
    }
    if (binding.value) {
      loadingMap.get(el).showLoading()
    }
  },
  //插入父节点
  inserted() {},
  //vnode更新时
  update(el, binding) {
    //数据更新后判断是否还有显示加载
    // console.log(binding, isMounted())
    const hooks = loadingMap.get(el)
    if (binding.value) {
      hooks.showLoading()
    } else {
      hooks.hiddenLoading()
    }
  },
  //自己和子节点全部更新后调用
  componentUpdated() {},
  //解绑,只执行一次
  unbind() {},
}

/**
 * 这就相当于
 * {
 *    binding(){
 *    }
 *    update(){
 * }
 *
 * }
 * @param el
 * @param binding
 */
const loadingFunction: FunctionDirective = (el, binding) => {}
