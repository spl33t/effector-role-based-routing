import { createEvent, createStore, Effect, sample, Event } from "effector";
import { chainRoute, RouteInstance, RouteParams, RouteParamsAndQuery } from "atomic-router";

export const roles = ["anonymous", "admin"] as const
export type Roles = typeof roles[number]
export function getRole(name: Roles) {
  return name
}

export const changeRole = createEvent()

export const $role = createStore<Roles>(getRole("anonymous"))
  .on(changeRole, (currentRole) => currentRole === "anonymous" ? getRole("admin") : getRole("anonymous"))


interface ChainParams {
  otherwise?: Event<void> | Effect<void, any, any>;
}

export function chainRouteAccessByRole<Params extends RouteParams>(
  route: RouteInstance<Params>,
  roles: Roles,
  otherwise: RouteInstance<any>
): RouteInstance<Params> {
  const sessionCheckStarted = createEvent<RouteParamsAndQuery<Params>>();

  const notAccess = sample({
    clock: [$role,sessionCheckStarted],
    source: $role,
    filter: (currentRole) => currentRole.includes(roles),
  });

  const alreadyAccess = sample({
    clock: [$role,sessionCheckStarted],
    source: $role,
    filter: (currentRole) => !currentRole.includes(roles),
  });

/*  const alreadyAuthenticated = sample({
    clock: sessionCheckStarted,
    source: $role,
  });

  const alreadyAnonymous = sample({
    clock: sessionCheckStarted,
    source: $role,
    filter: (status) => status === "anonymous",
  });*/

/*  sample({
    clock: [notAccess],
    source: { params: route.$params, query: route.$query },
    filter: route.$isOpened,
    target: sessionReceivedAnonymous,
  });*/

  if (otherwise) {
    sample({
      clock: notAccess,
      target: otherwise.open,
    });
  }

  return chainRoute({
    route,
    beforeOpen: sessionCheckStarted,
    openOn: [alreadyAccess],
    cancelOn: notAccess,
  });
}