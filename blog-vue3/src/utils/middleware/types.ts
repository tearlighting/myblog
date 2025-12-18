export type FlowMiddleWareCallback<T> = (ctx: T, next: () => Promise<void>) => Promise<void> | void

export type TransformMiddleWareCallback<I, R = I> = (ctx: I) => Promise<R>