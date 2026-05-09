import {AppRoutes, RoutePaths, type RoutesType} from "@/router/types";
import {HomeViewPageAsync as HomeViewPage} from "@/pages/HomeViewPage";
import {RequesterViewPageAsync as RequesterViewPage} from "@/pages/RequesterViewPage";
import {ValidatorViewPageAsync as ValidatorViewPage} from "@/pages/ValidatorViewPage";
import {createRouter, createWebHistory} from "vue-router";

const routes: RoutesType = [
  {
    name: AppRoutes.HOME,
    path: RoutePaths[AppRoutes.HOME],
    component: HomeViewPage,
    meta: { public: true }
  },
  {
    name: AppRoutes.REQUESTER,
    path: RoutePaths[AppRoutes.REQUESTER],
    component: RequesterViewPage,
    meta: { role: 'Requester' }
  },
  {
    name: AppRoutes.VALIDATOR,
    path: RoutePaths[AppRoutes.VALIDATOR],
    component: ValidatorViewPage,
    meta: { role: 'Validator' },
  },
  {
    name: AppRoutes.REDIRECT,
    path: RoutePaths[AppRoutes.REDIRECT],
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})


router.beforeEach((to) => {
  const raw = localStorage.getItem('currentUser')
  const user = raw ? JSON.parse(raw) : null

  if (to.meta.public) return true
  if (!user) return RoutePaths[AppRoutes.HOME]
  if (to.meta.role && to.meta.role !== user.role) return RoutePaths[AppRoutes.HOME]

  return true
})

export default router
