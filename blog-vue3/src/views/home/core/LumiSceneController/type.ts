import type { ILumiModule } from "../LumiModules/type"

/**
 * LumiEngine 的核心 orchestrator。
 * 负责把 Input → Module → Render 整合在一起。
 */
export interface ILumiSceneController {
    registerModule(module: ILumiModule): this
    start(): void
    stop(): void
}
