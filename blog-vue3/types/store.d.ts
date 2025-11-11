interface IDisposableStore<T = never> {
  init(payload: T): void
  dispose(): void
}
