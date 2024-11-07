import Vue, { computed, nextTick } from "vue"
import VueRouter, { RouteConfig, RawLocation, Route } from "vue-router"
import SiteLayout from "@/views/siteLayout/index.vue"
import { EPemission } from "@/store/pemission"
import { EIcons } from "@/components/icon"
import store from "@/store"
import { getCurrentNamedRoute } from "@/store/route/getCurrentNamedRoute"
import { ELoginStatus } from "@/store/user"
import useMessage, { EMessageType } from "@/hooks/useMessage"
import { i18n } from "@/plugins/i18n"

const { showMessage } = useMessage()

Vue.use(VueRouter)

export const routes: Array<RouteConfig> = [
  {
    path: "/waitingLogin",
    name: "waitingLogin",
    meta: {
      hidden: true,
    },
    component: () => import("@/views/waitLogin/index.vue"),
  },
  {
    path: "/",
    redirect: { name: "home" },
    meta: {
      hidden: true,
    },
  },

  {
    path: "/login",
    name: "login",
    meta: {
      hidden: true,
    },
    component: () => import("@/views/login/index.vue"),
  },
  {
    path: "/home",
    component: SiteLayout,
    name: "home",
    redirect: {
      name: "homeIndex",
    },
    meta: {
      roles: [EPemission.admin, EPemission.user, EPemission.visitor],
    },
    children: [
      {
        path: "/home",
        name: "homeIndex",
        component: () => import("@/views/home/index.vue"),
        meta: {
          title: computed(() => i18n.t("menu.home")),
          keepAlive: true,
          roles: [EPemission.admin, EPemission.user, EPemission.visitor],
          icon: "home",
        },
      },
    ],
  },

  {
    path: "/blog",
    component: SiteLayout,
    name: "blog",
    redirect: {
      name: "blogIndex",
    },
    meta: {
      roles: [EPemission.admin, EPemission.user, EPemission.visitor],
      title: computed(() => i18n.t("menu.blog")),
      icon: "blog",
      keepAlive: true,
    },
    children: [
      {
        name: "blogIndex",
        path: "",
        component: () => import("@/views/blog/index.vue"),
        meta: {
          title: computed(() => i18n.t("menu.blog")),
          keepAlive: true,
          roles: [EPemission.admin, EPemission.user, EPemission.visitor],
          icon: "blog",
          hidden: true,
        },
      },

      {
        name: "blogCategory",
        path: "category/:id",
        component: () => import("@/views/blog/index.vue"),
        meta: {
          title: computed(() => i18n.t("menu.blog")),
          keepAlive: true,
          roles: [EPemission.admin, EPemission.user, EPemission.visitor],
          icon: "blog",
          hidden: true,
        },
      },
      {
        name: "blogDetail",
        path: "detail/:id",
        component: () => import("@/components/blog/articleDetail.vue"),
        meta: {
          roles: [EPemission.admin, EPemission.user, EPemission.visitor],

          hidden: true,
          keepAlive: false,
        },
      },
    ],
  },

  {
    path: "/project",
    name: "project",
    component: SiteLayout,
    redirect: {
      name: "projectIndex",
    },
    meta: {
      roles: [EPemission.admin, EPemission.user, EPemission.visitor],
      title: computed(() => i18n.t("menu.project")),
      icon: "code",
      //   keepAlive: true,
    },
    children: [
      {
        name: "projectIndex",
        path: "/project",
        component: () => import("@/views/project/index.vue"),
        meta: {
          title: computed(() => i18n.t("menu.project")),
          keepAlive: true,
          roles: [EPemission.admin, EPemission.user, EPemission.visitor],
          icon: "code",
          hidden: true,
        },
      },
      {
        name: "projectDetail",
        path: "detail/:id",
        component: () => import("@/components/project/projectDetail.vue"),
        meta: {
          title: computed(() => i18n.t("menu.project")),
          keepAlive: true,
          roles: [EPemission.admin, EPemission.user, EPemission.visitor],
          icon: "code",
          hidden: true,
        },
      },
    ],
  },
  {
    path: "/message",
    component: SiteLayout,
    name: "message",
    meta: {
      roles: [EPemission.admin, EPemission.user, EPemission.visitor],
    },
    redirect: {
      name: "messageIndex",
    },
    children: [
      {
        name: "messageIndex",
        path: "/message",
        component: () => import("@/views/message/index.vue"),
        meta: {
          title: computed(() => i18n.t("menu.message")),
          keepAlive: true,
          roles: [EPemission.admin, EPemission.user, EPemission.visitor],
          icon: "chat",
        },
      },
    ],
  },

  {
    path: "/preview",
    component: () => import("@/views/preview.vue"),
    meta: {
      hidden: true,
    },
  },
  {
    path: "/admin",
    name: "admincansee",
    component: SiteLayout,
    meta: {
      roles: [EPemission.admin, EPemission.user],
    },
    children: [
      {
        path: "",
        name: "admincanseeIndex",
        component: () => import("@/views/adminRole/index.vue"),
        meta: {
          title: "admin",
          roles: [EPemission.admin],
          icon: "info",
        },
      },
    ],
  },
  {
    path: "/about",
    component: SiteLayout,
    name: "about",
    redirect: {
      name: "aboutIndex",
    },
    meta: {
      roles: [EPemission.admin, EPemission.user, EPemission.visitor],
    },
    children: [
      {
        path: "/about",
        name: "aboutIndex",
        component: () => import("@/views/about/index.vue"),
        meta: {
          title: computed(() => i18n.t("menu.about")),
          keepAlive: true,
          roles: [EPemission.admin, EPemission.user, EPemission.visitor],
          icon: "about",
        },
      },
    ],
  },
  {
    path: "/hobby",
    component: SiteLayout,
    name: "hobby",
    redirect: {
      name: "hobbyIndex",
    },
    meta: {
      roles: [EPemission.admin, EPemission.user, EPemission.visitor],
      title: computed(() => i18n.t("menu.hobby")),
      icon: "success",
      keepAlive: true,
    },
    children: [
      {
        path: "/hobby",
        name: "hobbyIndex",
        component: () => import("@/views/hobby/index.vue"),
        meta: {
          title: computed(() => i18n.t("menu.hobby")),
          keepAlive: true,
          roles: [EPemission.admin, EPemission.user, EPemission.visitor],
          icon: "success",
        },
      },
      {
        name: "hobbyCategory",
        path: "category/:id",
        component: () => import("@/views/hobby/index.vue"),
        meta: {
          title: computed(() => i18n.t("menu.hobby")),
          keepAlive: true,
          roles: [EPemission.admin, EPemission.user, EPemission.visitor],
          icon: "success",
          hidden: true,
        },
      },
    ],
  },
]

const router = new VueRouter({
  routes,
  // mode: "history",
})
router.beforeEach((to, from, next) => {
  //   //这是一个隐藏路由,进不去下面的判断
  //   if (to.name === "blogDetail") {
  //     if ((store.getters["tagView/allTags"] as Route[])?.filter((x) => x.name === "blog")?.length) {
  //       console.log(store.getters["tagView/allTags"], "has blog")
  //       next()
  //     } else {
  //       console.log(store.getters["tagView/allTags"])

  //       next({
  //         name: "blogIndex",
  //         params: {
  //           //   toDetail: `1`,
  //           //   detail: to.params.id,
  //           name: to.name,
  //         },
  //       })
  //       return
  //     }
  //   } else

  if (to.meta?.roles?.length) {
    const status = store.getters["userStore/loginStatus"] as ELoginStatus

    //没用获得用户信息
    if (status === ELoginStatus.logining) {
      console.log(to)

      next({
        name: "waitingLogin",
        params: {
          name: to.name,
          path: to.path,
          params: JSON.stringify(to.params),
        },
      })
    } else {
      console.log(to)
      //游客处理

      if (to.meta?.roles?.includes(EPemission.visitor)) {
        if (to.name === "blogCategory" || to.name === "blogIndex" || to.name === "blogDetail") {
          const blog = getCurrentNamedRoute(routes as any, { name: "blog" })
          store.dispatch("tagView/changeCurrent", blog)
          store.dispatch("routeStore/changeRoute", blog)
        } else if (to.name === "hobbyCategory" || to.name === "hobbyIndex") {
          const hobby = getCurrentNamedRoute(routes as any, { name: "hobby" })
          store.dispatch("tagView/changeCurrent", hobby)
          store.dispatch("routeStore/changeRoute", hobby)
        } else if (to.name === "projectIndex" || to.name === "projectDetail") {
          const project = getCurrentNamedRoute(routes as any, { name: "project" })
          store.dispatch("tagView/changeCurrent", project)
          store.dispatch("routeStore/changeRoute", project)
        } else {
          store.dispatch("tagView/changeCurrent", to)
          store.dispatch("routeStore/changeRoute", to)
        }
        next()
        return
      }
      //用户处理
      if (to.meta.roles.includes(store.getters["pemissionStore/role"])) {
        if (to.name === "blogCategory" || to.name === "blogIndex" || to.name === "blogDetail") {
          // console.log(to)
          const blog = getCurrentNamedRoute(routes as any, { name: "blog" })
          store.dispatch("tagView/changeCurrent", blog)
          store.dispatch("routeStore/changeRoute", blog)
        } else if (to.name === "hobbyCategory" || to.name === "hobbyIndex") {
          const hobby = getCurrentNamedRoute(routes as any, { name: "hobby" })
          store.dispatch("tagView/changeCurrent", hobby)
          store.dispatch("routeStore/changeRoute", hobby)
        } else if (to.name === "projectIndex" || to.name === "projectDetail") {
          const project = getCurrentNamedRoute(routes as any, { name: "project" })
          store.dispatch("tagView/changeCurrent", project)
          store.dispatch("routeStore/changeRoute", project)
        } else {
          store.dispatch("tagView/changeCurrent", to)
          store.dispatch("routeStore/changeRoute", to)
        }
        next()
      }
    }
  } else {
    //不需要权限
    next()
  }

  //需要权限
  //   if (to.meta?.roles?.length) {
  //     const status = store.getters["userStore/loginStatus"] as ELoginStatus
  //     if (status === ELoginStatus.unlogin) {
  //       next({
  //         name: "login",
  //         params: {
  //           name: to.name,
  //         },
  //       })
  //     } else if (status === ELoginStatus.logining) {
  //       next({
  //         name: "waitingLogin",
  //         params: {
  //           name: to.name,
  //         },
  //       })
  //     } else {
  //       if (to.meta.roles.includes(store.getters["pemissionStore/role"])) {
  //         if (to.name === "blogCategory" || to.name === "blogIndex" || to.name === "blogDetail") {
  //           // console.log(to)

  //           const blog = getCurrentNamedRoute(routes as any, { name: "blog" })
  //           store.dispatch("tagView/changeCurrent", blog)
  //           store.dispatch("routeStore/changeRoute", blog)
  //         } else {
  //           store.dispatch("tagView/changeCurrent", to)
  //           store.dispatch("routeStore/changeRoute", to)
  //         }
  //         next()
  //       } else {
  //         showMessage({
  //           type: EMessageType.error,
  //           message: "you have no access to page " + to.name,
  //         })
  //       }
  //     }
  //   } else {
  //     next()
  //   }
})

export default router
