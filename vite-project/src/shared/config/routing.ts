import { createHistoryRouter, createRoute, createRouterControls, RouteInstance } from "atomic-router";
import { sample } from "effector";
import { createBrowserHistory } from "history";
import { values } from "lodash";
import { appStarted } from "./init";

type RouteType = {
  path: string,
  route: RouteInstance<any>,
}

function defineRoutes<T extends Record<any, RouteType>>(routes: T) {
  return { routes, routesArray: values(routes) }
}

export const { routesArray, routes } = defineRoutes({
  home: {
    path: "/",
    route: createRoute()
  },
  post: {
    path: "post/:id",
    route: createRoute<{ id: number }>()
  },
  notFound: { path: "/not-found", route: createRoute() }
})

export const controls = createRouterControls()

export const router = createHistoryRouter({
  routes: routesArray,
  notFoundRoute: routes.notFound.route,
  controls,
})

sample({
  clock: appStarted,
  fn: () => createBrowserHistory(),
  target: router.setHistory,
});