import "./app.css"
import { Pages } from "../pages";
import { $role, changeRole } from "../shared/config/session"
import { useUnit } from "effector-react";


export function App() {
  const currentRole = useUnit($role)
  return (
    <div>
      <div>
       <div><button onClick={() => changeRole()}>change role</button></div>
       <div> <b>current role:</b> {currentRole}</div>
      </div>
      <Pages/>
    </div>)
}

