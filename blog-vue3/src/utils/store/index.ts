import { reactive } from "vue"

export const createHookStore = <T>(hook: () => T) => {
  const closure = hook()
  return () => closure
}


export const withMergeDispose = <T extends Record<string, IDisposableStore<any> | IDisposableStore<never>>, AllVoid = TAllVoid<T>>(stores: T) => {

  const initialized = reactive({
    current: false
  })
  const init = ((payload?: TInitParamsIntersection<T>) => {
    if (initialized.current) return
    initialized.current = true
    Object.values(stores).forEach(store => store.init(payload))
  }) as AllVoid extends true
    ? () => void
    : (payload: TInitParamsIntersection<T>) => void
  const dispose = () => {
    if (!initialized.current) return
    initialized.current = false
    Object.values(stores).forEach(store => store.dispose())
  }
  return { init, dispose, initialized, ...stores }
}


