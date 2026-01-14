export class PageLoaderBuilder<Payload = any, IntialProps = any> {
  public initializer: null | ((props: Payload) => IntialProps) = null
  public payload: Payload | null = null
  constructor(public useStore: () => IDisposableStore<IntialProps>) { }
  defineInitializer<NewPayload>(initializer: (props: NewPayload) => IntialProps | Promise<IntialProps>): PageLoaderBuilder<NewPayload, IntialProps> {
    this.initializer = initializer as any
    return this as any
  }
  definePayload(payload: Payload): PageLoaderBuilder<Payload, IntialProps> {
    this.payload = payload
    return this as any
  }

  build() {
    if (!this.initializer) throw new Error("initializer is required")
    if (!this.payload && this.initializer.length) throw new Error("initializer requires payload")
    return {
      useStore: this.useStore,
      initializer: this.initializer,
      payload: this.payload,
    }
  }
}

export const definePageLoader = <IntialProps = any>(useStore: () => IDisposableStore<IntialProps>) => {
  return new PageLoaderBuilder<unknown, IntialProps>(useStore)
}
