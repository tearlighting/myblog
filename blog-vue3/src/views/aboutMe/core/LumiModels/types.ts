import type { VirtualScrollData } from "lenis"

export interface ILumiModule {
    onScroll?(payload: VirtualScrollData): void
    destroy?(): void
}