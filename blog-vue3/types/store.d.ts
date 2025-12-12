interface IDisposableStore<TPayload = never> {
  init: [TPayload] extends [never]
  ? () => void
  : (payload: TPayload) => void
  dispose(): void
}
type TInitParamsIntersection<T extends Record<string, IDisposableStore<any> | IDisposableStore<never>>> =
  UnionToIntersection<
    TInitProps<T[keyof T]>
  >


type TAllVoid<T> =
  TInitProps<T[keyof T]> extends void ? true : false

type TInitProps<T extends IDisposableStore> = T extends IDisposableStore<infer P> ? P : never

