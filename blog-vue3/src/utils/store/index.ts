export const createHookStore = <T>(hook: () => T) => {
  const closure = hook()
  return () => closure
}

export const withMergeDispose = <T extends Record<string, IDisposableStore<any> | IDisposableStore<never>>>(stores: T) => {
  type AllVoid = TAllVoid<T>
  const init = ((payload?: TInitParamsIntersection<T>) => {
    Object.values(stores).forEach(store => store.init(payload))
  }) as AllVoid extends true
    ? () => void
    : (payload: TInitParamsIntersection<T>) => void
  const dispose = () => {
    Object.values(stores).forEach(store => store.dispose())
  }
  return { init, dispose, ...stores }
}





