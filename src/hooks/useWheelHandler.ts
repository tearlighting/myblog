interface IWheelHandlerParam {
  event: WheelEvent
  /**
   * 滚轮移动多少算移动事件默认5
   */
  deltaY?: number
}

export enum EWheel {
  isWheeling = "isWheeling",
  wheelDown = "wheelDown",
  wheelUp = "wheelUp",
}
export default function () {
  let isWheeling = false
  const actions: Record<EWheel, Array<() => any>> = {
    [EWheel.isWheeling]: [],
    [EWheel.wheelDown]: [],
    [EWheel.wheelUp]: [],
  }
  function wheelHandler({ event, deltaY = 10 }: IWheelHandlerParam) {
    if (isWheeling) {
      actions[EWheel.isWheeling].forEach((f) => f())
      return
    }
    // console.log(isWheeling)

    if (Math.abs(event.deltaY) >= deltaY) {
      isWheeling = true

      if (event.deltaY > 0) {
        //向下移动
        actions[EWheel.wheelDown].forEach((f) => f())
        // console.log(EWheel.wheelDown)
      } else {
        //向上移动
        actions[EWheel.wheelUp].forEach((f) => f())
      }
    }
    // console.log(isWheeling)
  }

  function onIswheeling(fun: () => any) {
    actions[EWheel.isWheeling].push(fun)
  }

  function onWheelDown(func: () => any) {
    actions[EWheel.wheelDown].push(func)
  }
  function onWheelUp(func: () => any) {
    actions[EWheel.wheelUp].push(func)
  }
  /**
   * 不能确定传callback执行完,就是整个逻辑结束，就手动来告诉可以开始处理新的了
   */
  function wheelOver() {
    isWheeling = false
  }

  return { wheelHandler, wheelOver, onIswheeling, onWheelDown, onWheelUp }
}
