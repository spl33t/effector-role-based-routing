import {
  createHistoryRouter,
  createRoute,
  RouteInstance,
} from "atomic-router";
import { createBrowserHistory } from "history";
import { values } from "lodash";
import { chainRouteAccessByRole, roles, Roles } from "../../entities/session/model";


// routes required const
// example
/*const { routes, routesArray } = defineRoutes({
  home: { path: "" },
  user: { path: "user/:id" },
  post: { path: "post/:slug" },
  notFound: { path: "not-found" }
} as const)*/
/*function defineRoutes<T extends Record<any, RouteConfig>>(routes: T) {
  let result = {}

  for (const routesKey in routes) {
    const route = routes[routesKey]

    // @ts-ignore
    result[routesKey] = {
      path: route.path,
      route: createRoute()
    }
  }

  return result as unknown as RoutesObject<T>
}*/

/*const routes = defineRoutes({
  home: { path: "/" },
  about: { path: "/about" },
  user: { path: "/user/:id" },
  post: { path: "/post/:slug" },
  notFound: { path: "not-found" }
} as const)*/


/*
type ExtractSlug<S extends string> = S extends `${string}/:${infer Slug}` ? { [Key in Slug]: any } : {}

type RouteConfig<AllRoutes extends Record<any, any>> = { path: string, access: { [Key in Roles]?: { redirect: keyof AllRoutes } } }

type RoutesObject<T extends Record<any, RouteConfig>> = {
  [Key in keyof T]: RouteObject<ExtractSlug<T[Key]["path"]>>
}

type RoutesConfig<T extends Record<any, RouteConfig<T>>> = {
  [Key in keyof T]: RouteConfig<T>
}

function createRouter<Routes extends RoutesConfig<Routes>>
(config: Omit<Parameters<typeof createHistoryRouter>[number], "routes" | "controls" | "notFoundRoute"> &
  { routes: Routes, notFoundRoute?: RouteConfig<any>, }) {

  let routes = {} as RoutesObject<Routes> & { notFoundRoute: RouteObject<any> }

  for (const routesKey in config.routes) {
    const route = config.routes[routesKey]

    // @ts-ignore
    routes[routesKey] = {
      path: route.path,
      route: createRoute()
    }


  }

  // @ts-ignore
  /!*  routes["notFoundRoute"] = {
      path: config.notFoundRoute.path,
      route: createRoute()
    }*!/

  const router = createHistoryRouter({
    ...config,
    routes: values(routes),
    //notFoundRoute: routes["notFoundRoute"].route
  })

  router.setHistory(createBrowserHistory())

  return {
    ...router,
    routesList: routes,
    controls: createRouterControls()
  }
}

export const router = createRouter({
  routes: {
    home: {
      path: "/",
      access: { admin: { redirect: "home" }, },
    },
    about: { path: "/about", access: { admin: { redirect: "about" } } },
    //user: { path: "/user/:id", access: "admin" },
    //post: { path: "/post/:slug", access: "admin" },
  } as const,
  //notFoundRoute: { path: "/not-found" },
})
*/


type ExtractSlug<S extends string> = S extends `${string}/:${infer Slug}` ? { [Key in Slug]: any } : {}

type RouteConfig<AllRoutes extends Record<any, any>> = {
  path: string,
  rules?: {
    redirectByRole: {
      [Key in Roles]?:
      { redirect: keyof AllRoutes }
    }
  }
}

type RoutesConfig<T extends Record<any, RouteConfig<T>>> = {
  [Key in keyof T]: RouteConfig<T>
}
type RoutesInstance<T extends Record<any, RouteConfig<T>>> = {
  [Key in keyof T]: RouteConfig<T> & {
  route: RouteInstance<ExtractSlug<T[Key]["path"]>>,
  access: Exclude<Roles, keyof Exclude<T[Key]["rules"]["redirectByRole"], null>>[number][]
}
}

function foo<Routes extends RoutesConfig<Routes>>(routes: Routes) {
  let result = {} as unknown as RoutesInstance<Routes>

  for (const routesKey in routes) {
    const route = routes[routesKey]
    const routeInstance = createRoute()

    // @ts-ignore
    result[routesKey] = {
      ...route,
      route: routeInstance,
    }
  }

  for (const resultKey in result) {
    const route = result[resultKey]

    if (route.rules?.redirectByRole) {
      const redirectByRole = route.rules.redirectByRole as Record<any, { redirect: keyof Routes }>
      const rolesKeys = Object.keys(redirectByRole) as unknown as Roles

      result[resultKey].access = roles.filter(s => !s.includes(rolesKeys))

      for (const roleKey in redirectByRole) {
        const role = redirectByRole[roleKey]
        chainRouteAccessByRole(route.route, rolesKeys, result[role.redirect].route)
      }
    } else {
      result[resultKey].access = roles as unknown as string[]
    }
  }

  return result
}

export const routes = foo({
  home: { path: "/", },
  posts: {
    path: "/posts",
    rules: {
      redirectByRole: { anonymous: { redirect: "auth" } }
    }
  },
  post: {
    path: "/post/:id",
  },
  postEdit: {
    path: "/post-edit/:id",
    rules: {
      redirectByRole: {
        anonymous: { redirect: "auth" },
      }
    }
  },
  auth: {
    path: "/login",
    rules: {
      redirectByRole: {
        admin: { redirect: "home" }
      }
    }
  },
} as const)


console.log(routes)

export const router = createHistoryRouter({
  routes: values(routes),
})

router.setHistory(createBrowserHistory())
