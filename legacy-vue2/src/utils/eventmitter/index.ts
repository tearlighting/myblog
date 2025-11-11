interface IHandlerCache {
  once: boolean
  func: (...arg: any) => any
}
export class EventEmitter<T extends string = string> {
  private _cache: Record<T, IHandlerCache[]> = {} as any
  on(event: T, handler: IHandlerCache["func"]) {
    this.addCache(event, handler)
  }

  private addCache(event: T, func: IHandlerCache["func"], once = false) {
    this._cache[event] = this._cache[event] || []
    this._cache[event].push({ func, once })
  }

  once(event: T, handler: IHandlerCache["func"]) {
    this.addCache(event, handler, true)
  }
  emit(event: T, ...arg: any[]) {
    const handlers = this._cache[event] || []
    if (!handlers.length) return
    const onceList: number[] = []
    //  const promiseList:number[] = []
    handlers.forEach(({ once, func }, i) => {
      // const res =
      func(...arg)
      once && onceList.push(i)
      // if(res.then && res.then instanceof Function){
      //     promiseList.push(i)
      // }
    })

    onceList.forEach((i) => {
      handlers.splice(i, 1)
    })
  }

  off(func: IHandlerCache["func"]): void
  off(event: T): void
  off(target: IHandlerCache["func"] | T) {
    if (typeof target === "string") {
      this._cache[target] && Reflect.deleteProperty(this._cache, target)
    } else {
      let index: number = null
      const funcs = (Object.values(this._cache) as IHandlerCache[][]).find((arr: IHandlerCache[]) => {
        index = arr.map((v) => v.func).indexOf(target)
        return index >= 0
      }) as IHandlerCache[]
      funcs && funcs.length && funcs.splice(index, 1)
    }
  }
  offAll() {
    this._cache = {} as any
  }
}
