interface IDisposableStore<TPayload = never> {
  init: [TPayload] extends [never]
  ? () => void
  : (payload: TPayload) => void
  dispose(): void
}
type TInitParamsIntersection<T extends Record<string, IDisposableStore<any> | IDisposableStore<never>>> =
  UnionToIntersection<
    TStoreInitProps<T[keyof T]>
  >


type TAllVoid<T> =
  TStoreInitProps<T[keyof T]> extends void ? true : false

type TStoreInitProps<T extends IDisposableStore> = T extends IDisposableStore<infer P> ? P : never


type TStoreInitializer<TStore extends { init: (...args: any[]) => void }, TParams = {}, TReturn = Parameters<TStore["init"]>[0]> = (payload: TParams) => TReturn | Promise<TReturn>

