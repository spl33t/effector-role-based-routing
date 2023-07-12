import { createEffect, createEvent, createStore, sample } from "effector";

export const increment = createEvent()
export const $count = createStore(0)

sample({
  clock: increment,
  source: $count,
  fn: (count) => ++count,
  target: $count
})

const getMessageFx = createEffect(() => {
  return fetch("/api")
    .then((res) => res.text())
    .then((data) => data);
})

export const $messageFromApi = createStore<string | null>(null)
  .on(getMessageFx.doneData, (_, payload) => payload)

/*
sample({
  clock: router.routesList.home.route.opened,
  target: getMessageFx
})*/
