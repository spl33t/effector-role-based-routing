import { createEffect, createEvent, createStore, sample } from "effector";
import { useUnit } from "effector-react";
import { routes } from "../../shared/config/routing";

const increment = createEvent()
const $count = createStore(0)

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

const $messageFromApi = createStore<string | null>(null)
  .on(getMessageFx.doneData, (_, payload) => payload)

sample({
  clock: routes.home.route.opened,
  target: getMessageFx
})

export const HomePage = () => {
  const count = useUnit($count)
  const messageFromApi = useUnit($messageFromApi)

  return (
    <div>
      <div>api message: {messageFromApi}</div>
      <button onClick={() => increment()}>Клик</button>
      {count}
    </div>
  );
};