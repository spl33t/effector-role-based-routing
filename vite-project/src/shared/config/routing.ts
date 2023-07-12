import {
  createHistoryRouter,
  createRoute,
  RouteInstance,
} from "atomic-router";
import { createBrowserHistory } from "history";
import { values } from "lodash";
import { chainRouteAccessByRole, SESSION_ROLES, SessionRoles } from "./session";


type ExtractSlug<S extends string> = S extends `${string}/:${infer Slug}` ? { [Key in Slug]: any } : {}

type RouteConfig<AllRoutes extends Record<any, any>> = {
  path: string,
  notAccessRoles?: { [Key in SessionRoles]?: { redirectToRoute: keyof AllRoutes } }
}

type RoutesConfig<T extends Record<any, RouteConfig<T>>> = {
  [Key in keyof T]: RouteConfig<T>
}

type RoutesInstance<T extends Record<any, RouteConfig<T>>> = {
  [Key in keyof T]: Omit<RouteConfig<T>, "notAccessRoles"> & {
  route: RouteInstance<ExtractSlug<T[Key]["path"]>>,
  access: SessionRoles[number][]
}
}

function defineRoutes<Routes extends RoutesConfig<Routes>>(routes: Routes) {
  let result = {} as Record<any, RoutesInstance<any>[keyof Routes]>

  for (const routesKey in routes) {
    result[routesKey] = {
      ...routes[routesKey],
      route: createRoute(),
    } as unknown as RoutesInstance<any>[keyof Routes]
  }

  for (const routeKey in routes) {
    const routeConfig = routes[routeKey]

    if (routeConfig?.notAccessRoles) {
      const notAccessRoles = routeConfig.notAccessRoles as Record<any, { redirectToRoute: keyof Routes }> //warning!! hard coded redirectToRoute
      const rolesKeys = Object.keys(notAccessRoles) as unknown as SessionRoles

      result[routeKey].access = SESSION_ROLES.filter(s => !s.includes(rolesKeys))

      for (const roleKey in notAccessRoles) {
        const role = notAccessRoles[roleKey]
        const redirectRoute = result[role.redirectToRoute].route

        chainRouteAccessByRole({
          route: result[routeKey].route,
          notAccessRoles: rolesKeys,
          redirectRoute: redirectRoute
        })
      }
    } else {
      result[routeKey].access = SESSION_ROLES as unknown as string[]
    }
  }

  return result
}

export const routes = defineRoutes({
  home: { path: "/", },
  posts: {
    path: "/posts",
    notAccessRoles: {
      anonymous: { redirectToRoute: "auth" }
    }
  },
  post: {
    path: "/post/:id",
  },
  postEdit: {
    path: "/post-edit/:id",
    notAccessRoles: {
      anonymous: { redirectToRoute: "auth" },
    }
  },
  auth: {
    path: "/auth",
    notAccessRoles: {
      admin: { redirectToRoute: "home" }
    }
  },
} as const)


console.log(routes)

export const router = createHistoryRouter({
  routes: values(routes),
})

router.setHistory(createBrowserHistory())
