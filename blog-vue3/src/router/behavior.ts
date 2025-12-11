import { createAuthGuard, createExternalGuard, createFlowMiddleware, isLoginGuard, turn2PageGuard } from "@/utils"
import type { NavigationGuardWithThis } from "vue-router"
import router, { routes } from "."
import { createChangeRecactiveDataMiddleware } from "./changeReactiveData"

import type { IAllStoreProps } from "@/init"

/**
 * 设置路由守卫
 * @param param0
 */
export function setupRouteGuard<T extends IAllStoreProps>(stores: T) {
  const changeRecactiveDataMiddleware = createChangeRecactiveDataMiddleware(stores)
  const routerBeforeEachMiddleware = createFlowMiddleware<Parameters<NavigationGuardWithThis<any>>>()
    .use(isLoginGuard)
    .use(createAuthGuard(stores.userStore, { path: "/" }))
    .use(createExternalGuard(routes, router, { path: "/" }))
    .use((ctx, next) => {
      changeRecactiveDataMiddleware.run(ctx)
      next()
    })
    .use(turn2PageGuard)

  router.beforeEach(async (...args) => await routerBeforeEachMiddleware.run(args))
}
