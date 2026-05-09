import type { RouteRecordRaw } from 'vue-router'

export enum AppRoutes {
  HOME = 'home',
  REQUESTER = 'requester',
  VALIDATOR = 'validator',
  REDIRECT = 'redirect',
}

export const RoutePaths = {
  [AppRoutes.HOME]: '/',
  [AppRoutes.REQUESTER]: '/requester',
  [AppRoutes.VALIDATOR]: '/validator',
  [AppRoutes.REDIRECT]: '/:pathMatch(.*)*',
} as const

export type AppRouteRecord<K extends AppRoutes> = RouteRecordRaw & {
  name: K
  path: (typeof RoutePaths)[K]
  meta?: {
    public?: boolean
    role?: 'Requester' | 'Validator'
  }
}

export type RoutesType = AppRouteRecord<AppRoutes>[]
