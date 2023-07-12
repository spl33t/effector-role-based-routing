import { Link } from "atomic-router-react";
import { routes } from "../../shared/config/routing";

export const Header = () => {
  return (
    <div>
      <ul style={{ display: "flex", gap: 20 }}>
        <Link to={routes.home.route}>Home</Link>
        <Link to={routes.posts.route}>Posts</Link>
      </ul>
    </div>
  );
};
