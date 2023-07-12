import { useUnit } from "effector-react";
import { $count, $messageFromApi, increment } from "./model";

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