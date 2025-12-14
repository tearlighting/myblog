import type { VirtualScrollData } from "lenis"

/**
 * LumiEngine 的标准模块接口。
 * 任何模块都可以选择性实现这些方法。
 */
export interface ILumiModule {
  onScroll?(payload: VirtualScrollData): void
  onHover?(p: { nx: number; ny: number }): void
  destroy?(): void
}
