import { createEvent, createStore, sample } from "effector";
import { chainRoute, RouteInstance, RouteParams, RouteParamsAndQuery } from "atomic-router";

export const SESSION_ROLES = ["anonymous", "admin"] as const
export type SessionRoles = typeof SESSION_ROLES[number]

export function getRoleName(name: SessionRoles) {
  return name
}

export const changeRole = createEvent()

export const $role = createStore<SessionRoles>(getRoleName("anonymous"))
  .on(changeRole, (currentRole) => currentRole === "anonymous" ? getRoleName("admin") : getRoleName("anonymous"))


export function chainRouteAccessByRole<Params extends RouteParams>(
  { notAccessRoles, redirectRoute, route }:
    {
      route: RouteInstance<Params>,
      notAccessRoles: SessionRoles,
      redirectRoute: RouteInstance<any>
    }
): RouteInstance<Params> {
  const sessionCheckStarted = createEvent<RouteParamsAndQuery<Params>>();

  const notAccess = sample({
    clock: [$role, sessionCheckStarted],
    source: $role,
    filter: (currentRole) => currentRole.includes(notAccessRoles),
  });

  const alreadyAccess = sample({
    clock: [$role, sessionCheckStarted],
    source: $role,
    filter: (currentRole) => !currentRole.includes(notAccessRoles),
  });

  sample({
    clock: notAccess,
    target: redirectRoute.open,
  });

  return chainRoute({
    route,
    beforeOpen: sessionCheckStarted,
    openOn: [alreadyAccess],
    cancelOn: notAccess,
  });
}