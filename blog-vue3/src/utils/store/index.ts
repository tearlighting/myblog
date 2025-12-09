import { reactive } from "vue"

export const createHookStore = <T>(hook: () => T) => {
  const closure = hook()
  return () => closure
}

export const withMergeDispose = <T extends Record<string, IDisposableStore<any> | IDisposableStore<never>>>(stores: T) => {
  type AllVoid = TAllVoid<T>
  const init = ((payload?: TInitParamsIntersection<T>) => {
    Object.values(stores).forEach((store) => store.init(payload))
  }) as AllVoid extends true ? () => void : (payload: TInitParamsIntersection<T>) => void
  const dispose = () => {
    Object.values(stores).forEach((store) => store.dispose())
  }
  return { init, dispose, ...stores }
}

export const withInitialized = <T extends { init: (...args: any[]) => void; dispose: () => void }>(store: T) => {
  const { init, dispose, ...res } = store
  const initialized = reactive({ current: false })
  const initWrapper: T["init"] = (...args: Parameters<typeof init>) => {
    if (initialized.current) return
    ;(init as any)(...args)
    initialized.current = true
  }
  const disposeWrapper = () => {
    if (!initialized.current) return
    dispose()
    initialized.current = false
  }
  return { init: initWrapper, dispose: disposeWrapper, initialized, ...res }
}
